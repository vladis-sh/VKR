# Аудит фронтенда PrepAI

Дата: 2026-04-22
Область: `frontend/src` целиком + auth/API слой
Фокус: реальные баги + UX/accessibility

Перед компиляцией отчёта каждая критичная находка была перепроверена вручную по исходникам. Ложные срабатывания агентов (Modal scroll-lock уже обрабатывает Radix, `URL.revokeObjectURL` в codeRunner уже вызывается во всех трёх ветках, пустой cleanup в HelpersMenu не даёт утечки) из отчёта исключены.

Приоритеты:

- **[C] critical** — приводит к потере данных, падению, заметной поломке UX
- **[I] important** — реальная проблема, заметная пользователям, но не фатальная
- **[N] nice-to-have** — мелкие улучшения качества кода и UX

---

## [C] Critical

### C1. FOUC темы при загрузке страницы

`frontend/src/app/providers/ThemeProvider.tsx:7-9` + `frontend/src/features/theme/useThemeStore.ts:12-43`

`applyTheme()` вызывается только в `useEffect`, то есть после первого рендера. Если у пользователя в localStorage сохранено `theme: 'dark'`, страница сначала отрисовывается в светлой теме, затем скриптом добавляется класс `dark`. Получается заметный мигающий flash при каждом холодном открытии.

Фикс: добавить в `index.html` синхронный `<script>` до `<div id="root">`, который читает `localStorage.getItem('theme')` и ставит `document.documentElement.classList.add('dark')` до старта React. Это стандартная практика (см. Tailwind darkmode docs).

### C2. `checkAuth()` не перезапускается после `auth:logout`

`frontend/src/features/auth/useAuthStore.ts:37-46` + `frontend/src/App.tsx:14-19`

В сторе стоит `_initialized` флаг: `if (get()._initialized) return`. Событие `auth:logout` (диспатчится axios-интерцептором при провале refresh) только сбрасывает пользователя через `setUser(null)`, но не сбрасывает `_initialized`. Если после логаута пользователь снова войдёт (или токен восстановится иным путём), следующий `checkAuth()` при перемонтировании `AuthInitializer` (в dev/HMR, в тестах) не стрельнёт.

Фикс: в обработчике `auth:logout` сбрасывать `_initialized: false`, либо убрать этот флаг и полагаться на `isLoading`/`isAuthenticated`.

### C3. `checkAuth()` может висеть неограниченно

`frontend/src/features/auth/useAuthStore.ts:37-46`

Если `/auth/me` не отвечает (бэкенд лежит, сеть мертва), `isLoading` остаётся `true` навсегда. `PrivateRoute` показывает `FullPageSpinner` — пустой экран без какого-либо индикатора проблемы. Пользователь просто сидит и смотрит на спиннер.

Фикс: обернуть запрос `authApi.me()` в таймаут (5-8с), по таймауту считать пользователя неаутентифицированным и редиректить на `/login` или показать страницу ошибки.

### C4. Данные шага 1 регистрации теряются при перезагрузке

`frontend/src/features/auth/useRegisterStore.ts` (весь файл)

Zustand-стор без persist-middleware. Пользователь проходит шаг 1, попадает на `/register/profile`, случайно нажимает F5 — email и пароль потеряны. Если на шаге 2 в коде есть проверка типа `if (!regData.email) navigate('/register')`, пользователь молча откидывается назад и вводит всё заново.

Фикс: обернуть стор в `persist` с `sessionStorage` (чтобы не светить пароль в localStorage постоянно) и очищать после успешной регистрации.

### C5. Регистрация в 3 последовательных API-вызова без отката

`frontend/src/pages/auth/RegisterStep2Page.tsx` (~строки 266-285 по данным агента)

В процессе завершения регистрации делаются `registerProfile` → `uploadAvatar` → `registerLevel`. Если один из шагов провалится, предыдущие уже применены на сервере и откатить их некому. Пользователь увидит ошибку, но на бэке останется полусоздвнный аккаунт.

