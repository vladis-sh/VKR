export type RoadmapNodeKind = 'required' | 'alternative' | 'optional'

export interface RoadmapResource {
  title: string
  url: string
  source: string
  language?: 'ru' | 'en'
}

export interface RoadmapNode {
  id: string
  title: string
  summary: string
  kind: RoadmapNodeKind
  resources?: RoadmapResource[]
}

export interface RoadmapStage {
  id: string
  title: string
  intro: string
  nodes: RoadmapNode[]
}

export interface Roadmap {
  slug: string
  title: string
  summary: string
  description: string
  accent: string
  stages: RoadmapStage[]
}

export const KIND_LABELS: Record<RoadmapNodeKind, string> = {
  required: 'База',
  alternative: 'Альтернатива',
  optional: 'По желанию',
}

const r = (
  title: string,
  url: string,
  source: string,
  language: 'ru' | 'en' = 'ru'
): RoadmapResource => ({ title, url, source, language })

const n = (
  id: string,
  title: string,
  summary: string,
  kind: RoadmapNodeKind = 'required',
  resources: RoadmapResource[] = []
): RoadmapNode => ({ id, title, summary, kind, resources })

const frontendRoadmap: Roadmap = {
  slug: 'frontend',
  title: 'Frontend-разработчик',
  summary: 'Полный путь от нуля до junior/middle frontend',
  description:
    'Роадмап построен по мотивам roadmap.sh. Проходите стадии по порядку — разберётесь от базовых веб-технологий до современных фреймворков, TypeScript, тестирования и SSR.',
  accent: 'from-sky-500/20 via-blue-500/10 to-indigo-500/5',
  stages: [
    {
      id: 'internet',
      title: 'Как работает интернет',
      intro: 'Базовые понятия, без которых всё остальное — магия.',
      nodes: [
        n(
          'internet-basics',
          'Принцип работы интернета',
          'Клиенты, серверы, IP-адреса, маршрутизация, что происходит между вкладкой и серверной машиной.',
          'required',
          [
            r('Как работает интернет', 'https://developer.mozilla.org/ru/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work', 'MDN'),
            r('Введение: браузер и клиент-сервер', 'https://learn.javascript.ru/intro', 'learn.javascript.ru'),
            r('Что происходит, когда вы вводите URL', 'https://habr.com/ru/articles/489884/', 'Habr'),
            r('Хекслет: основы веб-разработки', 'https://ru.hexlet.io/courses/web_basics', 'Хекслет'),
            r('Курс «Веб-разработка для начинающих»', 'https://stepik.org/course/1547/', 'Stepik'),
          ]
        ),
        n(
          'http',
          'HTTP и HTTPS',
          'Методы, коды ответов, заголовки, разница между HTTP/1.1, HTTP/2 и HTTP/3.',
          'required',
          [
            r('HTTP — обзор', 'https://developer.mozilla.org/ru/docs/Web/HTTP/Overview', 'MDN'),
            r('HTTP-методы: GET, POST и другие', 'https://developer.mozilla.org/ru/docs/Web/HTTP/Methods', 'MDN'),
            r('Fetch и сетевые методы', 'https://learn.javascript.ru/network', 'learn.javascript.ru'),
            r('HTTP: коды состояний и заголовки', 'https://developer.mozilla.org/ru/docs/Web/HTTP/Status', 'MDN'),
            r('HTTP-заголовки на пальцах', 'https://habr.com/ru/companies/selectel/articles/740670/', 'Habr'),
          ]
        ),
        n(
          'dns',
          'DNS и домены',
          'Как доменные имена превращаются в IP, что такое A/CNAME/MX-записи и TTL.',
          'required',
          [
            r('URL и доменные имена', 'https://learn.javascript.ru/url', 'learn.javascript.ru'),
            r('DNS — введение для разработчиков', 'https://habr.com/ru/companies/selectel/articles/449482/', 'Habr'),
            r('Как работает DNS-сервер', 'https://habr.com/ru/articles/329788/', 'Habr'),
            r('DNS — MDN глоссарий', 'https://developer.mozilla.org/ru/docs/Glossary/DNS', 'MDN'),
            r('Как работает DNS — видео от Cloudflare', 'https://www.cloudflare.com/learning/dns/what-is-dns/', 'Cloudflare', 'en'),
          ]
        ),
        n(
          'browsers',
          'Как работают браузеры',
          'Рендеринг, critical rendering path, reflow и repaint.',
          'required',
          [
            r('Браузерное окружение', 'https://learn.javascript.ru/browser-environment', 'learn.javascript.ru'),
            r('Что происходит, когда вы вводите URL', 'https://habr.com/ru/articles/489884/', 'Habr'),
            r('Как работают браузеры — подробно', 'https://web.dev/articles/howbrowserswork?hl=ru', 'web.dev'),
            r('Критический путь рендеринга', 'https://developer.mozilla.org/ru/docs/Web/Performance/Critical_rendering_path', 'MDN'),
            r('Песочница браузера и многопроцессность', 'https://habr.com/ru/companies/ruvds/articles/340176/', 'Habr'),
          ]
        ),
        n(
          'hosting',
          'Хостинг и деплой',
          'Статический хостинг, CDN, Vercel, Netlify, GitHub Pages.',
          'optional',
          [
            r('GitHub Pages: бесплатный хостинг', 'https://docs.github.com/ru/pages/getting-started-with-github-pages/about-github-pages', 'GitHub Docs'),
            r('Документация Vercel', 'https://vercel.com/docs', 'Vercel', 'en'),
            r('Документация Netlify', 'https://docs.netlify.com/', 'Netlify', 'en'),
            r('Что такое CDN и зачем он нужен', 'https://habr.com/ru/companies/selectel/articles/425667/', 'Habr'),
            r('Деплой React-приложений', 'https://create-react-app.dev/docs/deployment/', 'Create React App', 'en'),
          ]
        ),
      ],
    },
    {
      id: 'html',
      title: 'HTML',
      intro: 'Разметка, семантика, доступность и формы.',
      nodes: [
        n(
          'html-basics',
          'Основы HTML',
          'Структура документа, теги, атрибуты, валидность разметки.',
          'required',
          [
            r('Раздел HTML', 'https://doka.guide/html/', 'Doka Guide'),
            r('Бесплатный курс «HTML и CSS»', 'https://htmlacademy.ru/courses/41', 'HTML Academy'),
            r('Изучение HTML', 'https://developer.mozilla.org/ru/docs/Learn/HTML', 'MDN'),
            r('Хекслет: основы HTML', 'https://ru.hexlet.io/courses/introduction_to_html', 'Хекслет'),
            r('Изучение HTML — MDN Learn', 'https://developer.mozilla.org/ru/docs/Learn/HTML/Introduction_to_HTML', 'MDN'),
          ]
        ),
        n(
          'html-semantic',
          'Семантика',
          'article, section, nav, header, footer, aside — когда что использовать.',
          'required',
          [
            r('Семантическая вёрстка — MDN Learn', 'https://developer.mozilla.org/ru/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure', 'MDN'),
            r('Семантика — MDN глоссарий', 'https://developer.mozilla.org/ru/docs/Glossary/Semantics', 'MDN'),
            r('Семантические элементы — MDN', 'https://developer.mozilla.org/ru/docs/Web/HTML/Element', 'MDN'),
            r('Зачем нужна семантическая вёрстка', 'https://habr.com/ru/articles/445156/', 'Habr'),
            r('Accessible semantic HTML — web.dev', 'https://web.dev/learn/html/semantic-html', 'web.dev', 'en'),
          ]
        ),
        n(
          'html-forms',
          'Формы и валидация',
          'input, label, select, textarea, required, pattern, :invalid.',
          'required',
          [
            r('Тег <form>', 'https://doka.guide/html/form/', 'Doka Guide'),
            r('Веб-формы — учебник', 'https://developer.mozilla.org/ru/docs/Learn/Forms', 'MDN'),
            r('HTML5-валидация форм', 'https://developer.mozilla.org/ru/docs/Learn/Forms/Form_validation', 'MDN'),
            r('Как делать удобные формы', 'https://habr.com/ru/companies/htmlacademy/articles/338224/', 'Habr'),
            r('Formidable forms (learn HTML)', 'https://web.dev/learn/html/forms', 'web.dev', 'en'),
          ]
        ),
        n(
          'html-a11y',
          'Доступность (a11y)',
          'ARIA-атрибуты, управление с клавиатуры, контрастность, screen-reader-friendly разметка.',
          'required',
          [
            r('Доступность интерфейсов', 'https://doka.guide/a11y/', 'Doka Guide'),
            r('Введение в ARIA', 'https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA', 'MDN'),
            r('Доступность — большой гайд', 'https://htmlacademy.ru/blog/boost/frontend/accessibility', 'HTML Academy'),
            r('A11Y-основы на web.dev', 'https://web.dev/learn/accessibility', 'web.dev', 'en'),
            r('WCAG 2.1 — рекомендации W3C', 'https://www.w3.org/WAI/standards-guidelines/wcag/', 'W3C WAI', 'en'),
          ]
        ),
        n(
          'html-seo',
          'SEO-основы',
          'Мета-теги, Open Graph, schema.org, sitemap и robots.txt.',
          'optional',
          [
            r('Meta-теги — MDN', 'https://developer.mozilla.org/ru/docs/Web/HTML/Element/meta', 'MDN'),
            r('Руководство для начинающих по SEO', 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ru', 'Google Search Central'),
            r('Meta-теги: шпаргалка', 'https://habr.com/ru/articles/496764/', 'Habr'),
            r('schema.org — справочник', 'https://schema.org/docs/gs.html', 'schema.org', 'en'),
            r('Мета-теги name — MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name', 'MDN', 'en'),
          ]
        ),
      ],
    },
    {
      id: 'css',
      title: 'CSS',
      intro: 'От селекторов до сеток и адаптивной вёрстки.',
      nodes: [
        n(
          'css-basics',
          'Основы CSS',
          'Селекторы, специфичность, каскад, наследование, box-model.',
          'required',
          [
            r('Раздел CSS', 'https://doka.guide/css/', 'Doka Guide'),
            r('Справочник CSS — MDN', 'https://developer.mozilla.org/ru/docs/Web/CSS', 'MDN'),
            r('Блог о CSS', 'https://htmlacademy.ru/blog/css', 'HTML Academy'),
            r('Хекслет: основы CSS', 'https://ru.hexlet.io/courses/introduction_to_css', 'Хекслет'),
            r('Каскад, специфичность, наследование', 'https://doka.guide/css/cascade/', 'Doka Guide'),
          ]
        ),
        n(
          'css-flexbox',
          'Flexbox',
          'Одномерные раскладки, justify/align, flex-grow/shrink.',
          'required',
          [
            r('Полное руководство по Flexbox', 'https://doka.guide/css/flexbox-guide/', 'Doka Guide'),
            r('CSS Flexbox — MDN', 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_flexible_box_layout', 'MDN'),
            r('A Guide to Flexbox', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', 'CSS-Tricks', 'en'),
            r('Flexbox Froggy (интерактивно)', 'https://flexboxfroggy.com/#ru', 'Flexbox Froggy'),
            r('Основы Flexbox — MDN', 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox', 'MDN'),
          ]
        ),
        n(
          'css-grid',
          'CSS Grid',
          'Двумерные раскладки, grid-template, auto-fill/auto-fit.',
          'required',
          [
            r('Полное руководство по Grid', 'https://doka.guide/css/grid-guide/', 'Doka Guide'),
            r('Learn CSS Grid — web.dev', 'https://web.dev/learn/css/grid', 'web.dev', 'en'),
            r('Grid Garden (интерактивно)', 'https://cssgridgarden.com/#ru', 'Grid Garden'),
            r('Grid — базовые концепции', 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout', 'MDN'),
            r('Полное руководство CSS-Tricks', 'https://css-tricks.com/snippets/css/complete-guide-grid/', 'CSS-Tricks', 'en'),
          ]
        ),
        n(
          'css-responsive',
          'Адаптивность',
          'Media queries, mobile-first, container queries.',
          'required',
          [
            r('Адаптивные изображения — MDN Learn', 'https://developer.mozilla.org/ru/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images', 'MDN'),
            r('Адаптивная вёрстка — MDN Learn', 'https://developer.mozilla.org/ru/docs/Learn/CSS/CSS_layout/Responsive_Design', 'MDN'),
            r('Media queries — MDN', 'https://developer.mozilla.org/ru/docs/Web/CSS/Media_Queries/Using_media_queries', 'MDN'),
            r('@container — MDN', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@container', 'MDN', 'en'),
            r('Mobile-first и 10 главных правил', 'https://habr.com/ru/companies/htmlacademy/articles/256893/', 'Habr'),
          ]
        ),
        n(
          'css-variables',
          'Переменные и темы',
          'Custom properties, prefers-color-scheme, темная тема.',
          'required',
          [
            r('CSS-переменные', 'https://doka.guide/css/custom-properties/', 'Doka Guide'),
            r('prefers-color-scheme', 'https://developer.mozilla.org/ru/docs/Web/CSS/@media/prefers-color-scheme', 'MDN'),
            r('Темизация через CSS-переменные', 'https://habr.com/ru/companies/yandex/articles/551522/', 'Habr'),
            r('Dark mode через CSS — CSS-Tricks', 'https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/', 'CSS-Tricks', 'en'),
            r('CSS Custom Properties — полный гайд', 'https://css-tricks.com/a-complete-guide-to-custom-properties/', 'CSS-Tricks', 'en'),
          ]
        ),
        n(
          'css-animations',
          'Анимации и переходы',
          'transition, @keyframes, transform и GPU-ускорение.',
          'optional',
          [
            r('CSS-анимации', 'https://doka.guide/css/animation/', 'Doka Guide'),
            r('Производительные анимации', 'https://web.dev/articles/animations-guide?hl=ru', 'web.dev'),
            r('Transitions — MDN', 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_transitions/Using_CSS_transitions', 'MDN'),
            r('Всё о CSS transform', 'https://doka.guide/css/transform/', 'Doka Guide'),
            r('CSS-анимации — MDN', 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_animations/Using_CSS_animations', 'MDN'),
          ]
        ),
      ],
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      intro: 'Язык, без которого фронтенда нет.',
      nodes: [
        n(
          'js-syntax',
          'Синтаксис и основы',
          'Типы данных, операторы, управляющие конструкции, функции.',
          'required',
          [
            r('Введение в JavaScript', 'https://learn.javascript.ru/first-steps', 'learn.javascript.ru'),
            r('Раздел JS — Doka Guide', 'https://doka.guide/js/', 'Doka Guide'),
            r('Руководство по JS — MDN', 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide', 'MDN'),
            r('Хекслет: основы JavaScript', 'https://ru.hexlet.io/courses/javascript', 'Хекслет'),
            r('Канал Ulbi TV — JS с нуля', 'https://www.youtube.com/@ulbitv', 'YouTube'),
          ]
        ),
        n(
          'js-dom',
          'DOM API',
          'querySelector, event delegation, создание и удаление элементов.',
          'required',
          [
            r('Документ', 'https://learn.javascript.ru/document', 'learn.javascript.ru'),
            r('События', 'https://learn.javascript.ru/events', 'learn.javascript.ru'),
            r('Введение в DOM', 'https://developer.mozilla.org/ru/docs/Web/API/Document_Object_Model/Introduction', 'MDN'),
            r('Работа с DOM — Doka Guide', 'https://doka.guide/js/dom/', 'Doka Guide'),
            r('Делегирование событий', 'https://learn.javascript.ru/event-delegation', 'learn.javascript.ru'),
          ]
        ),
        n(
          'js-fetch',
          'Fetch API',
          'Запросы, методы, заголовки, обработка ошибок, AbortController.',
          'required',
          [
            r('Fetch', 'https://learn.javascript.ru/fetch', 'learn.javascript.ru'),
            r('Использование Fetch', 'https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch', 'MDN'),
            r('AbortController', 'https://learn.javascript.ru/fetch-abort', 'learn.javascript.ru'),
            r('Fetch — Doka Guide', 'https://doka.guide/js/fetch/', 'Doka Guide'),
            r('Обработка ошибок в fetch', 'https://habr.com/ru/articles/498026/', 'Habr'),
          ]
        ),
        n(
          'js-es6',
          'ES6+',
          'let/const, стрелочные функции, деструктуризация, spread, модули.',
          'required',
          [
            r('Современный JavaScript', 'https://learn.javascript.ru/js', 'learn.javascript.ru'),
            r('Модули в JS', 'https://learn.javascript.ru/modules', 'learn.javascript.ru'),
            r('ES6 за 10 минут', 'https://doka.guide/js/destructuring-assignment/', 'Doka Guide'),
            r('Стрелочные функции — MDN', 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions', 'MDN'),
            r('Всё, что нужно знать про ES6+', 'https://habr.com/ru/articles/305900/', 'Habr'),
          ]
        ),
        n(
          'js-async',
          'Асинхронность',
          'Callbacks → Promises → async/await, event loop, microtasks.',
          'required',
          [
            r('Promise, async/await', 'https://learn.javascript.ru/async', 'learn.javascript.ru'),
            r('Event Loop — MDN', 'https://developer.mozilla.org/ru/docs/Web/JavaScript/EventLoop', 'MDN'),
            r('async/await — MDN', 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/async_function', 'MDN'),
            r('Микротаски и макротаски', 'https://habr.com/ru/articles/461401/', 'Habr'),
            r('Изучаем Event Loop', 'https://learn.javascript.ru/event-loop', 'learn.javascript.ru'),
          ]
        ),
        n(
          'js-oop',
          'ООП и прототипы',
          'Классы, наследование, this, bind/call/apply.',
          'optional',
          [
            r('Объекты: основы', 'https://learn.javascript.ru/object-basics', 'learn.javascript.ru'),
            r('Классы', 'https://learn.javascript.ru/classes', 'learn.javascript.ru'),
            r('Прототипы и наследование', 'https://learn.javascript.ru/prototypes', 'learn.javascript.ru'),
            r('Что такое this — MDN', 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/this', 'MDN'),
            r('ООП в JavaScript на пальцах', 'https://habr.com/ru/articles/668780/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'git',
      title: 'Система контроля версий',
      intro: 'Без Git не берут на работу даже на стажировку.',
      nodes: [
        n(
          'git-basics',
          'Основы Git',
          'commit, branch, merge, rebase, reset, revert.',
          'required',
          [
            r('Интерактивный курс Learn Git Branching', 'https://learngitbranching.js.org/?locale=ru_RU', 'Learn Git Branching'),
            r('Курс «Git. Базовый курс»', 'https://htmlacademy.ru/courses/343', 'HTML Academy'),
            r('Pro Git (русский перевод)', 'https://git-scm.com/book/ru/v2', 'Pro Git'),
            r('Хекслет: введение в Git', 'https://ru.hexlet.io/courses/intro_to_git_flow', 'Хекслет'),
            r('Stepik: Git для начинающих', 'https://stepik.org/course/4138/', 'Stepik'),
          ]
        ),
        n(
          'git-remote',
          'Удалённые репозитории',
          'GitHub/GitLab, push, pull, fetch, fork.',
          'required',
          [
            r('Документация GitHub', 'https://docs.github.com/ru/get-started', 'GitHub Docs'),
            r('Pro Git: распределённые рабочие процессы', 'https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows', 'Pro Git', 'en'),
            r('GitHub Flow — визуально', 'https://docs.github.com/ru/get-started/using-github/github-flow', 'GitHub Docs'),
            r('Git Hello World — GitHub Docs', 'https://docs.github.com/ru/get-started/quickstart/hello-world', 'GitHub Docs'),
            r('Руководство по GitLab', 'https://docs.gitlab.com/ee/topics/git/', 'GitLab Docs', 'en'),
          ]
        ),
        n(
          'git-pr',
          'Pull Requests и code review',
          'Как оформлять PR, реагировать на замечания, решать конфликты слияния.',
          'required',
          [
            r('Создание Pull Request', 'https://docs.github.com/ru/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests', 'GitHub Docs'),
            r('Code review: как делать хорошо', 'https://habr.com/ru/companies/yandex/articles/426691/', 'Habr'),
            r('Шпаргалка по решению конфликтов', 'https://docs.github.com/ru/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts', 'GitHub Docs'),
            r('Conventional Commits', 'https://www.conventionalcommits.org/ru/v1.0.0/', 'Conventional Commits'),
            r('Best practices для PR', 'https://habr.com/ru/companies/ibs/articles/547224/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'package-managers',
      title: 'Пакетные менеджеры',
      intro: 'Устанавливают и обновляют зависимости проекта.',
      nodes: [
        n(
          'npm',
          'npm',
          'Команды, package.json, semantic versioning, lock-файл.',
          'required',
          [
            r('npm для начинающих', 'https://docs.npmjs.com/getting-started', 'npm Docs', 'en'),
            r('Официальная документация', 'https://docs.npmjs.com/', 'npm Docs', 'en'),
            r('Semver в npm', 'https://docs.npmjs.com/about-semantic-versioning', 'npm Docs', 'en'),
            r('package.json: разбираемся подробно', 'https://habr.com/ru/articles/421019/', 'Habr'),
            r('npm vs yarn vs pnpm', 'https://habr.com/ru/companies/timeweb/articles/655945/', 'Habr'),
          ]
        ),
        n(
          'pnpm',
          'pnpm',
          'Экономит диск за счёт hard-links, быстрее npm/yarn.',
          'alternative',
          [
            r('Документация pnpm на русском', 'https://pnpm.io/ru/', 'pnpm'),
            r('Почему pnpm быстрее и экономнее', 'https://habr.com/ru/companies/ruvds/articles/549980/', 'Habr'),
            r('Motivation — pnpm Docs', 'https://pnpm.io/motivation', 'pnpm Docs', 'en'),
            r('Workspaces в pnpm', 'https://pnpm.io/workspaces', 'pnpm Docs', 'en'),
            r('pnpm vs npm: бенчмарки', 'https://habr.com/ru/articles/700944/', 'Habr'),
          ]
        ),
        n(
          'yarn',
          'yarn',
          'Классическая альтернатива npm, удобный workspaces.',
          'alternative',
          [
            r('Документация Yarn', 'https://yarnpkg.com/getting-started', 'Yarn', 'en'),
            r('Yarn vs npm: подробное сравнение', 'https://habr.com/ru/articles/341760/', 'Habr'),
            r('Yarn 2 и Plug’n’Play', 'https://yarnpkg.com/features/pnp', 'Yarn', 'en'),
            r('Миграция с npm на Yarn', 'https://yarnpkg.com/migration/guide', 'Yarn', 'en'),
            r('Workspaces в Yarn', 'https://yarnpkg.com/features/workspaces', 'Yarn', 'en'),
          ]
        ),
      ],
    },
    {
      id: 'tooling',
      title: 'Сборка и инструменты',
      intro: 'Bundler, линтеры, форматтеры — окружение современного фронтендера.',
      nodes: [
        n(
          'vite',
          'Vite',
          'ESM dev-server, мгновенный HMR, оптимизация сборки через Rollup.',
          'required',
          [
            r('Vite за 5 минут', 'https://habr.com/ru/companies/timeweb/articles/660787/', 'Habr'),
            r('Документация Vite', 'https://vitejs.dev/guide/', 'Vite', 'en'),
            r('Почему Vite? — официально', 'https://vitejs.dev/guide/why.html', 'Vite', 'en'),
            r('Плагины Vite — awesome-list', 'https://github.com/vitejs/awesome-vite', 'GitHub', 'en'),
            r('Миграция с CRA на Vite', 'https://habr.com/ru/companies/dododev/articles/720802/', 'Habr'),
          ]
        ),
        n(
          'webpack',
          'Webpack',
          'Гибкий, но сложный bundler. Всё ещё живёт в legacy-проектах.',
          'alternative',
          [
            r('Что такое Webpack и зачем он нужен', 'https://habr.com/ru/articles/506172/', 'Habr'),
            r('Концепции Webpack', 'https://webpack.js.org/concepts/', 'webpack', 'en'),
            r('Руководство для начинающих', 'https://webpack.js.org/guides/getting-started/', 'webpack', 'en'),
            r('Webpack: подробный разбор', 'https://doka.guide/tools/webpack/', 'Doka Guide'),
            r('Webpack: от простого к сложному', 'https://habr.com/ru/articles/329202/', 'Habr'),
          ]
        ),
        n(
          'babel',
          'Babel',
          'Транспиляция современного JS под старые браузеры.',
          'optional',
          [
            r('Babel — официальная документация', 'https://babeljs.io/docs/', 'Babel', 'en'),
            r('Полифилы и транспиляция', 'https://learn.javascript.ru/polyfills', 'learn.javascript.ru'),
            r('Babel Handbook', 'https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/user-handbook.md', 'GitHub', 'en'),
            r('Конфигурация Babel', 'https://babeljs.io/docs/configuration', 'Babel', 'en'),
            r('Babel: как писать плагины', 'https://habr.com/ru/articles/344320/', 'Habr'),
          ]
        ),
        n(
          'eslint',
          'ESLint',
          'Статический анализ кода и автоматические правки.',
          'required',
          [
            r('ESLint — официальная документация', 'https://eslint.org/docs/latest/', 'ESLint', 'en'),
            r('Getting Started — ESLint', 'https://eslint.org/docs/latest/use/getting-started', 'ESLint', 'en'),
            r('ESLint: настройка с нуля', 'https://habr.com/ru/articles/444348/', 'Habr'),
            r('Конфигурация для React-проекта', 'https://habr.com/ru/companies/ruvds/articles/501830/', 'Habr'),
            r('Популярные правила ESLint', 'https://eslint.org/docs/latest/rules/', 'ESLint', 'en'),
          ]
        ),
        n(
          'prettier',
          'Prettier',
          'Единообразное форматирование без споров в команде.',
          'required',
          [
            r('Prettier — официальный сайт', 'https://prettier.io/', 'Prettier', 'en'),
            r('Официальный сайт Prettier', 'https://prettier.io/docs/en/index.html', 'Prettier', 'en'),
            r('Интеграция с ESLint', 'https://prettier.io/docs/en/integrating-with-linters', 'Prettier', 'en'),
            r('Настройка Prettier + ESLint в VS Code', 'https://habr.com/ru/articles/449130/', 'Habr'),
            r('Prettier vs ESLint', 'https://habr.com/ru/companies/ruvds/articles/423971/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'typescript',
      title: 'TypeScript',
      intro: 'Строгая типизация — де-факто стандарт для серьёзных проектов.',
      nodes: [
        n(
          'ts-basics',
          'Основы типизации',
          'Примитивы, объекты, массивы, union и intersection.',
          'required',
          [
            r('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'TypeScript', 'en'),
            r('TypeScript за 5 минут', 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html', 'TypeScript', 'en'),
            r('Курс по TypeScript на Stepik', 'https://stepik.org/course/98974/', 'Stepik'),
            r('Хекслет: TypeScript', 'https://ru.hexlet.io/courses/js-typescript', 'Хекслет'),
            r('TypeScript Deep Dive', 'https://basarat.gitbook.io/typescript/', 'Basarat', 'en'),
          ]
        ),
        n(
          'ts-generics',
          'Generics',
          'Функции, классы и типы, параметризованные типами.',
          'required',
          [
            r('Generics — TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/2/generics.html', 'TypeScript', 'en'),
            r('Дженерики — Basarat Deep Dive', 'https://basarat.gitbook.io/typescript/type-system/generics', 'Basarat', 'en'),
            r('Generics: от простого к сложному', 'https://habr.com/ru/articles/488350/', 'Habr'),
            r('Глубокое погружение в дженерики', 'https://habr.com/ru/articles/515018/', 'Habr'),
            r('Generics в React — учимся типизировать хуки', 'https://habr.com/ru/companies/skyeng/articles/672700/', 'Habr'),
          ]
        ),
        n(
          'ts-utility',
          'Утилитарные типы',
          'Pick, Omit, Partial, Record, ReturnType и свои хелперы.',
          'required',
          [
            r('Utility Types', 'https://www.typescriptlang.org/docs/handbook/utility-types.html', 'TypeScript', 'en'),
            r('Type Challenges (тренажёр)', 'https://github.com/type-challenges/type-challenges/blob/main/README.ja.md', 'GitHub'),
            r('Условные типы и infer', 'https://habr.com/ru/articles/461959/', 'Habr'),
            r('Mapped types — официально', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html', 'TypeScript', 'en'),
            r('TS-паттерны: свои утилитарные типы', 'https://habr.com/ru/companies/skyeng/articles/670802/', 'Habr'),
          ]
        ),
        n(
          'ts-config',
          'tsconfig.json',
          'strict, paths, moduleResolution, noUncheckedIndexedAccess.',
          'optional',
          [
            r('Справочник tsconfig', 'https://www.typescriptlang.org/tsconfig', 'TypeScript', 'en'),
            r('tsconfig: strict-режим', 'https://habr.com/ru/articles/492980/', 'Habr'),
            r('Module resolution — официально', 'https://www.typescriptlang.org/docs/handbook/modules/theory.html', 'TypeScript', 'en'),
            r('Абсолютные пути и paths', 'https://habr.com/ru/articles/658187/', 'Habr'),
            r('tsconfig/bases — готовые пресеты', 'https://github.com/tsconfig/bases', 'GitHub', 'en'),
          ]
        ),
      ],
    },
    {
      id: 'framework',
      title: 'Фреймворк',
      intro: 'Выберите один и погружайтесь. React — самый частый выбор рынка.',
      nodes: [
        n(
          'react',
          'React',
          'Компоненты, хуки, рендер, ключи, управляемые и неуправляемые формы.',
          'required',
          [
            r('Официальный туториал React', 'https://react.dev/learn', 'React.dev', 'en'),
            r('Ваш первый компонент — React.dev', 'https://react.dev/learn/your-first-component', 'React.dev', 'en'),
            r('Подробный гайд по React-хукам', 'https://habr.com/ru/articles/671820/', 'Habr'),
            r('Канал Ulbi TV — React', 'https://www.youtube.com/@ulbitv', 'YouTube'),
            r('Mixing React с TypeScript — cheat sheet', 'https://react-typescript-cheatsheet.netlify.app/', 'React+TS Cheatsheet', 'en'),
          ]
        ),
        n(
          'vue',
          'Vue',
          'Реактивность, Composition API, SFC. Популярен в азиатских и российских командах.',
          'alternative',
          [
            r('Документация Vue 3 на русском', 'https://ru.vuejs.org/guide/introduction.html', 'Vue.js RU'),
            r('Composition API — ру-гайд', 'https://ru.vuejs.org/guide/extras/composition-api-faq.html', 'Vue.js RU'),
            r('Pinia — состояние для Vue', 'https://pinia.vuejs.org/introduction.html', 'Pinia', 'en'),
            r('Vue за 10 минут', 'https://habr.com/ru/companies/cdek_blog/articles/749876/', 'Habr'),
            r('Курс по Vue 3', 'https://stepik.org/course/118302/', 'Stepik'),
          ]
        ),
        n(
          'angular',
          'Angular',
          'Enterprise-фреймворк с DI, RxJS и жёсткой архитектурой.',
          'alternative',
          [
            r('Введение в Angular', 'https://angular.io/docs', 'Angular', 'en'),
            r('Angular для начинающих', 'https://habr.com/ru/articles/580406/', 'Habr'),
            r('RxJS — ру-гайд', 'https://rxjs-dev.firebaseapp.com/guide/overview', 'RxJS', 'en'),
            r('Стартовый гайд Tour of Heroes', 'https://angular.io/tutorial/tour-of-heroes', 'Angular', 'en'),
            r('Angular vs React vs Vue', 'https://habr.com/ru/companies/otus/articles/720558/', 'Habr'),
          ]
        ),
        n(
          'svelte',
          'Svelte',
          'Компилируется в нативный JS, без virtual DOM. Минимум бойлерплейта.',
          'alternative',
          [
            r('Интерактивный туториал Svelte', 'https://svelte.dev/tutorial', 'Svelte', 'en'),
            r('Документация Svelte', 'https://svelte.dev/docs', 'Svelte', 'en'),
            r('SvelteKit — meta-framework', 'https://kit.svelte.dev/docs/introduction', 'SvelteKit', 'en'),
            r('Зачем нужен Svelte', 'https://habr.com/ru/companies/ruvds/articles/584248/', 'Habr'),
            r('Svelte vs React', 'https://habr.com/ru/companies/timeweb/articles/702374/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'styling',
      title: 'Современная стилизация',
      intro: 'Способы писать CSS в компонентном мире.',
      nodes: [
        n(
          'tailwind',
          'Tailwind CSS',
          'Утилитарные классы, дизайн-токены, JIT-компиляция.',
          'required',
          [
            r('Документация Tailwind', 'https://tailwindcss.com/docs', 'Tailwind CSS', 'en'),
            r('Зачем нужен Tailwind', 'https://habr.com/ru/companies/ruvds/articles/598769/', 'Habr'),
            r('Cheatsheet Tailwind', 'https://nerdcave.com/tailwind-cheat-sheet', 'nerdcave', 'en'),
            r('Tailwind Play — онлайн-песочница', 'https://play.tailwindcss.com/', 'Tailwind Play', 'en'),
            r('Tailwind vs CSS-in-JS', 'https://habr.com/ru/companies/ruvds/articles/651931/', 'Habr'),
          ]
        ),
        n(
          'css-modules',
          'CSS Modules',
          'Локальный scope классов, без конфликтов имён.',
          'alternative',
          [
            r('Что такое CSS Modules', 'https://css-tricks.com/css-modules-part-1-need/', 'CSS-Tricks', 'en'),
            r('CSS Modules в React', 'https://habr.com/ru/articles/319440/', 'Habr'),
            r('Репозиторий CSS Modules', 'https://github.com/css-modules/css-modules', 'GitHub', 'en'),
            r('TypeScript-плагин для CSS Modules', 'https://github.com/mrmckeb/typescript-plugin-css-modules', 'GitHub', 'en'),
            r('webpack-конфиг для CSS Modules', 'https://webpack.js.org/loaders/css-loader/#modules', 'webpack', 'en'),
          ]
        ),
        n(
          'styled',
          'styled-components / Emotion',
          'CSS-in-JS: стили прямо рядом с компонентом.',
          'alternative',
          [
            r('styled-components', 'https://styled-components.com/docs', 'styled-components', 'en'),
            r('CSS-in-JS: плюсы и минусы', 'https://habr.com/ru/companies/ruvds/articles/440250/', 'Habr'),
            r('Emotion — официальные доки', 'https://emotion.sh/docs/introduction', 'Emotion', 'en'),
            r('styled-components: практика', 'https://habr.com/ru/articles/444600/', 'Habr'),
            r('Сравнение CSS-in-JS решений', 'https://habr.com/ru/companies/otus/articles/671866/', 'Habr'),
          ]
        ),
        n(
          'bem',
          'BEM-методология',
          'Именование классов в «обычном» CSS.',
          'optional',
          [
            r('Get BEM — введение', 'https://getbem.com/introduction/', 'Get BEM', 'en'),
            r('Get BEM — наименования', 'https://getbem.com/naming/', 'Get BEM', 'en'),
            r('Get BEM — FAQ', 'https://getbem.com/faq/', 'Get BEM', 'en'),
            r('BEM для начинающих', 'https://habr.com/ru/companies/htmlacademy/articles/254825/', 'Habr'),
            r('CSS Guidelines — гайдлайны', 'https://cssguidelin.es/', 'CSS Guidelines', 'en'),
          ]
        ),
      ],
    },
    {
      id: 'state',
      title: 'Управление состоянием',
      intro: 'Между локальным state и глобальным store много градаций.',
      nodes: [
        n(
          'state-context',
          'React Context',
          'Для темы, локали, авторизованного пользователя.',
          'required',
          [
            r('Передача данных через Context', 'https://react.dev/learn/passing-data-deeply-with-context', 'React.dev', 'en'),
            r('useContext на пальцах', 'https://habr.com/ru/articles/664530/', 'Habr'),
            r('Reference: createContext', 'https://react.dev/reference/react/createContext', 'React.dev', 'en'),
            r('Ошибки при использовании Context', 'https://habr.com/ru/companies/yandex/articles/540298/', 'Habr'),
            r('Reducer + Context — React.dev', 'https://react.dev/learn/scaling-up-with-reducer-and-context', 'React.dev', 'en'),
          ]
        ),
        n(
          'zustand',
          'Zustand',
          'Минималистичный глобальный стор. Используется в этом приложении.',
          'required',
          [
            r('Zustand на GitHub', 'https://github.com/pmndrs/zustand', 'GitHub', 'en'),
            r('Zustand — лёгкий стейт-менеджер', 'https://habr.com/ru/companies/yandex/articles/783108/', 'Habr'),
            r('Zustand — официальная документация', 'https://zustand.docs.pmnd.rs/', 'Zustand Docs', 'en'),
            r('Zustand vs Redux Toolkit', 'https://habr.com/ru/articles/783046/', 'Habr'),
            r('Persist middleware — Zustand', 'https://zustand.docs.pmnd.rs/middlewares/persist', 'Zustand Docs', 'en'),
          ]
        ),
        n(
          'redux',
          'Redux Toolkit',
          'Классика с чёткими паттернами и DevTools.',
          'alternative',
          [
            r('Документация Redux Toolkit', 'https://redux-toolkit.js.org/introduction/getting-started', 'Redux Toolkit', 'en'),
            r('Redux Toolkit без боли', 'https://habr.com/ru/articles/665518/', 'Habr'),
            r('RTK Query — серверное состояние', 'https://redux-toolkit.js.org/rtk-query/overview', 'Redux Toolkit', 'en'),
            r('Stepik: курс по Redux', 'https://stepik.org/course/127468/', 'Stepik'),
            r('Redux Toolkit в реальном проекте', 'https://habr.com/ru/companies/ruvds/articles/570178/', 'Habr'),
          ]
        ),
        n(
          'tanstack',
          'TanStack Query',
          'Серверное состояние: кеш, инвалидация, фоновый refetch.',
          'required',
          [
            r('TanStack Query — overview', 'https://tanstack.com/query/latest/docs/framework/react/overview', 'TanStack Query', 'en'),
            r('Зачем нужен React Query', 'https://habr.com/ru/companies/timeweb/articles/762314/', 'Habr'),
            r('Практические рецепты', 'https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults', 'TanStack Query', 'en'),
            r('React Query: мутации', 'https://tanstack.com/query/latest/docs/framework/react/guides/mutations', 'TanStack Query', 'en'),
            r('7 антипаттернов React Query', 'https://habr.com/ru/articles/716892/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'testing',
      title: 'Тестирование',
      intro: 'Юнит, интеграция, e2e — нужен хотя бы минимум на каждом уровне.',
      nodes: [
        n(
          'vitest',
          'Vitest / Jest',
          'Юнит-тесты для функций, хуков и утилит.',
          'required',
          [
            r('Документация Vitest', 'https://vitest.dev/guide/', 'Vitest', 'en'),
            r('Jest для начинающих', 'https://habr.com/ru/companies/southbridge/articles/527940/', 'Habr'),
            r('Jest — официальные доки', 'https://jestjs.io/docs/getting-started', 'Jest', 'en'),
            r('Vitest vs Jest', 'https://habr.com/ru/articles/706830/', 'Habr'),
            r('Пишем юнит-тесты в React', 'https://habr.com/ru/companies/dododev/articles/732636/', 'Habr'),
          ]
        ),
        n(
          'rtl',
          'React Testing Library',
          'Интеграционные тесты на уровне UI, ближе к поведению пользователя.',
          'required',
          [
            r('Документация Testing Library', 'https://testing-library.com/docs/react-testing-library/intro/', 'Testing Library', 'en'),
            r('Тестируем React-приложения с RTL', 'https://habr.com/ru/companies/timeweb/articles/660331/', 'Habr'),
            r('Шпаргалка по queries', 'https://testing-library.com/docs/queries/about', 'Testing Library', 'en'),
            r('Common mistakes in RTL', 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library', 'Kent C. Dodds', 'en'),
            r('Стратегия тестирования React', 'https://habr.com/ru/companies/flant/articles/705888/', 'Habr'),
          ]
        ),
        n(
          'playwright',
          'Playwright',
          'Современный e2e-инструмент от Microsoft с параллельными воркерами.',
          'alternative',
          [
            r('Документация Playwright', 'https://playwright.dev/docs/intro', 'Playwright', 'en'),
            r('Playwright vs Cypress', 'https://habr.com/ru/companies/cdek_blog/articles/772064/', 'Habr'),
            r('Test generator и кодогенерация', 'https://playwright.dev/docs/codegen', 'Playwright', 'en'),
            r('Playwright для QA-инженера', 'https://habr.com/ru/companies/yandex_praktikum/articles/701552/', 'Habr'),
            r('Конфигурация CI для Playwright', 'https://playwright.dev/docs/ci', 'Playwright', 'en'),
          ]
        ),
        n(
          'cypress',
          'Cypress',
          'e2e с удобным UI и time-travel-отладкой.',
          'optional',
          [
            r('Документация Cypress', 'https://docs.cypress.io/guides/overview/why-cypress', 'Cypress', 'en'),
            r('Cypress за час', 'https://habr.com/ru/companies/otus/articles/484996/', 'Habr'),
            r('Best practices', 'https://docs.cypress.io/guides/references/best-practices', 'Cypress', 'en'),
            r('Component testing в Cypress', 'https://docs.cypress.io/guides/component-testing/overview', 'Cypress', 'en'),
            r('Cypress для новичка', 'https://habr.com/ru/companies/otus/articles/685464/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'performance',
      title: 'Производительность',
      intro: 'То, о чём регулярно спрашивают на собеседованиях в продуктах.',
      nodes: [
        n(
          'vitals',
          'Core Web Vitals',
          'LCP, INP, CLS — метрики, которые видит Google и пользователь.',
          'required',
          [
            r('Core Web Vitals на web.dev', 'https://web.dev/articles/vitals?hl=ru', 'web.dev'),
            r('Метрики Web Vitals: что это и зачем', 'https://habr.com/ru/companies/jugru/articles/707034/', 'Habr'),
            r('Оптимизация LCP', 'https://web.dev/articles/lcp?hl=ru', 'web.dev'),
            r('Что такое INP', 'https://web.dev/articles/inp?hl=ru', 'web.dev'),
            r('Lighthouse: как читать отчёт', 'https://habr.com/ru/companies/ruvds/articles/425825/', 'Habr'),
          ]
        ),
        n(
          'lazy',
          'Lazy loading и code splitting',
          'dynamic import, React.lazy, prefetch, preload.',
          'required',
          [
            r('Динамические импорты', 'https://learn.javascript.ru/modules-dynamic-imports', 'learn.javascript.ru'),
            r('React.lazy', 'https://react.dev/reference/react/lazy', 'React.dev', 'en'),
            r('Разделение кода в React', 'https://habr.com/ru/companies/ruvds/articles/487020/', 'Habr'),
            r('Loading images lazily', 'https://web.dev/articles/browser-level-image-lazy-loading?hl=ru', 'web.dev'),
            r('rel=preload — MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload', 'MDN', 'en'),
          ]
        ),
        n(
          'memo',
          'Мемоизация',
          'useMemo, useCallback, React.memo — когда помогает, а когда только шум.',
          'required',
          [
            r('Когда нужна мемоизация в React', 'https://habr.com/ru/companies/timeweb/articles/707422/', 'Habr'),
            r('React.memo', 'https://react.dev/reference/react/memo', 'React.dev', 'en'),
            r('useMemo — API', 'https://react.dev/reference/react/useMemo', 'React.dev', 'en'),
            r('useCallback — API', 'https://react.dev/reference/react/useCallback', 'React.dev', 'en'),
            r('Антипаттерны useMemo/useCallback', 'https://habr.com/ru/companies/flant/articles/709832/', 'Habr'),
          ]
        ),
        n(
          'images',
          'Оптимизация изображений',
          'WebP/AVIF, responsive images, lazy-loading, srcset.',
          'optional',
          [
            r('Адаптивные изображения — MDN Learn', 'https://developer.mozilla.org/ru/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images', 'MDN'),
            r('Современные форматы изображений', 'https://web.dev/articles/serve-images-webp?hl=ru', 'web.dev'),
            r('srcset и sizes', 'https://developer.mozilla.org/ru/docs/Web/HTML/Element/img#srcset', 'MDN'),
            r('Использование AVIF в продакшене', 'https://web.dev/articles/compress-images-avif?hl=ru', 'web.dev'),
            r('Оптимизация картинок на фронте', 'https://habr.com/ru/articles/653813/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'security',
      title: 'Безопасность',
      intro: 'Минимум, который спасёт вас от самых частых уязвимостей.',
      nodes: [
        n(
          'cors',
          'CORS',
          'Политика одинакового источника, preflight-запросы, credentials.',
          'required',
          [
            r('Fetch: запросы к другим сайтам', 'https://learn.javascript.ru/fetch-crossorigin', 'learn.javascript.ru'),
            r('CORS', 'https://developer.mozilla.org/ru/docs/Web/HTTP/CORS', 'MDN'),
            r('CORS: разбираемся полностью', 'https://habr.com/ru/articles/452248/', 'Habr'),
            r('Same-origin policy — MDN', 'https://developer.mozilla.org/ru/docs/Web/Security/Same-origin_policy', 'MDN'),
            r('CORS-ошибки — MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors', 'MDN', 'en'),
          ]
        ),
        n(
          'csp',
          'Content Security Policy',
          'Заголовки, которые ограничивают, откуда грузятся скрипты.',
          'required',
          [
            r('Content Security Policy', 'https://developer.mozilla.org/ru/docs/Web/HTTP/CSP', 'MDN'),
            r('CSP простыми словами', 'https://habr.com/ru/companies/nixys/articles/542568/', 'Habr'),
            r('Evaluator для CSP', 'https://csp-evaluator.withgoogle.com/', 'Google', 'en'),
            r('Примеры CSP-политик', 'https://content-security-policy.com/', 'content-security-policy.com', 'en'),
            r('CSP в боевом проекте', 'https://habr.com/ru/companies/ruvds/articles/440030/', 'Habr'),
          ]
        ),
        n(
          'xss',
          'XSS и CSRF',
          'Как их эксплуатируют и как защищаться.',
          'required',
          [
            r('XSS-уязвимости простыми словами', 'https://habr.com/ru/companies/otus/articles/541336/', 'Habr'),
            r('CSRF: что это и как защититься', 'https://habr.com/ru/articles/417397/', 'Habr'),
            r('OWASP: Top 10 уязвимостей', 'https://owasp.org/www-project-top-ten/', 'OWASP', 'en'),
            r('XSS — MDN', 'https://developer.mozilla.org/ru/docs/Glossary/Cross-site_scripting', 'MDN'),
            r('OWASP Cheat Sheet: XSS', 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', 'OWASP', 'en'),
          ]
        ),
        n(
          'auth',
          'Аутентификация',
          'JWT, OAuth 2.0, session-based auth, httpOnly cookies.',
          'required',
          [
            r('JWT простыми словами', 'https://habr.com/ru/companies/otus/articles/697618/', 'Habr'),
            r('OAuth 2.0 на пальцах', 'https://habr.com/ru/articles/441656/', 'Habr'),
            r('Cookie, document.cookie', 'https://learn.javascript.ru/cookie', 'learn.javascript.ru'),
            r('jwt.io — отладчик токенов', 'https://jwt.io/', 'jwt.io', 'en'),
            r('HttpOnly cookies vs localStorage', 'https://habr.com/ru/companies/dsec/articles/665616/', 'Habr'),
          ]
        ),
      ],
    },
    {
      id: 'ssr',
      title: 'SSR и мета-фреймворки',
      intro: 'Рендер на сервере нужен для SEO, скорости и сложных бизнес-сценариев.',
      nodes: [
        n(
          'nextjs',
          'Next.js',
          'React + роутинг + SSR/SSG/ISR + серверные компоненты.',
          'required',
          [
            r('Next.js Learn — официальный курс', 'https://nextjs.org/learn', 'Next.js', 'en'),
            r('Next.js 14 — официальный блог', 'https://nextjs.org/blog/next-14', 'Next.js', 'en'),
            r('App Router — документация', 'https://nextjs.org/docs/app', 'Next.js', 'en'),
            r('Server Components на пальцах', 'https://habr.com/ru/articles/730168/', 'Habr'),
            r('Deployment на Vercel', 'https://nextjs.org/docs/pages/building-your-application/deploying', 'Next.js', 'en'),
          ]
        ),
        n(
          'nuxt',
          'Nuxt',
          'Next.js, только для Vue.',
          'alternative',
          [
            r('Документация Nuxt', 'https://nuxt.com/docs/getting-started/introduction', 'Nuxt', 'en'),
            r('Nuxt 3 за 10 минут', 'https://habr.com/ru/companies/timeweb/articles/702060/', 'Habr'),
            r('Data fetching в Nuxt', 'https://nuxt.com/docs/getting-started/data-fetching', 'Nuxt', 'en'),
            r('Server routes — Nuxt', 'https://nuxt.com/docs/guide/directory-structure/server', 'Nuxt', 'en'),
            r('Nuxt Modules', 'https://nuxt.com/modules', 'Nuxt', 'en'),
          ]
        ),
        n(
          'remix',
          'Remix',
          'Ориентирован на web-стандарты и loaders/actions.',
          'alternative',
          [
            r('Документация Remix', 'https://remix.run/docs/en/main', 'Remix', 'en'),
            r('Remix за час: обзор', 'https://habr.com/ru/companies/ruvds/articles/599319/', 'Habr'),
            r('Data loaders — Remix', 'https://remix.run/docs/en/main/route/loader', 'Remix', 'en'),
            r('Remix — блог и релизы', 'https://remix.run/blog', 'Remix', 'en'),
            r('Jokes tutorial — учебный проект', 'https://remix.run/docs/en/main/tutorials/jokes', 'Remix', 'en'),
          ]
        ),
      ],
    },
    {
      id: 'pwa',
      title: 'PWA и продвинутые темы',
      intro: 'Необязательны для junior, но выделяют на фоне остальных.',
      nodes: [
        n(
          'service-workers',
          'Service Workers',
          'Прокси между страницей и сетью, офлайн-режим, push-уведомления.',
          'optional',
          [
            r('Learn PWA: Service Workers', 'https://web.dev/learn/pwa/service-workers', 'web.dev', 'en'),
            r('Using Service Workers — MDN', 'https://developer.mozilla.org/ru/docs/Web/API/Service_Worker_API/Using_Service_Workers', 'MDN'),
            r('Service Worker API — MDN', 'https://developer.mozilla.org/ru/docs/Web/API/Service_Worker_API', 'MDN'),
            r('Push-уведомления через SW', 'https://web.dev/articles/push-notifications-overview?hl=ru', 'web.dev'),
            r('Service Worker: как отлаживать', 'https://habr.com/ru/articles/658093/', 'Habr'),
          ]
        ),
        n(
          'manifest',
          'Web App Manifest',
          'Установка сайта как приложения, иконки, цвета.',
          'optional',
          [
            r('Web App Manifest — MDN', 'https://developer.mozilla.org/ru/docs/Web/Manifest', 'MDN'),
            r('Добавляем manifest в проект', 'https://web.dev/articles/add-manifest?hl=ru', 'web.dev'),
            r('PWA-иконки: чеклист', 'https://habr.com/ru/companies/ruvds/articles/334614/', 'Habr'),
            r('Maskable.app — генератор иконок', 'https://maskable.app/', 'Maskable', 'en'),
            r('Manifest — официальная спецификация', 'https://www.w3.org/TR/appmanifest/', 'W3C', 'en'),
          ]
        ),
        n(
          'offline',
          'Offline-first',
          'Стратегии кеширования, Workbox, фоновая синхронизация.',
          'optional',
          [
            r('Стратегии кеширования', 'https://web.dev/articles/offline-cookbook?hl=ru', 'web.dev'),
            r('Workbox — overview', 'https://developer.chrome.com/docs/workbox', 'Chrome for Developers', 'en'),
            r('Offline-first приложения', 'https://habr.com/ru/articles/450468/', 'Habr'),
            r('Background Sync API — MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API', 'MDN', 'en'),
            r('Cache API — MDN', 'https://developer.mozilla.org/ru/docs/Web/API/Cache', 'MDN'),
          ]
        ),
        n(
          'web-components',
          'Web Components',
          'Custom Elements, Shadow DOM, HTML templates.',
          'optional',
          [
            r('Web Components на MDN', 'https://developer.mozilla.org/ru/docs/Web/API/Web_components', 'MDN'),
            r('Custom Elements — MDN', 'https://developer.mozilla.org/ru/docs/Web/API/Web_components/Using_custom_elements', 'MDN'),
            r('Shadow DOM', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM', 'MDN', 'en'),
            r('Lit — фреймворк для Web Components', 'https://lit.dev/docs/', 'Lit', 'en'),
            r('Web Components в реальных проектах', 'https://habr.com/ru/companies/ruvds/articles/586676/', 'Habr'),
          ]
        ),
      ],
    },
  ],
}

export const ROADMAPS: Roadmap[] = [frontendRoadmap]

export function getRoadmapBySlug(slug?: string) {
  return ROADMAPS.find((roadmap) => roadmap.slug === slug)
}

export function getRoadmapNodeCount(roadmap: Roadmap) {
  return roadmap.stages.reduce((sum, stage) => sum + stage.nodes.length, 0)
}

export function getRoadmapRequiredCount(roadmap: Roadmap) {
  return roadmap.stages.reduce(
    (sum, stage) => sum + stage.nodes.filter((node) => node.kind === 'required').length,
    0
  )
}
