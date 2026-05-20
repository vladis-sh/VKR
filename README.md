

## Стек технологий

| Слой | Технологии |
|------|-----------|
| **Frontend** | React 18, TypeScript, Vite, React Router v6, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form + Zod, Framer Motion, Recharts |
| **Backend** | NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT (httpOnly cookies), Passport, Multer, Swagger |
| **ИИ** | Внешний провайдер ( Пока что используется Gemini в качестве бесплатной альтернативы )|
| **DevOps** | Docker, Docker Compose |

---

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
├── docker-compose.yml
└── README.md
```


