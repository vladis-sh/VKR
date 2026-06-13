#!/usr/bin/env bash
# Production deploy: build images, obtain TLS certificates, apply the DB schema.
# Run from anywhere inside the repo on the server:
#   bash deploy/deploy.sh           # deploy/update
#   bash deploy/deploy.sh --seed    # also seed demo users and content
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo 'ERROR: .env not found next to docker-compose.yml.' >&2
  echo 'Copy .env.production.example to .env and fill it in.' >&2
  exit 1
fi

# Read a var from .env (tolerates CRLF line endings and quoted values).
get_env() { sed -n "s/^$1=//p" .env | head -n 1 | tr -d '\r' | sed 's/^"//; s/"$//'; }

DOMAIN="$(get_env DOMAIN)"
CERTBOT_EMAIL="$(get_env CERTBOT_EMAIL)"

if [ -z "$DOMAIN" ]; then
  echo 'ERROR: DOMAIN is not set in .env' >&2
  exit 1
fi

SEED=0
for arg in "$@"; do
  case "$arg" in
    --seed) SEED=1 ;;
    *) echo "Unknown option: $arg (supported: --seed)" >&2; exit 1 ;;
  esac
done

# Bare IP or localhost => skip Let's Encrypt, keep a self-signed certificate.
if printf '%s' "$DOMAIN" | grep -Eq '^([0-9]+(\.[0-9]+){3}|localhost)$'; then
  SELF_SIGNED=1
else
  SELF_SIGNED=0
fi

# Run a shell inside the certbot image with the letsencrypt volume mounted.
cert_shell() {
  docker compose run --rm --no-deps --entrypoint sh certbot -c "$1"
}

make_self_signed() {
  cert_shell "mkdir -p /etc/letsencrypt/live/$DOMAIN \
    && openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
         -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
         -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
         -subj /CN=$DOMAIN \
    && touch /etc/letsencrypt/live/$DOMAIN/.self-signed"
}

echo '==> [1/5] Certificate bootstrap (nginx needs one to start)'
if ! cert_shell "test -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem" >/dev/null 2>&1; then
  echo '    No certificate yet, generating a temporary self-signed one.'
  make_self_signed
fi

echo '==> [2/5] Building images (the first build takes 5-10 minutes)'
docker compose --profile tools build

echo '==> [3/5] Starting services'
docker compose up -d

if [ "$SELF_SIGNED" -eq 0 ] && cert_shell "test -f /etc/letsencrypt/live/$DOMAIN/.self-signed" >/dev/null 2>&1; then
  echo "==> Requesting a Let's Encrypt certificate for $DOMAIN"
  if [ -z "$CERTBOT_EMAIL" ]; then
    echo 'ERROR: CERTBOT_EMAIL is not set in .env' >&2
    exit 1
  fi
  cert_shell "rm -rf /etc/letsencrypt/live/$DOMAIN /etc/letsencrypt/archive/$DOMAIN /etc/letsencrypt/renewal/$DOMAIN.conf"
  # --entrypoint is required: the compose service overrides the image
  # entrypoint with the renew loop, which would swallow the certonly args.
  if docker compose run --rm --no-deps --entrypoint certbot certbot certonly --webroot -w /var/www/certbot \
       -d "$DOMAIN" --email "$CERTBOT_EMAIL" --agree-tos --no-eff-email --non-interactive; then
    docker compose exec nginx nginx -s reload
    echo '    Certificate issued.'
  else
    echo "    Let's Encrypt failed (is DNS pointing to this server? is port 80 reachable?)." >&2
    echo '    Restoring the temporary self-signed certificate.' >&2
    make_self_signed
    docker compose exec nginx nginx -s reload
    exit 1
  fi
fi

echo '==> [4/5] Applying database schema (prisma db push)'
docker compose run --rm migrate

if [ "$SEED" -eq 1 ]; then
  echo '==> Seeding demo users and content'
  docker compose run --rm migrate npm run prisma:seed
fi

echo '==> [5/5] Smoke checks'
# On Windows/dev machines localhost may resolve to [::1] where another
# process listens; pin IPv4 for the local rehearsal.
CHECK_HOST="$DOMAIN"
[ "$DOMAIN" = 'localhost' ] && CHECK_HOST='127.0.0.1'
front_code=000
api_code=000
for _ in 1 2 3 4 5; do
  sleep 3
  front_code=$(curl -kso /dev/null -w '%{http_code}' "https://$CHECK_HOST/" || true)
  api_code=$(curl -kso /dev/null -w '%{http_code}' "https://$CHECK_HOST/api/auth/me" || true)
  front_code=${front_code:-000}
  api_code=${api_code:-000}
  if [ "$front_code" = '200' ] && [ "$api_code" = '401' ]; then
    break
  fi
done
echo "    https://$DOMAIN/            -> HTTP $front_code (expected 200)"
echo "    https://$DOMAIN/api/auth/me -> HTTP $api_code (expected 401)"

if [ "$front_code" = '200' ] && [ "$api_code" = '401' ]; then
  echo "==> Done: https://$DOMAIN"
else
  echo '==> Something is off. Check logs: docker compose logs -f nginx backend' >&2
  exit 1
fi
