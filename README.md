# PrepAI — Платформа подготовки к IT-собеседованиям

Полноценное веб-приложение для подготовки к техническим интервью с ИИ-ассистентом.

---

## Стек технологий

| Слой | Технологии |
|------|-----------|
| **Frontend** | React 18, TypeScript, Vite, React Router v6, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form + Zod, Framer Motion, Recharts |
| **Backend** | NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT (httpOnly cookies), Passport, Multer, Swagger |
| **ИИ** | Абстракция провайдера: Mock (встроенный) или Ollama (локальный LLM) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## Архитектурная схема

```
┌─────────────────────────────────────────────────────┐
│                     Nginx (:80)                     │
│  /            → Frontend (React SPA)                │
│  /auth/*      → Backend NestJS (:3000)              │
│  /materials/* → Backend NestJS                      │
│  /uploads/*   → Static files                        │
└─────────────────────────────────────────────────────┘
         │                          │
┌────────────────┐        ┌──────────────────┐
│   Frontend     │        │    Backend        │
│  React + Vite  │◄──────►│    NestJS         │
│  FSD структура │  REST  │    Prisma + PG    │
└────────────────┘        │    JWT Cookies    │
                          │    AI Provider    │
                          └──────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
             ┌──────────┐               ┌──────────────┐
             │PostgreSQL│               │ Ollama/Mock  │
             │   :5432  │               │  AI Provider │
             └──────────┘               └──────────────┘
```

## Структура папок

```
prepai/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # Регистрация, login, JWT
│   │   ├── materials/        # Учебные материалы
│   │   ├── chat/             # Чат с ИИ-ассистентом
│   │   ├── ai/               # Абстракция AI-провайдера
│   │   │   ├── providers/    # MockProvider, OllamaProvider
│   │   │   └── prompts/      # Промпты для ролей ИИ
│   │   ├── tests/            # Модуль тестирования
│   │   ├── stats/            # Статистика и лидерборд
│   │   ├── profile/          # Профиль пользователя
│   │   ├── notifications/    # Настройки уведомлений
│   │   └── common/           # Guards, decorators, filters
│   └── prisma/
│       ├── schema.prisma     # Схема БД
│       └── seed.ts           # 15 материалов + 80+ вопросов
│
├── frontend/                 # React SPA
│   └── src/
│       ├── app/              # Провайдеры, роутер
│       ├── pages/            # Все страницы (landing, auth, materials, chat, tests, stats, profile)
│       ├── widgets/          # Сложные UI-блоки (AppLayout, Sidebar, ChatMessages...)
│       ├── features/         # Логика: хуки, сторы (Zustand, TanStack Query)
│       ├── entities/         # TypeScript типы/интерфейсы
│       └── shared/           # UI-компоненты, API-клиент, утилиты
│
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## Быстрый запуск

### Вариант 1: Docker Compose (рекомендуется)

```bash
# 1. Скопировать переменные окружения
cp .env.example .env

# 2. Запустить все сервисы
docker-compose up -d

# 3. Применить миграции и наполнить БД
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed

# 4. Открыть приложение
# http://localhost  (через Nginx)
# http://localhost:5173  (прямой доступ к frontend)
# http://localhost:3000/api/docs  (Swagger)
```

### Вариант 2: Локальная разработка

**Требования:** Node.js 20+, PostgreSQL 14+

```bash
# ── Backend ──────────────────────────────────────
cd backend
cp .env.example .env
# Заполните DATABASE_URL в .env

npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
# API: http://localhost:3000
# Swagger: http://localhost:3000/api/docs

# ── Frontend ─────────────────────────────────────
cd frontend
cp .env.example .env
npm install
npm run dev
# App: http://localhost:5173
```

---

## Переменные окружения

### Backend (`backend/.env`)

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/prepai` |
| `JWT_SECRET` | Секрет для access-токенов (мин. 32 символа) | |
| `JWT_REFRESH_SECRET` | Секрет для refresh-токенов | |
| `FRONTEND_URL` | URL фронтенда для CORS | `http://localhost:5173` |
| `AI_PROVIDER` | Провайдер ИИ: `mock` или `ollama` | `mock` |
| `OLLAMA_URL` | URL Ollama API (если AI_PROVIDER=ollama) | `http://localhost:11434` |
| `OLLAMA_MODEL` | Модель Ollama | `llama3` |