Фикс: либо объединить всё в один атомарный эндпоинт `register/complete`, либо менять порядок (сначала самый дешёвый/критичный, потом опциональные), либо на клиенте делать `try/catch` и при частичном провале явно говорить "регистрация не завершена, попробуйте сохранить профиль снова".

### C6. `knowledgeLevel` хардкодом `'junior'`

`frontend/src/pages/auth/RegisterStep2Page.tsx:~280`

`authApi.registerLevel({ knowledgeLevel: 'junior' })` прописан константой. Константы `KNOWLEDGE_LEVELS` в `shared/constants` существуют, но в регистрации не используются. Любой новый пользователь автоматически становится junior независимо от реального уровня.

Фикс: либо спросить уровень на шаге 2 (как раньше было шагом 3), либо убрать этот вызов и дать пользователю выставить уровень в профиле позже.

### C7. Отсутствует ErrorBoundary для lazy-чанков

`frontend/src/app/router/index.tsx:34-36`

`LazyWrapper` использует только `Suspense` с `FullPageSpinner`. Если chunk не загрузился (устаревший deploy, сеть), приложение упадёт и пользователь увидит белый экран без возможности что-либо сделать.

Фикс: завернуть `LazyWrapper` в `ErrorBoundary`, который при ошибке показывает "не удалось загрузить страницу" + кнопку "обновить страницу" (с `window.location.reload()`). Это особенно важно при hot deploy'ах — старые сессии клиентов ловят `ChunkLoadError`.

---

## [I] Important

### I1. `Input` не аннотирует ошибку для скринридеров

`frontend/src/shared/ui/Input.tsx:36-48, 64-66`

Когда передан `error`, визуально появляется красный бордер и текст под полем. Но на `<input>` нет `aria-invalid` и нет `aria-describedby`, связывающего поле с текстом ошибки. Пользователь скринридера не услышит, что поле невалидно и почему.

Фикс: добавить `aria-invalid={!!error}` и `aria-describedby={error ? \`${inputId}-error\` : undefined}`, а на `<p>` с ошибкой — `id={\`${inputId}-error\`}` и `role="alert"`.

### I2. Кнопка показа/скрытия пароля без `aria-label`

`frontend/src/shared/ui/Input.tsx:49-57`

Кнопка с иконкой Eye/EyeOff не имеет ни текста, ни `aria-label`, ни `focus-visible`-стилей. Скринридер прочитает просто "кнопка", клавиатурному пользователю не видно, что она в фокусе.

Фикс: `aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}` + классы `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` (либо завернуть в `<Button variant="ghost" size="icon">`).

### I3. `ToastContainer` не объявляет новые тосты скринридерам

`frontend/src/shared/ui/Toast.tsx:58-70`

Контейнер — обычный `<div>` без `role="status"` / `aria-live`. Когда появляется success/error-тост, скринридер молчит. Пользователи с нарушением зрения вообще не узнают, что что-то произошло.

Фикс: `<div role="status" aria-live="polite" aria-atomic="true" ...>` для информационных и success; для error можно сделать отдельную "assertive"-зону или выбирать `aria-live` по типу тоста.

### I4. `writeProgress` без обработки `QuotaExceededError`

`frontend/src/features/roadmap/useRoadmapProgress.ts:24-26`

`localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))` без try/catch. В Safari private mode и при заполненной квоте бросит исключение, которое пробросится наверх из `commit` → через `setState updater` → поломает ререндер или выплюнет uncaught в консоль. React 18 ещё и может откатить state в таком случае.

Фикс: try/catch вокруг `setItem`, при ошибке `toast.error('Не удалось сохранить прогресс')` и не апдейтить локальный стейт (или апдейтить без записи, с предупреждением).

### I5. LoginPage не использует `getApiErrorMessage`

`frontend/src/pages/auth/LoginPage.tsx:45-49`

Разбор ошибок сделан ad-hoc: `Array.isArray(raw) ? raw[0] : (raw ?? 'Неверный email или пароль')`. В `RegisterStep1Page` используется централизованный `getApiErrorMessage` — поведение отличается. Если бэк вернёт структурированную ошибку (например, `{errors: {email: '...'}}`), LoginPage покажет "Неверный email или пароль" вместо реальной причины.

