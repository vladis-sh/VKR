# Как реализовать добавление контента в PrepAI

## 1. Что уже есть в проекте

Проект разделен на два приложения:

- `backend/` - NestJS API, Prisma ORM, PostgreSQL, JWT-авторизация через httpOnly cookies.
- `frontend/` - React + TypeScript + Vite, React Router, TanStack Query, Zustand, Tailwind CSS.

Контент сейчас хранится неоднородно:

| Тип контента | Где хранится сейчас | Как используется | Можно ли добавлять через UI сейчас |
|---|---|---|---|
| Учебные материалы | PostgreSQL, модель `Material` | `/materials`, избранное, markdown-модалка | Нет |
| Вопросы быстрых тестов | PostgreSQL, модель `Question` | `/tests/questions`, `/tests/topics`, результаты тестов | Нет |
| AI-вопросы | PostgreSQL, `Question.sourceType = ai` | создаются через `/tests/questions/ai` | Только генерацией AI |
| Каталог тестов по темам/подтемам | `frontend/src/entities/testCatalog.ts` | страницы `/app/tests/theme/...` | Нет, только правкой файла |
| Роадмапы | `frontend/src/entities/roadmap.ts` | страницы `/app/roadmaps` | Нет, только правкой файла |
| Live Coding задачи | `frontend/src/entities/liveCoding.ts` | страницы `/app/live-coding` | Нет, только правкой файла |

Главный вывод: в проекте уже есть база данных для материалов и обычных вопросов, но нет административного CRUD-функционала. Часть нового контента вообще зашита во фронтенд и требует пересборки приложения.

## 2. Как добавить контент сейчас, без новой разработки

Этот путь подходит для демо, ВКР и ручного наполнения небольшого объема данных.

### 2.1. Добавить учебный материал

Файл: `backend/prisma/seed.ts`

В секции `MATERIALS` добавить новый `prisma.material.upsert(...)`.

Пример структуры:

```ts
prisma.material.upsert({
  where: { id: 'mat-new-topic' },
  update: {},
  create: {
    id: 'mat-new-topic',
    title: 'Название материала',
    shortDescription: 'Краткое описание',
    level: KnowledgeLevel.junior,
    tags: ['JavaScript', 'Frontend'],
    content: `# Заголовок

Markdown-текст материала.
`,
  },
})
```

Важно: сейчас у seed-записей стоит `update: {}`. Это значит, что если материал с таким `id` уже есть в базе, повторный запуск seed его не обновит. Для редактирования существующего материала нужно либо временно удалить запись из БД, либо заполнить `update` теми же полями, которые нужно обновлять.

После изменения:

```bash
cd backend
npm run prisma:seed
```

Если проект запущен через Docker:

```bash
docker compose exec backend npm run prisma:seed
```

### 2.2. Добавить вопрос для быстрых тестов

Файл: `backend/prisma/seed.ts`

В секции `QUESTIONS`, массив `questionsData`, добавить объект:

```ts
{
  id: 'q-new-topic-1',
  topic: 'JavaScript',
  text: 'Текст вопроса?',
  options: ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'],
  correctAnswerIndex: 1,
  explanation: 'Почему правильный ответ B.',
  difficulty: KnowledgeLevel.junior,
}
```

После запуска seed вопрос попадет в таблицу `Question`. Список тем на бэкенде строится автоматически через `groupBy` в `TestsService.getTopics()`.

### 2.3. Добавить контент в новый каталог тестов

Файл: `frontend/src/entities/testCatalog.ts`

Добавлять нужно в массив `TEST_CATALOG_THEMES`: тема -> раздел -> подтема -> вопросы.

Этот каталог не связан напрямую с бэкенд-таблицей `Question`. Прогресс по нему хранится в `localStorage` через `useTestCatalogProgress`.

После изменения нужен rebuild frontend.

### 2.4. Добавить роадмап

Файл: `frontend/src/entities/roadmap.ts`