### Frontend (`frontend/.env`)

| Переменная | Описание |
|-----------|----------|
| `VITE_API_URL` | URL backend API | 

---

## Как работает аутентификация

- **Тип**: JWT с httpOnly cookies (BFF-подход)
- **Access token**: 15 минут, cookie `access_token`
- **Refresh token**: 7 дней, cookie `refresh_token` (path: `/auth/refresh`)
- **Регистрация**: 3 шага — email/пароль → имя/аватар → уровень подготовки
- **Auto-refresh**: Axios interceptor автоматически обновляет токен при 401

Токены **никогда не хранятся** в localStorage. Cookies помечены `httpOnly` и `sameSite: lax`.

---

## Как работает чат с ИИ

1. Пользователь создаёт сессию, выбирая роль ассистента (HR / Technical / Algorithms)
2. Для каждой роли задан system prompt на русском языке
3. Сообщение отправляется на `/chat/sessions/:id/messages`
4. Backend передаёт историю + новое сообщение в AI-провайдер
5. Ответ сохраняется в БД и возвращается клиенту
6. Оптимистичный UI: сообщение пользователя отображается сразу

**Mock-режим** (`AI_PROVIDER=mock`): имитирует задержку 500-1500мс, возвращает реалистичные ответы без API-ключей.

**Ollama** (`AI_PROVIDER=ollama`): подключается к локальному Ollama. Установите [Ollama](https://ollama.ai) и запустите `ollama pull llama3`.

---

## Как работают тесты и статистика

### Режимы тестирования

| Режим | Логика |
|-------|--------|
| По темам | Фиксированный набор вопросов по выбранной теме |
| Борьба со временем | 5 минут, 30 вопросов из всех тем |
| Одна ошибка | Тест завершается после первого неверного ответа |
| Тест от ИИ | Вопросы генерируются ИИ в реальном времени |

### Жизненный цикл теста

1. `POST /tests/sessions` — создание сессии
2. Вопросы загружаются на фронтенд (не передаются серверу до завершения)
3. `POST /tests/sessions/:id/complete` — отправка всех ответов + время
4. Backend считает результат и сохраняет `TestAnswerHistory`
5. Статистика обновляется автоматически

### Статистика

Агрегируется на сервере: `/stats` возвращает суммарные показатели, `/stats/leaderboard` — рейтинг.

---

## Уведомления (Reminders)

Настройки хранятся в БД (модель `Reminder`). Frontend сохраняет время и дни недели. **Push-уведомления в браузере** не реализованы (требуют HTTPS и Service Worker), но архитектура готова для их добавления.

---

## Принятые допущения

1. **Без email-верификации** — регистрация завершается сразу после 3 шагов.
2. **Mock AI по умолчанию** — работает без API-ключей и внешних сервисов.
3. **Аватары хранятся локально** (`/uploads/avatars/`) — в продакшне следует заменить на S3-совместимое хранилище.
4. **Push-уведомления** — настройки сохраняются в БД, но браузерные пуши не отправляются (нет HTTPS в dev-режиме).
5. **Вопросы фиксированы на клиенте** при прохождении теста — нет server-side валидации каждого ответа в реальном времени (только при завершении).
6. **Лидерборд** считается по всем пользователям в БД включая seed-пользователей.

---

## Что можно расширить

- [ ] Email-верификация при регистрации
- [ ] OAuth (Google, GitHub)
- [ ] Push-уведомления через Web Push API
- [ ] Стриминг ответов ИИ (Server-Sent Events / WebSocket)
- [ ] Система достижений и бейджей
- [ ] Экспорт статистики в PDF
- [ ] Мобильное приложение (React Native с общим API)
- [ ] Административная панель
- [ ] Rate limiting на API
- [ ] Redis для кеширования лидерборда