Фикс: вынести разбор в один хелпер и использовать везде. Заодно унифицировать fallback-текст.

### I6. Форма логина без `autoFocus` на email

`frontend/src/pages/auth/LoginPage.tsx:77-85`

Пользователь заходит на `/login` — ему нужно кликнуть или табнуть в поле email, прежде чем начать ввод. Это типичная мелкая подлянка UX; особенно раздражает при частом входе в dev.

Фикс: добавить `autoFocus` на первый `Input` (email). Аналогично — на RegisterStep1Page.

### I7. Сервер-ошибка на LoginPage не имеет `role="alert"`

`frontend/src/pages/auth/LoginPage.tsx:97-101`

`{serverError && <p ...>{serverError}</p>}` — скринридер не озвучит появление ошибки. RegisterStep1Page хотя бы использует `role="alert"`.

Фикс: `role="alert"` + `aria-live="assertive"` + `aria-atomic="true"` на контейнере ошибки.

### I8. `retry: 1` в QueryClient ретраит и 4xx-ошибки

`frontend/src/app/providers/QueryProvider.tsx` (файл не показан, но по стандартной схеме)

Стандартный `retry: 1` в react-query перезапрашивает все ошибки, включая 400/401/403/404. Это лишний трафик на заведомо клиентских ошибках и задержка отображения ошибки пользователю.

Фикс: `retry: (failureCount, error) => { const status = error?.response?.status; if (status >= 400 && status < 500) return false; return failureCount < 1 }`.

### I9. В `TestSessionPage` два эффекта таймера с общим ref

`frontend/src/pages/tests/TestSessionPage.tsx:~201-213`

Два отдельных `useEffect` управляют таймером и `timeUpSubmitted.current`. В time-attack-режиме есть сценарий, когда таймер кончается, но `handleTimeUp()` не вызывается — пользователь залипает на вопросе без возможности финализировать сессию.

Фикс: консолидировать логику в единый `useTimer` хук с колбэком `onExpire`, передавать `handleTimeUp` через `useRef`/`useEvent`, чтобы не было stale closure.

### I10. `useTimer` создаёт новый `setInterval` до очистки старого

`frontend/src/features/tests/useTimer.ts:42-84`

При быстрых сменах `isRunning`/`countdown` возможна гонка: новый интервал стартует, когда старый ещё не отчищен (в тот же тик). Результат — таймер тикает дважды, обратный отсчёт "прыгает".

Фикс: в начале каждого эффекта, который стартует интервал, явно: `if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }`.

### I11. `LogoutModal` без `loading`-состояния

`frontend/src/pages/profile/ProfilePage.tsx:~153`

`onConfirm={logout}` — `logout()` асинхронный, но кнопка подтверждения не дизейблится на время запроса. Двойной клик → две параллельные `POST /auth/logout`. На бэке это обычно идемпотентно, но клиентский код тоже два раза сделает `setUser(null)` и может случайно состояние не тем.

Фикс: локальный `isLoggingOut` state вокруг вызова logout, передавать его в `LogoutModal` и дизейблить кнопку.

### I12. Массив `messages` в ChatMessages без состояния ошибки

`frontend/src/widgets/ChatMessages.tsx:~99-133`

Если `sessionDetail?.messages` undefined (запрос упал, 500-ка, таймаут), рендерится пустой контейнер. Пользователь видит "чат пустой", хотя на самом деле произошла ошибка.

Фикс: отдельно прокинуть `error` из родителя и показывать `EmptyState` с текстом ошибки + кнопкой "повторить".

### I13. `FavoritesPage.handleToggleFavorite` — возможная гонка оптимистичного апдейта

`frontend/src/pages/materials/FavoritesPage.tsx:~18-26`

Если пользователь быстро тыкает "в избранное" + открывает детальное модальное, оптимистичный апдейт в `selectedMaterial` и апдейт в списке могут разъехаться. Модалка показывает устаревший флаг favorite.