Нужно создать новый объект типа `Roadmap` и добавить его в массив:

```ts
export const ROADMAPS: Roadmap[] = [frontendRoadmap, backendRoadmap]
```

Прогресс по роадмапу хранится локально в браузере, не в базе.

### 2.5. Добавить Live Coding задачу

Файл: `frontend/src/entities/liveCoding.ts`

Добавить объект в `LIVE_CODING_TASKS`. Самое важное:

- `id` и `slug` должны быть уникальными.
- `starterCode` должен содержать код для `javascript` и/или `typescript`.
- `tests[].assertion` должен вызывать `candidate(...)`.

Пример теста:

```ts
{
  title: 'базовый пример',
  input: '[1, 2, 3]',
  expected: '6',
  assertion: 'assertDeepEqual(candidate([1, 2, 3]), 6)',
}
```

## 3. Нормальный функционал добавления контента

Рекомендуемый вариант: сделать админскую часть. Тогда контент можно будет добавлять без правки кода, без seed и без пересборки фронтенда.

Минимальный MVP для ВКР:

1. Добавить роли пользователей.
2. Реализовать CRUD для материалов.
3. Реализовать CRUD для вопросов быстрых тестов.
4. Добавить админские страницы на фронтенде.
5. Позже, если нужно, перенести роадмапы, каталог тестов и live coding задачи из TS-файлов в базу.

## 4. Изменения в базе данных

### 4.1. Роли пользователей

Файл: `backend/prisma/schema.prisma`

Добавить enum:

```prisma
enum UserRole {
  user
  admin
}
```

В модель `User` добавить поле:

```prisma
role UserRole @default(user)
```

### 4.2. Поля публикации и мягкого удаления

Для контента лучше не делать физическое удаление сразу. Особенно для вопросов: модель `TestAnswerHistory` связана с `Question`, и физическое удаление вопроса может удалить историю ответов.

В `Material`:

```prisma
updatedAt   DateTime @updatedAt
isPublished Boolean  @default(true)
deletedAt   DateTime?
```

В `Question`:

```prisma
updatedAt   DateTime @updatedAt
isPublished Boolean  @default(true)
deletedAt   DateTime?
```

После изменения схемы:

```bash
cd backend
npx prisma migrate dev --name add-content-admin
npx prisma generate
```

В Docker/production-сценарии:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma generate
```

## 5. Backend: авторизация администратора

Сейчас `JwtStrategy.validate()` возвращает пользователя из БД, поэтому роль можно читать из `request.user`.

Рекомендуемые файлы:

- `backend/src/common/decorators/roles.decorator.ts`
- `backend/src/common/guards/roles.guard.ts`

Идея:

```ts
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles)
```

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles?.length) return true

    const request = context.switchToHttp().getRequest()
    return roles.includes(request.user?.role)
  }
}
```

