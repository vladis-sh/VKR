# Деплой на VPS (ihc.ru)

Весь продакшен живёт в Docker Compose: Postgres, бэкенд (NestJS), фронтенд
(статика Vite за nginx), внешний nginx с HTTPS и certbot для автопродления
сертификатов.

```
https://ваш-домен.ru
        │
      nginx (:80 → редирект, :443 TLS)
        ├── /api/...     → backend:3000  (префикс /api отрезается)
        ├── /uploads/... → общий volume с бэкендом (аватарки)
        └── /            → frontend (SPA-статика)
   postgres и backend наружу не торчат, только внутри docker-сети
```

## 0. Что купить на ihc.ru

1. **VPS**: [KVM VDS на NVMe](https://www.ihc.ru/kvmvds.html) — тариф с
   **2 ГБ RAM и больше**, ОС **Ubuntu 24.04** (или 22.04), панель управления
   (ISPmanager) не нужна.
2. **Домен** (рекомендуется): можно там же. В DNS создайте **A-запись `@` → IP
   сервера** и подождите, пока она начнёт резолвиться (`nslookup домен`).
   Без домена можно работать по IP — см. «Режим без домена» ниже.

После оплаты ihc.ru пришлёт IP сервера и root-пароль для SSH.

## 1. Подготовка сервера (один раз)

```bash
ssh root@<IP>
git clone <URL вашего репозитория> /opt/prepai
cd /opt/prepai
bash deploy/server-setup.sh
```

Скрипт ставит Docker, создаёт 2 ГБ swap (нужен для сборки фронта) и открывает
в файрволе только 22/80/443.

Если репозиторий не на GitHub/GitLab: закоммитьте всё локально и перенесите
через `git bundle`:

```powershell
# на Windows
git bundle create prepai.bundle main
scp prepai.bundle root@<IP>:/opt/
# на сервере: git clone /opt/prepai.bundle /opt/prepai
```

## 2. Настройка окружения

```bash
cd /opt/prepai
cp .env.production.example .env
nano .env
```

Обязательно заполнить:

- `DOMAIN` — домен без `https://` (или IP сервера);
- `CERTBOT_EMAIL` — почта для уведомлений Let's Encrypt;
- `POSTGRES_PASSWORD` — только буквы/цифры;
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — сгенерировать:
  `openssl rand -base64 48` (каждому своё значение);
- `DEEPSEEK_API_KEY` — иначе ИИ-чат не будет работать;
- `SMTP_*` — опционально; без них письма не отправляются по-настоящему
  (ссылки-превью писем печатаются в логи бэкенда).

Важно: создавайте `.env` прямо на сервере. Файл, скопированный из Windows,
может содержать CRLF-переводы строк и незаметно сломать значения.

## 3. Запуск

```bash
bash deploy/deploy.sh --seed
```

Скрипт сам: создаёт временный сертификат → собирает образы → поднимает
сервисы → получает настоящий сертификат Let's Encrypt → применяет схему БД
(`prisma db push`) → сидит демо-контент (`--seed`) → прогоняет smoke-тесты.

Повторный запуск безопасен. Обновление версии:

```bash
cd /opt/prepai && git pull && bash deploy/deploy.sh
```

(сид повторно не нужен, но `--seed` идемпотентен — данные не затирает).

## 4. Проверка

- `https://домен/` — открывается SPA;
- `https://домен/api/auth/me` — отвечает JSON с 401 (API жив);
- логин сид-пользователем: `admin@example.com` / `password123`
  (пароль задаётся в `backend/prisma/seed.ts` — для публичного стенда смените).

Логи: `docker compose logs -f backend` (или `nginx`, `postgres`).

## Бэкап БД

```bash
docker compose exec -T postgres pg_dump -U prepai prepai | gzip > /root/prepai-$(date +%F).sql.gz
```

Можно повесить в `crontab -e`:
`0 3 * * * cd /opt/prepai && docker compose exec -T postgres pg_dump -U prepai prepai | gzip > /root/prepai-$(date +\%F).sql.gz`

## Режим без домена (по IP)

В `.env` укажите `DOMAIN=<IP сервера>`. Деплой-скрипт пропустит Let's Encrypt
и оставит self-signed сертификат: сайт будет работать по
`https://<IP>`, но браузер покажет предупреждение (один раз принять).
Куки авторизации требуют HTTPS, поэтому «просто по http» работать не будет.

## Частые проблемы

| Симптом | Причина / решение |
|---|---|
| `certonly` падает | DNS ещё не указывает на сервер, либо порт 80 закрыт. Проверьте `nslookup домен` и `ufw status`. |
| Сборка фронта убита (OOM) | Нет swap — прогоните `deploy/server-setup.sh`, он создаст 2 ГБ. |
| `JWT_..._SECRET must be ... 32 characters` | Сгенерируйте секреты заново: `openssl rand -base64 48`. |
| Странные значения переменных | `.env` сохранён с CRLF. Пересоздайте его на сервере (`nano`). |
| ИИ-чат не отвечает | Пустой/неверный `DEEPSEEK_API_KEY`; смотрите `docker compose logs backend`. |