Фикс: тянуть `isFavorite` не из слепка `selectedMaterial`, а из актуального списка по `id`, либо добавить ключевой re-fetch при открытии.

### I14. Отсутствует `<ScrollRestoration />`

`frontend/src/app/router/index.tsx` (глобально)

При переходе между роутами скролл не сбрасывается в 0. Особенно заметно после `TestResultsPage` → назад: попадаешь в середину страницы.

Фикс: импортнуть `ScrollRestoration` из `react-router-dom` и положить в корневой layout либо в `RouterProvider`.

### I15. В `TestSessionPage` `GameOverModal` без focus trap и Escape-обработчика

`frontend/src/pages/tests/TestSessionPage.tsx:~83-102`

Кастомный модальный overlay без focus trap, `Escape` не закрывает, фокус гуляет под ним. В приложении есть `shared/ui/Modal` на Radix — стоит переиспользовать.

Фикс: заменить на `Modal` из `shared/ui`, либо в текущей реализации добавить `onKeyDown Escape`, `role="dialog"`, `aria-modal="true"`, и `useFocusTrap`.

### I16. Delete chat без подтверждения

`frontend/src/pages/chat/ChatPage.tsx:~292-300`

Клик по иконке корзины удаляет сессию без `confirm`. "Delete all" — с модалкой, одиночное — нет. Асимметрично и опасно: промах пальцем на мобиле = потерял переписку.

Фикс: подтверждение через `Modal` или inline confirm-state (две стадии: первый клик — кнопка "точно?", второй — удаление).

### I17. `<input type="file">` в Step2 не проверяет mime/size на клиенте до загрузки

`frontend/src/pages/auth/RegisterStep2Page.tsx` (логика avatarFile)

Пользователь может загрузить huge PNG или не-изображение. Сервер, вероятно, отбросит, но трафик уже съеден и UX плохой (долгая загрузка + ошибка в конце).

Фикс: на `onChange` проверять `file.size < 5MB` и `file.type.startsWith('image/')`, показывать понятную ошибку до отправки.

### I18. `RegisterStep2Page` crop-зона недоступна с клавиатуры

`frontend/src/pages/auth/RegisterStep2Page.tsx:~348-353`

Кроп работает только через `onPointerDown`/touch — клавиатурный пользователь не может сдвинуть рамку. Zoom-слайдер (линия ~394-403) доступен, но позиционирование — нет.

Фикс: либо добавить обработку стрелок (↑↓←→ для смещения) и `+/−` для zoom, либо дать возможность выбрать готовые preset-кадры (центр, верх, низ).

---

## [N] Nice-to-have

### N1. `API_URL` молча падает на localhost, если `VITE_API_URL` не задан

`frontend/src/shared/constants/index.ts:1`

`API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'`. В прод-сборке забытая env-переменная = тихий 404 на все запросы вместо явной ошибки.

Фикс: в production-сборке (`import.meta.env.PROD`) бросать при старте, если `VITE_API_URL` не задан.

### N2. Spinner `aria-label` хардкод на русском

`frontend/src/shared/ui/Spinner.tsx:23`

`aria-label="Загрузка..."` — если когда-нибудь будет i18n, этот текст не подхватится. Сейчас не болит, но нитрометит несогласованность.

Фикс: вынести в константы или принимать `ariaLabel` пропом.

### N3. `Modal.title` опционален — без него ломается a11y Radix

`frontend/src/shared/ui/Modal.tsx:9-10`

Radix Dialog требует `Dialog.Title` для `aria-labelledby`. В типе `title?: string` — если опустить, Radix выплюнет warning в консоли и модалка станет недоступной для скринридера.

Фикс: сделать `title: string` обязательным, либо добавить `Dialog.Title` с `className="sr-only"`-фолбэком, когда визуальный title не нужен.

### N4. Keys в опциях вопросов — по тексту

`frontend/src/pages/tests/SubtopicTestPage.tsx:~316` (по данным агента)

`key={option}` — если в будущем варианты перемешаются (shuffle) или появятся дубли текстов, React переиспользует неправильные ноды, ломая анимации.