На админских эндпоинтах использовать:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
```

## 6. Backend: CRUD для материалов

Сейчас:

- `MaterialsController` умеет только читать материалы и управлять избранным.
- `MaterialsService` возвращает список без `content`, а детальную карточку с `content`.

Нужно добавить DTO:

- `backend/src/materials/dto/create-material.dto.ts`
- `backend/src/materials/dto/update-material.dto.ts`

Поля:

```ts
title: string
shortDescription: string
content: string
tags: string[]
level: 'junior' | 'middle' | 'senior'
isPublished?: boolean
```

Эндпоинты:

| Метод | URL | Назначение | Доступ |
|---|---|---|---|
| `POST` | `/materials` | создать материал | admin |
| `PATCH` | `/materials/:id` | обновить материал | admin |
| `DELETE` | `/materials/:id` | мягко удалить материал | admin |
| `GET` | `/materials` | список опубликованных материалов | user |
| `GET` | `/materials/:id` | опубликованный материал | user |
| `GET` | `/materials/admin` | список всех материалов, включая черновики | admin |

В `findAll()` и `findOne()` нужно добавить фильтр:

```ts
where.deletedAt = null
where.isPublished = true
```

Для админского списка фильтр `isPublished` не нужен.

## 7. Backend: CRUD для вопросов

Сейчас:

- `TestsController` умеет читать темы, получать вопросы, создавать/закрывать тестовые сессии и генерировать AI-вопросы.
- Ручного создания вопросов нет.

Добавить DTO:

- `backend/src/tests/dto/create-question.dto.ts`
- `backend/src/tests/dto/update-question.dto.ts`

Поля:

```ts
topic: string
text: string
options: string[]
correctAnswerIndex: number
explanation: string
difficulty: 'junior' | 'middle' | 'senior'
isPublished?: boolean
```

Валидация:

- `options` лучше ограничить ровно 4 вариантами, потому что текущий UI тестов рассчитан на A-D.
- `correctAnswerIndex` должен быть от `0` до `options.length - 1`.
- `topic` должен быть непустым.

Эндпоинты:

| Метод | URL | Назначение | Доступ |
|---|---|---|---|
| `GET` | `/tests/questions/admin` | админский список вопросов | admin |
| `POST` | `/tests/questions` | создать вопрос | admin |
| `PATCH` | `/tests/questions/:id` | обновить вопрос | admin |
| `DELETE` | `/tests/questions/:id` | мягко удалить вопрос | admin |

В пользовательском `getQuestions()` добавить:

```ts
where.sourceType = QuestionSource.static
where.isPublished = true
where.deletedAt = null
```

Для AI-вопросов можно оставить текущую логику, но лучше создавать их как `isPublished = false`, если они не должны попадать в общий пул после генерации.

## 8. Frontend: админский интерфейс

### 8.1. Тип пользователя

Файл: `frontend/src/entities/types.ts`

Добавить:

```ts
export type UserRole = 'user' | 'admin'

export interface User {
  // ...
  role?: UserRole
}
```

Также нужно обновить `ProfileService.getProfile()` и auth-ответы на бэкенде, чтобы они возвращали `role`.

### 8.2. Роуты

Файл: `frontend/src/app/router/index.tsx`

Добавить страницы:

```txt
/app/admin/materials
/app/admin/materials/new
/app/admin/materials/:id/edit
/app/admin/questions
/app/admin/questions/new
/app/admin/questions/:id/edit
```

Желательно сделать `AdminRoute`, который проверяет `user.role === 'admin'`.

### 8.3. API-клиенты

Можно расширить существующие файлы:

- `frontend/src/shared/api/materials.api.ts`
- `frontend/src/shared/api/tests.api.ts`

Или создать отдельный:

- `frontend/src/shared/api/admin.api.ts`

Пример для материалов:

```ts
createMaterial: (data: CreateMaterialPayload) =>
  apiClient.post<Material>('/materials', data),

updateMaterial: (id: string, data: UpdateMaterialPayload) =>
  apiClient.patch<Material>(`/materials/${id}`, data),

deleteMaterial: (id: string) =>
  apiClient.delete(`/materials/${id}`),
```

После мутаций инвалидировать кеши:

```ts
queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATERIALS })
queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEST_TOPICS })
```

### 8.4. Формы

В проекте уже есть `react-hook-form` и `zod`, поэтому лучше использовать их.

Форма материала:

- `title`
- `shortDescription`
- `level`
- `tags` как строка через запятую или отдельные chips
- `content` как textarea
- предпросмотр markdown через `ReactMarkdown`
- `isPublished`

Форма вопроса:

- `topic`
- `difficulty`
- `text`
- 4 поля для вариантов ответа
- radio/select для правильного ответа
- `explanation`
- `isPublished`

## 9. Что делать со статическим контентом фронтенда

Есть три варианта.

### Вариант A. Оставить как есть

Для ВКР это самый быстрый вариант: через админку управлять только `Material` и `Question`, а `testCatalog`, `roadmap`, `liveCoding` продолжать редактировать через TS-файлы.

Плюсы: минимум изменений.

Минусы: часть контента все равно требует разработки и пересборки.

### Вариант B. Перенести только роадмапы и live coding в БД через JSON

Можно добавить модели:

```prisma
model Roadmap {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  summary     String
  description String   @db.Text
  accent      String
  stages      Json
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?
}

