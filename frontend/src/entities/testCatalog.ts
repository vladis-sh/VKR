export type CatalogDifficulty = 'easy' | 'medium' | 'hard'

export interface CatalogQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: CatalogDifficulty
}

export interface TestSubtopic {
  id: string
  slug: string
  title: string
  description: string
  difficulty: CatalogDifficulty
  questions: CatalogQuestion[]
}

export interface TestSection {
  id: string
  title: string
  description: string
  subtopics: TestSubtopic[]
}

export interface TestTheme {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  sections: TestSection[]
}

const q = (
  id: string,
  text: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  difficulty: CatalogDifficulty = 'easy'
): CatalogQuestion => ({
  id,
  text,
  options,
  correctIndex,
  explanation,
  difficulty,
})

export const TEST_CATALOG_THEMES: TestTheme[] = [
  {
    id: 'databases',
    slug: 'databases',
    title: 'Базы данных и SQL',
    shortTitle: 'Базы данных',
    description:
      'Реляционная модель, SQL, проектирование схем, индексы, JOIN и базовая работа с данными.',
    sections: [
      {
        id: 'sql-basics',
        title: 'Основы SQL и реляционная модель',
        description: 'База для понимания таблиц, связей, типов данных и структуры SQL.',
        subtopics: [
          {
            id: 'db-intro',
            slug: 'intro-sql-relational-model',
            title: 'Введение в SQL и реляционную модель',
            description: 'Таблицы, строки, столбцы, ключи и связи между сущностями.',
            difficulty: 'easy',
            questions: [
              q(
                'db-intro-1',
                'Что лучше всего описывает реляционную модель данных?',
                [
                  'Данные хранятся только в JSON-документах',
                  'Данные представлены таблицами, а связи задаются ключами',
                  'Данные всегда хранятся только в памяти приложения',
                  'Все данные хранятся в одном текстовом файле',
                ],
                1,
                'Реляционная модель описывает данные через отношения: таблицы, строки, столбцы и связи через ключи.'
              ),
              q(
                'db-intro-2',
                'Что такое первичный ключ?',
                [
                  'Поле, которое уникально идентифицирует строку таблицы',
                  'Любое поле с текстом',
                  'Название базы данных',
                  'Пароль администратора',
                ],
                0,
                'Primary key должен однозначно идентифицировать запись и обычно используется во внешних связях.'
              ),
            ],
          },
          {
            id: 'dbms',
            slug: 'dbms',
            title: 'СУБД',
            description: 'Зачем нужна система управления базами данных и что она делает.',
            difficulty: 'easy',
            questions: [
              q(
                'dbms-1',
                'Что делает СУБД?',
                [
                  'Только рисует интерфейс таблиц',
                  'Управляет хранением, запросами, транзакциями и доступом к данным',
                  'Заменяет backend-приложение',
                  'Компилирует JavaScript',
                ],
                1,
                'СУБД отвечает за хранение, обработку запросов, конкурентный доступ, транзакции и права.'
              ),
            ],
          },
          {
            id: 'normal-forms',
            slug: 'normal-forms-denormalization',
            title: 'Нормальные формы и денормализация',
            description: 'Как уменьшать дублирование и когда осознанно добавлять избыточность.',
            difficulty: 'medium',
            questions: [
              q(
                'normal-forms-1',
                'Зачем нужна нормализация?',
                [
                  'Чтобы ускорить любой SELECT без исключений',
                  'Чтобы уменьшить избыточность и аномалии обновления',
                  'Чтобы хранить все данные в одной таблице',
                  'Чтобы запретить внешние ключи',
                ],
                1,
                'Нормализация помогает убрать лишнее дублирование и сделать обновления данных более корректными.',
                'medium'
              ),
            ],
          },
          {
            id: 'sql-types',
            slug: 'sql-data-types',
            title: 'Основные типы данных в SQL',
            description: 'Числа, строки, даты, boolean и выбор подходящего типа.',
            difficulty: 'easy',
            questions: [
              q(
                'sql-types-1',
                'Какой тип обычно подходит для хранения даты и времени?',
                ['VARCHAR', 'BOOLEAN', 'TIMESTAMP', 'INTEGER'],
                2,
                'TIMESTAMP хранит дату и время. Для одной даты часто используют DATE.'
              ),
            ],
          },
          {
            id: 'sql-functions',
            slug: 'sql-functions',
            title: 'Встроенные SQL-функции',
            description: 'Функции для строк, дат, чисел и агрегирования данных.',
            difficulty: 'easy',
            questions: [
              q(
                'sql-functions-1',
                'Какая функция обычно считает количество строк?',
                ['SUM()', 'COUNT()', 'LOWER()', 'NOW()'],
                1,
                'COUNT() используется для подсчёта строк или непустых значений.'
              ),
            ],
          },
        ],
      },
      {
        id: 'ddl',
        title: 'Data Definition Language (DDL)',
        description: 'Создание и изменение структуры базы данных.',
        subtopics: [
          {
            id: 'create-tables',
            slug: 'create-tables-constraints',
            title: 'Создание таблиц и ограничений',
            description: 'CREATE TABLE, PRIMARY KEY, FOREIGN KEY, UNIQUE и NOT NULL.',
            difficulty: 'easy',
            questions: [
              q(
                'create-tables-1',
                'Какое ограничение запрещает NULL в колонке?',
                ['UNIQUE', 'NOT NULL', 'CHECK', 'FOREIGN KEY'],
                1,
                'NOT NULL требует, чтобы значение в колонке было задано.'
              ),
            ],
          },
          {
            id: 'alter-tables',
            slug: 'alter-table-structure',
            title: 'Изменение структуры таблиц',
            description: 'ALTER TABLE, добавление колонок и изменение ограничений.',
            difficulty: 'easy',
            questions: [
              q(
                'alter-tables-1',
                'Какой оператор меняет структуру существующей таблицы?',
                ['SELECT', 'ALTER TABLE', 'INSERT INTO', 'COMMIT'],
                1,
                'ALTER TABLE используется для добавления, удаления или изменения колонок и ограничений.'
              ),
            ],
          },
          {
            id: 'indexes',
            slug: 'sql-indexes',
            title: 'Индексы в SQL',
            description: 'Как индексы ускоряют поиск и какие компромиссы создают.',
            difficulty: 'medium',
            questions: [
              q(
                'indexes-1',
                'Главный компромисс индекса в базе данных:',
                [
                  'SELECT становится невозможным',
                  'Чтение может ускориться, но запись и обновление требуют поддержки индекса',
                  'Индекс удаляет все дубликаты автоматически',
                  'Индекс всегда уменьшает размер таблицы',
                ],
                1,
                'Индекс ускоряет поиск, но его нужно обновлять при INSERT/UPDATE/DELETE.',
                'medium'
              ),
            ],
          },
          {
            id: 'views',
            slug: 'sql-views',
            title: 'Представления',
            description: 'VIEW как сохранённый запрос и удобный слой чтения данных.',
            difficulty: 'medium',
            questions: [
              q(
                'views-1',
                'Что такое VIEW в SQL?',
                [
                  'Физическая копия всех данных без запроса',
                  'Сохранённое представление результата запроса',
                  'Тип индекса',
                  'Только системная таблица',
                ],
                1,
                'VIEW обычно хранит определение запроса и позволяет обращаться к нему как к таблице.',
                'medium'
              ),
            ],
          },
        ],
      },
      {
        id: 'dml',
        title: 'Data Manipulation Language (DML)',
        description: 'Добавление, изменение, удаление и выборка данных.',
        subtopics: [
          {
            id: 'insert-update',
            slug: 'insert-update-data',
            title: 'Вставка и обновление данных',
            description: 'INSERT INTO и UPDATE с условиями.',
            difficulty: 'easy',
            questions: [
              q(
                'insert-update-1',
                'Какой оператор добавляет новую строку в таблицу?',
                ['INSERT INTO', 'UPDATE', 'DELETE', 'DROP TABLE'],
                0,
                'INSERT INTO добавляет новые записи в таблицу.'
              ),
            ],
          },
          {
            id: 'delete-data',
            slug: 'delete-data',
            title: 'Удаление данных',
            description: 'DELETE, TRUNCATE и важность условия WHERE.',
            difficulty: 'easy',
            questions: [
              q(
                'delete-data-1',
                'Что опасно забыть в DELETE-запросе?',
                ['SELECT', 'WHERE', 'ORDER BY', 'COUNT'],
                1,
                'DELETE без WHERE может удалить все строки таблицы.'
              ),
            ],
          },
          {
            id: 'select-data',
            slug: 'select-data',
            title: 'Выборка данных',
            description: 'SELECT, WHERE, ORDER BY, LIMIT и базовая фильтрация.',
            difficulty: 'easy',
            questions: [
              q(
                'select-data-1',
                'Какой оператор используется для чтения данных?',
                ['SELECT', 'INSERT', 'DROP', 'ALTER'],
                0,
                'SELECT возвращает данные из одной или нескольких таблиц.'
              ),
            ],
          },
          {
            id: 'aggregate-functions',
            slug: 'aggregate-functions',
            title: 'Агрегатные функции',
            description: 'COUNT, SUM, AVG, MIN, MAX и группировка.',
            difficulty: 'easy',
            questions: [
              q(
                'aggregate-functions-1',
                'С чем чаще всего используется GROUP BY?',
                ['С агрегатными функциями', 'Только с DELETE', 'Только с индексами', 'Только с транзакциями'],
                0,
                'GROUP BY группирует строки, а агрегатные функции считают значения по группам.'
              ),
            ],
          },
          {
            id: 'joins',
            slug: 'joins',
            title: 'JOIN',
            description: 'INNER JOIN, LEFT JOIN и объединение данных из нескольких таблиц.',
            difficulty: 'medium',
            questions: [
              q(
                'joins-1',
                'Что делает INNER JOIN?',
                [
                  'Возвращает только строки, где есть совпадение в обеих таблицах',
                  'Всегда возвращает все строки левой таблицы',
                  'Удаляет дубликаты из таблицы',
                  'Создаёт новый индекс',
                ],
                0,
                'INNER JOIN оставляет строки, для которых условие соединения выполняется в обеих таблицах.',
                'medium'
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'algorithms',
    slug: 'algorithms',
    title: 'Алгоритмы',
    shortTitle: 'Алгоритмы',
    description:
      'Базовые паттерны решения задач: массивы, строки, стек, два указателя и сложность.',
    sections: [
      {
        id: 'base-patterns',
        title: 'Базовые паттерны',
        description: 'Частые подходы для интервью-задач.',
        subtopics: [
          {
            id: 'complexity',
            slug: 'complexity',
            title: 'Оценка сложности',
            description: 'Big O, время и память.',
            difficulty: 'easy',
            questions: [
              q(
                'algo-complexity-1',
                'Что означает O(n)?',
                [
                  'Время не зависит от размера входа',
                  'Время растёт примерно линейно с размером входа',
                  'Алгоритм всегда делает n² операций',
                  'Алгоритм запрещён в production',
                ],
                1,
                'O(n) означает линейный рост количества операций относительно размера входных данных.'
              ),
            ],
          },
          {
            id: 'two-pointers',
            slug: 'two-pointers',
            title: 'Два указателя',
            description: 'Паттерн для массивов и строк.',
            difficulty: 'medium',
            questions: [
              q(
                'algo-two-pointers-1',
                'Когда часто помогает техника двух указателей?',
                [
                  'При работе с отсортированными массивами или строками',
                  'Только при создании SQL-индекса',
                  'Только при работе с CSS',
                  'Когда нужно вызвать API',
                ],
                0,
                'Два указателя часто позволяют заменить вложенные циклы одним проходом.',
                'medium'
              ),
            ],
          },
          {
            id: 'stack',
            slug: 'stack',
            title: 'Стек',
            description: 'LIFO-структура для скобок, истории и обходов.',
            difficulty: 'easy',
            questions: [
              q(
                'algo-stack-1',
                'Какой принцип описывает стек?',
                ['FIFO', 'LIFO', 'HTTP', 'ACID'],
                1,
                'Стек работает по принципу Last In, First Out: последний добавленный элемент выходит первым.'
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'javascript',
    slug: 'javascript',
    title: 'JavaScript',
    shortTitle: 'JavaScript',
    description:
      'Язык, runtime, область видимости, асинхронность и особенности работы в браузере.',
    sections: [
      {
        id: 'language-core',
        title: 'Ядро языка',
        description: 'Основы JavaScript, которые часто спрашивают на интервью.',
        subtopics: [
          {
            id: 'closures',
            slug: 'closures',
            title: 'Замыкания',
            description: 'Лексическое окружение и функции, помнящие внешние переменные.',
            difficulty: 'medium',
            questions: [
              q(
                'js-closures-1',
                'Что такое замыкание?',
                [
                  'Ошибка в блоке catch',
                  'Функция вместе с доступом к своему лексическому окружению',
                  'Метод массива',
                  'Способ подключить CSS',
                ],
                1,
                'Замыкание позволяет функции использовать переменные из области, где она была создана.',
                'medium'
              ),
            ],
          },
          {
            id: 'event-loop',
            slug: 'event-loop',
            title: 'Event Loop',
            description: 'Call stack, task queue и microtasks.',
            difficulty: 'medium',
            questions: [
              q(
                'js-event-loop-1',
                'Что выполнится раньше: Promise.then или setTimeout(..., 0)?',
                ['setTimeout', 'Promise.then', 'Они всегда одновременно', 'Зависит только от CSS'],
                1,
                'Microtasks, включая Promise.then, выполняются перед следующей macrotask.',
                'medium'
              ),
            ],
          },
          {
            id: 'arrays',
            slug: 'arrays',
            title: 'Массивы',
            description: 'map, filter, reduce и мутация данных.',
            difficulty: 'easy',
            questions: [
              q(
                'js-arrays-1',
                'Какой метод создаёт новый массив той же длины?',
                ['push', 'map', 'forEach', 'pop'],
                1,
                'map возвращает новый массив, преобразуя каждый элемент.'
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'python',
    slug: 'python',
    title: 'Python',
    shortTitle: 'Python',
    description:
      'Базовый синтаксис, коллекции, функции и типичные вопросы для junior/middle подготовки.',
    sections: [
      {
        id: 'python-core',
        title: 'Основы Python',
        description: 'Типы данных, функции и коллекции.',
        subtopics: [
          {
            id: 'python-lists',
            slug: 'lists',
            title: 'Списки',
            description: 'List, индексация, append и срезы.',
            difficulty: 'easy',
            questions: [
              q(
                'python-lists-1',
                'Что делает list.append(x)?',
                [
                  'Добавляет элемент в конец списка',
                  'Удаляет первый элемент',
                  'Сортирует список',
                  'Создаёт словарь',
                ],
                0,
                'append добавляет один элемент в конец списка.'
              ),
            ],
          },
          {
            id: 'python-dicts',
            slug: 'dicts',
            title: 'Словари',
            description: 'dict, ключи, значения и быстрый доступ.',
            difficulty: 'easy',
            questions: [
              q(
                'python-dicts-1',
                'Какой тип хранит пары ключ-значение?',
                ['list', 'tuple', 'dict', 'set'],
                2,
                'dict хранит пары ключ-значение и даёт быстрый доступ по ключу.'
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'networks',
    slug: 'networks',
    title: 'Сети',
    shortTitle: 'Сети',
    description:
      'HTTP, DNS, TCP/IP и базовые сетевые понятия для frontend и backend интервью.',
    sections: [
      {
        id: 'web-networking',
        title: 'Web networking',
        description: 'Что происходит между браузером и сервером.',
        subtopics: [
          {
            id: 'http',
            slug: 'http',
            title: 'HTTP',
            description: 'Методы, статусы и структура запроса.',
            difficulty: 'easy',
            questions: [
              q(
                'net-http-1',
                'Что означает HTTP-статус 404?',
                ['Успешно', 'Не найдено', 'Ошибка сервера', 'Редирект'],
                1,
                '404 Not Found означает, что сервер не нашёл запрошенный ресурс.'
              ),
            ],
          },
          {
            id: 'dns',
            slug: 'dns',
            title: 'DNS',
            description: 'Как доменное имя превращается в IP-адрес.',
            difficulty: 'easy',
            questions: [
              q(
                'net-dns-1',
                'Зачем нужен DNS?',
                [
                  'Чтобы компилировать TypeScript',
                  'Чтобы сопоставлять доменные имена с IP-адресами',
                  'Чтобы хранить cookies',
                  'Чтобы рисовать HTML',
                ],
                1,
                'DNS переводит понятные человеку доменные имена в сетевые адреса.'
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'git',
    slug: 'git',
    title: 'Git',
    shortTitle: 'Git',
    description:
      'Коммиты, ветки, merge, rebase и базовая работа с историей проекта.',
    sections: [
      {
        id: 'git-basics',
        title: 'Основы Git',
        description: 'Повседневные команды и модель данных Git.',
        subtopics: [
          {
            id: 'commits',
            slug: 'commits',
            title: 'Коммиты',
            description: 'Что такое commit и зачем нужен staging area.',
            difficulty: 'easy',
            questions: [
              q(
                'git-commits-1',
                'Что делает git commit?',
                [
                  'Сохраняет снимок подготовленных изменений в истории',
                  'Удаляет все ветки',
                  'Скачивает зависимости npm',
                  'Запускает production-сервер',
                ],
                0,
                'git commit создаёт новый снимок изменений, добавленных в staging area.'
              ),
            ],
          },
          {
            id: 'branches',
            slug: 'branches',
            title: 'Ветки',
            description: 'Изоляция работы и переключение контекста.',
            difficulty: 'easy',
            questions: [
              q(
                'git-branches-1',
                'Зачем обычно создают ветку?',
                [
                  'Чтобы изолировать работу над задачей',
                  'Чтобы удалить историю проекта',
                  'Чтобы заменить базу данных',
                  'Чтобы отключить TypeScript',
                ],
                0,
                'Ветка позволяет вести работу над задачей отдельно от основной линии разработки.'
              ),
            ],
          },
        ],
      },
    ],
  },
]

export function getThemeBySlug(slug?: string) {
  return TEST_CATALOG_THEMES.find((theme) => theme.slug === slug)
}

export function getSubtopicBySlug(theme: TestTheme | undefined, slug?: string) {
  if (!theme) return undefined

  for (const section of theme.sections) {
    const subtopic = section.subtopics.find((item) => item.slug === slug)
    if (subtopic) return subtopic
  }

  return undefined
}

export function getThemeSubtopics(theme: TestTheme) {
  return theme.sections.flatMap((section) => section.subtopics)
}

export function getThemeQuestionCount(theme: TestTheme) {
  return getThemeSubtopics(theme).reduce(
    (sum, subtopic) => sum + subtopic.questions.length,
    0
  )
}