Фикс: нормализовать опции как `{id, text}`, ключить по `id`.

### N5. Глобальный `matchMedia` listener в `useThemeStore`

`frontend/src/features/theme/useThemeStore.ts:46-53`

На уровне модуля вешается `addEventListener('change', ...)`, который никогда не снимается. Для app lifetime это не течёт, но в HMR dev и в юнит-тестах накопятся дубликаты.

Фикс: добавлять слушателя внутри `applyTheme()` с идемпотентным контролем, либо вешать его в `ThemeProvider` через `useEffect`.

### N6. `debounce` в `shared/lib/utils.ts` возвращает `void`

Сигнатура `T extends (...args: Parameters<T>) => ReturnType<T>` обещает тот же ReturnType, но по факту возвращает функцию с `void`. Мелкая ложь в типах.

Фикс: `debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void`.

### N7. `Badge variant="level"` без `level` рендерит пусто

`frontend/src/shared/ui/Badge.tsx:~30-47`

Забытый проп = невидимый бейдж, никаких предупреждений. Типобезопасностью не ловится.

Фикс: через discriminated union: `variant: 'level'` требует `level`.

### N8. Avatar 10-секундный таймаут захардкожен

`frontend/src/shared/ui/Avatar.tsx:48-50`

Медленная сеть → через 10с картинка считается сломанной, хотя может ещё грузиться.

Фикс: принимать `timeout` пропом, дефолт 15-20с.

### N9. Отсутствуют keyboard-shortcuts в LiveCoding

`frontend/src/pages/live-coding/LiveCodingTaskPage.tsx:~496-503`

Кнопки "Запустить"/"Отправить" без shortcut (Ctrl+Enter). Для редактора кода это стандарт, а без него приходится лезть мышкой.

Фикс: `useEffect` с `keydown` слушателем, `e.ctrlKey && e.key === 'Enter'` → runTests.

### N10. Bottom-Nav + Sidebar: фокус уходит под мобильную шторку

`frontend/src/pages/chat/ChatPage.tsx:~288-291`

На мобиле при открытой `Sidebar` Tab ведёт в контент сзади. Радикс-диалогов в Sidebar нет, фокус не замкнут.

Фикс: открытую Sidebar либо монтировать как Radix Dialog, либо при `showSidebar` ставить `inert` на основной контейнер.

### N11. Russian-hardcoded strings везде

Повсеместно (тесты, ошибки, label'ы). Понятно, что приложение пока моноязычное. Просто отметка: если позже захотите i18next, все эти строки придётся перелопачивать.

### N12. `Header.tsx` сложная цепочка вычисления title

`frontend/src/widgets/Header.tsx:~30-44`

Перегружено: две переменных title, if-цепочка. Упростить в одну map route→title.

---

## Сводка

- **Critical: 7** — FOUC темы, флаги стора аутентификации, таймаут checkAuth, потеря данных регистрации, нет rollback на 3-шаговой регистрации, хардкод уровня, отсутствие ErrorBoundary.
- **Important: 18** — преимущественно a11y (aria-invalid, aria-live, focus trap) и состояния гонок в таймерах/фаворитах + отсутствие scroll restoration.
- **Nice-to-have: 12** — типовые улучшения качества и консистентности.

Рекомендуемый порядок:

1. C1 (FOUC), C7 (ErrorBoundary), C4 (persist регистрации) — эти три дают заметный UX-скачок за день работы.
2. I1-I3 (a11y Input/Toast) — один подход, чинится быстро, закрывает большую часть аудиторных проблем.
3. C3 (timeout checkAuth), C2 (_initialized flag) — шлифовка auth-слоя.
4. Остальное — по мере рефакторинга соответствующих областей.

Все находки проверены против актуального кода на дату отчёта. В трёх случаях отчёты агентов содержали false-positives (Modal scroll lock делает Radix автоматически, revokeObjectURL в codeRunner вызывается во всех ветках, cleanup в HelpersMenu корректен для early-return-паттерна) — они в этот документ не попали.
