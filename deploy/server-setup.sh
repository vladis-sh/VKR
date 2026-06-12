#!/usr/bin/env bash
# One-time VPS bootstrap for Ubuntu 22.04/24.04. Run as root:
#   bash deploy/server-setup.sh
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo '==> Updating packages'
apt-get update
apt-get upgrade -y
apt-get install -y curl git ufw

# 2G swap: the Vite/tsc build is memory-hungry on small VPS plans.
if ! swapon --show | grep -q .; then
  echo '==> Creating 2G swap'
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

if ! command -v docker >/dev/null 2>&1; then
  echo '==> Installing Docker'
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

echo '==> Configuring firewall (22, 80, 443)'
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo '==> Done. Next: clone the project, create .env, run: bash deploy/deploy.sh'