model LiveCodingTask {
  id               String   @id @default(cuid())
  slug             String   @unique
  title            String
  category         String
  difficulty       String
  companies        String[]
  successRate      Int
  estimatedMinutes Int
  languages        String[]
  description      String   @db.Text
  constraints      String[]
  examples         Json
  starterCode      Json
  tests            Json
  solutionNotes    String[]
  isPublished      Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  deletedAt        DateTime?
}
```

Это быстрее, чем строить полностью нормализованную схему.

### Вариант C. Полностью перенести каталог тестов в БД

Нужно моделировать:

- `TestTheme`
- `TestSection`
- `TestSubtopic`
- `CatalogQuestion`

Это самый правильный, но самый объемный вариант. Его стоит делать только если в ВКР нужно показать полноценную CMS-логику для всех разделов.

## 10. Рекомендуемый порядок реализации

1. Добавить `UserRole` в Prisma и миграцию.
2. Сделать `RolesGuard` и `@Roles()`.
3. Вернуть `role` в профиле и auth-ответах.
4. Добавить CRUD для `Material`.
5. Добавить CRUD для `Question`.
6. Добавить админские страницы `/app/admin/materials` и `/app/admin/questions`.
7. Проверить, что обычный пользователь получает `403` на админских эндпоинтах.
8. Проверить, что созданный материал появляется в `/app/materials`.
9. Проверить, что созданный вопрос появляется в теме и участвует в тесте.
10. Отдельным этапом решить судьбу `testCatalog`, `roadmap` и `liveCoding`.

## 11. Критерии готовности

Функционал можно считать реализованным, если:

- администратор может создать, отредактировать, снять с публикации и удалить материал;
- материал сразу появляется в пользовательском списке без пересборки фронтенда;
- администратор может создать, отредактировать и снять с публикации вопрос;
- новый вопрос появляется в теме тестов;
- обычный пользователь не может вызвать admin-эндпоинты;
- удаление вопроса не ломает старую историю тестов;
- формы валидируют обязательные поля и показывают понятные ошибки;
- после мутаций React Query обновляет списки без ручного обновления страницы.

## 12. Загрузка изображений в материалы

Markdown-материалы почти всегда хотят содержать иллюстрации (схемы, скриншоты, диаграммы). Сейчас в проекте этого нет. Базовое решение - локальное файловое хранилище с раздачей через тот же NestJS.

### 12.1. Хранение

Простой вариант для ВКР: папка `backend/uploads/materials/<materialId>/` плюс раздача через `ServeStaticModule` либо явный `GET /uploads/...` контроллер. Для production-варианта стоит сразу заложить S3-совместимое хранилище (MinIO, Yandex Object Storage), но в защите ВКР локальный диск допустим - главное обозначить ограничение в тексте работы.

### 12.2. Эндпоинт загрузки

Использовать `@nestjs/platform-express` и `multer`:

```ts
@Post(':id/images')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, _file, cb) =>
        cb(null, `./uploads/materials/${req.params.id}`),
      filename: (_req, file, cb) =>
        cb(null, `${randomUUID()}${extname(file.originalname)}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
      const ok = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
      cb(ok.includes(file.mimetype) ? null : new BadRequestException('bad mime'), ok.includes(file.mimetype))
    },
  }),
)
uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
  return { url: `/uploads/materials/${id}/${file.filename}` }
}
```

### 12.3. Связь с материалом

Достаточно одной таблицы:

```prisma
model MaterialImage {
  id         String   @id @default(cuid())
  materialId String
  url        String
  createdAt  DateTime @default(now())
  material   Material @relation(fields: [materialId], references: [id], onDelete: Cascade)
}
```

Поле `Material.coverImageUrl String?` стоит добавить отдельно, чтобы не выбирать обложку каждый раз.

### 12.4. Frontend

В форме материала добавить кнопку "Загрузить изображение", которая:

1. Делает `POST /materials/:id/images`.
2. Получает `url`.
3. Вставляет в textarea `![](url)` в позицию курсора.

Для предпросмотра уже используется `ReactMarkdown`, поэтому изображение сразу появится в превью без дополнительной работы.

## 13. Массовый импорт и экспорт контента

Для ВКР это сильный демо-сценарий: показать, что админ может за минуту залить 100 вопросов из CSV, а не вбивать их по одному.

### 13.1. Импорт вопросов из CSV/JSON

Эндпоинт:

```
POST /tests/questions/import   (multipart, file=questions.csv|.json)
```

CSV-формат (первая строка - заголовки):

```
topic,difficulty,text,optionA,optionB,optionC,optionD,correctIndex,explanation
JavaScript,junior,"Что вернёт typeof null?",number,object,null,undefined,1,"Историческая особенность JS"
```

Сервис:

1. Парсит файл (`papaparse` либо `csv-parse`).
2. Валидирует каждую строку через тот же Zod/class-validator, что и одиночное создание.
3. Возвращает отчёт `{ created: number, skipped: Array<{row, reason}> }`.

Импорт делать в одной транзакции **только если файл маленький**. Для больших - пакетами по 200-500 строк, чтобы не держать длинную транзакцию.

### 13.2. Экспорт

```
GET /tests/questions/export?format=csv|json
GET /materials/export?format=json
```

Экспорт удобен для бэкапа и для миграции между средами (dev → prod).

### 13.3. Frontend

На странице `/app/admin/questions` добавить:

- кнопку "Импорт": открывает модалку с drag-and-drop файла + ссылкой на шаблон CSV;
- кнопку "Экспорт": дергает endpoint и сохраняет файл через `Blob` + `URL.createObjectURL`.

## 14. Аудит изменений и история контента

Без аудита сложно понять, кто и когда удалил вопрос или сломал материал. Для ВКР это плюс к разделу "соответствие промышленным стандартам".

### 14.1. Модель

```prisma
enum AuditAction {
  create
  update
  delete
  publish
  unpublish
}

model AuditLog {
  id         String      @id @default(cuid())
  userId     String
  entity     String      // "Material" | "Question"
  entityId   String
  action     AuditAction
  diff       Json?       // { before, after } по изменённым полям
  createdAt  DateTime    @default(now())
  user       User        @relation(fields: [userId], references: [id])

  @@index([entity, entityId])
  @@index([userId, createdAt])
}
```

### 14.2. Запись в лог

Самый чистый вариант - перехватчик/декоратор поверх админских мутаций:

```ts
@Injectable()
export class AuditInterceptor implements NestInterceptor { /* ... */ }
```

Либо вызывать `auditService.log(...)` явно из методов сервиса. Для MVP второй вариант проще, и его легче показать на защите.

Diff считать через `lodash.pickBy` по списку полей, которые реально изменились - не сохранять весь объект, иначе таблица распухнет.

### 14.3. UI

Страница `/app/admin/audit`:

- таблица: время, админ, действие, сущность, ссылка на запись;
- фильтры по сущности и админу;
- модалка "посмотреть diff" с подсветкой через `react-diff-viewer`.

## 15. Тестирование нового функционала

Без тестов админка - чёрный ящик. Для защиты ВКР наличие тестов сильно повышает оценку.

### 15.1. Backend (Jest + Supertest)

Юнит-тесты для сервисов (`MaterialsService`, `TestsService`):

- create: валидные данные → запись создана;
- create: невалидный `correctAnswerIndex` → `BadRequestException`;
- update: чужой id → `NotFoundException`;
- soft delete: `deletedAt` проставлен, в `findAll` запись не возвращается;
- list: фильтр `isPublished` работает.

E2E-тесты на эндпоинты:

- `POST /materials` без cookie → `401`;
- `POST /materials` под `user` → `403`;
- `POST /materials` под `admin` → `201` и материал в базе;
- импорт CSV: 3 валидные строки + 1 битая → отчёт с `created: 3, skipped: 1`.

Минимальный набор - 8-10 тестов на каждую CRUD-сущность.

### 15.2. Frontend (Vitest + React Testing Library)

- `AdminRoute` редиректит обычного пользователя;
- форма материала показывает ошибки валидации;
- после успешного `POST` срабатывает `invalidateQueries` (мокать `apiClient`).

E2E через Playwright (опционально для ВКР, но красиво на защите):

- сценарий "залогиниться как админ → создать материал → проверить, что он появился в `/app/materials`".

### 15.3. Что считать достаточным

Для ВКР хватает:

- покрытие сервисов админки около 70%;
- хотя бы один happy-path E2E на каждую сущность;
- guard-тесты на 401/403.

## 16. Безопасность и валидация

### 16.1. XSS в markdown

Контент материалов пишет администратор, но это не повод доверять. Если в `ReactMarkdown` оставить `rehype-raw` без санитизации, админ (или взломанный аккаунт админа) сможет вставить `<script>` и атаковать пользователей.

Решение:

- на бэкенде при сохранении прогонять контент через `sanitize-html` со whitelist'ом тегов;
- на фронтенде использовать `ReactMarkdown` без `rehype-raw` либо с `rehype-sanitize`.

### 16.2. Валидация DTO

Включить глобальный `ValidationPipe`:

```ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))
```

Это автоматически отрезает поля, которые админ не должен передавать (например, `id`, `createdAt`).

### 16.3. Rate limiting

На админских эндпоинтах атак "10000 материалов в секунду" быть не должно, но для импорта и для AI-генерации лимит полезен:

```ts
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60_000 } })
```

`@nestjs/throttler` уже хорошо ложится на проект.

### 16.4. Защита истории тестов

Соблюдать инвариант: вопрос, на который уже отвечали, физически не удалять. Только soft delete. В коде это означает, что для админа `DELETE /tests/questions/:id` всегда выставляет `deletedAt`, а отдельный "hard delete" не выводить наружу.

## 17. Индексы и производительность БД

При росте контента запросы начнут тормозить. Дешевле сразу заложить индексы.

В `Material`:

```prisma
@@index([deletedAt, isPublished])
@@index([level])
```

В `Question`:

```prisma
@@index([topic, deletedAt, isPublished])
@@index([difficulty])
@@index([sourceType])
```

Для поиска по тегам материалов проще всего использовать массив строк + `array_contains` через Prisma. Если поиск по тегам станет узким местом - вынести теги в отдельную таблицу `Tag` + `MaterialTag`.

Пагинация: на админских списках сразу отдавать по 20-50 записей с `?page=&limit=`. Без этого таблица из 1000 вопросов положит UI.

## 18. Короткая рекомендация

Для защиты ВКР я бы реализовал MVP так: роли + админка для материалов и вопросов + soft delete + базовое тестирование. Это хорошо ложится на текущую архитектуру, потому что `Material` и `Question` уже есть в PostgreSQL и уже используются пользовательскими страницами.

Если останется время - в порядке убывания пользы:

1. Массовый импорт вопросов из CSV (раздел 13) - сильный демо-сценарий за небольшие усилия.
2. Загрузка изображений в материалы (раздел 12) - материалы становятся реально читаемыми.
3. Аудит изменений (раздел 14) - выглядит профессионально на защите.
4. Перенос роадмапов и live coding в БД (вариант B из раздела 9).

Каталог тестов и вариант C из раздела 9 - это уже отдельная история про полноценную CMS, и в рамки одной ВКР она помещается с трудом. Лучше упомянуть как направление дальнейшего развития.
