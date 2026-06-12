export type LiveCodingDifficulty = 'easy' | 'medium' | 'hard'
export type LiveCodingLanguage = 'javascript' | 'typescript'

export interface LiveCodingExample {
  input: string
  output: string
  explanation?: string
}

export interface LiveCodingTestCase {
  title: string
  input: string
  expected: string
  assertion: string
}

export interface LiveCodingTask {
  id: string
  slug: string
  title: string
  category: string
  difficulty: LiveCodingDifficulty
  companies: string[]
  successRate: number
  estimatedMinutes: number
  languages: LiveCodingLanguage[]
  description: string
  constraints: string[]
  examples: LiveCodingExample[]
  starterCode: Record<LiveCodingLanguage, string>
  tests: LiveCodingTestCase[]
  solutionNotes: string[]
}

const jsStarter = (signature: string, body: string) => `function solution(${signature}) {
${body}
}

module.exports = solution
`

export const LANGUAGE_LABELS: Record<LiveCodingLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
}

export const DIFFICULTY_LABELS: Record<LiveCodingDifficulty, string> = {
  easy: 'Лёгкие',
  medium: 'Средние',
  hard: 'Сложные',
}

export const LIVE_CODING_TASKS: LiveCodingTask[] = [
  {
    id: 'lc-contains-duplicate',
    slug: 'contains-duplicate',
    title: 'Есть ли дубликаты',
    category: 'Arrays',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Frontend'],
    successRate: 78,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел. Верните true, если хотя бы одно число встречается больше одного раза, иначе верните false.',
    constraints: [
      'массив может быть пустым',
      'числа могут быть отрицательными',
      'исходный массив нельзя мутировать',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3, 1])',
        output: 'true',
      },
      {
        input: 'solution([1, 2, 3, 4])',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return false'),
      typescript: jsStarter('nums', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'находит повторяющийся элемент',
        input: '[1, 2, 3, 1]',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 1]), true)',
      },
      {
        title: 'возвращает false для уникальных чисел',
        input: '[1, 2, 3, 4]',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4]), false)',
      },
      {
        title: 'работает с пустым массивом',
        input: '[]',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate([]), false)',
      },
    ],
    solutionNotes: [
      'Самый короткий путь: сравнить размер Set с длиной массива.',
      'Можно пройти массив циклом и хранить встреченные числа в Set.',
      'Если элемент уже есть в Set, сразу возвращайте true.',
    ],
  },
  {
    id: 'lc-valid-parentheses',
    slug: 'valid-parentheses',
    title: 'Валидные скобки',
    category: 'Stack',
    difficulty: 'easy',
    companies: ['Neetcode', 'Google', 'Yandex'],
    successRate: 67,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка, состоящая только из символов (), [] и {}. Нужно определить, закрываются ли скобки в правильном порядке.',
    constraints: [
      'строка содержит только скобочные символы',
      'пустая строка считается валидной',
      'каждая открывающая скобка должна закрываться скобкой того же типа',
    ],
    examples: [
      {
        input: 'solution("()[]{}")',
        output: 'true',
      },
      {
        input: 'solution("([)]")',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('s', '  // ваш код\n  return false'),
      typescript: jsStarter('s', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'простая валидная строка',
        input: '"()[]{}"',
        expected: 'true',
        assertion: "assertDeepEqual(candidate('()[]{}'), true)",
      },
      {
        title: 'вложенные скобки',
        input: '"([{}])"',
        expected: 'true',
        assertion: "assertDeepEqual(candidate('([{}])'), true)",
      },
      {
        title: 'неверный порядок',
        input: '"([)]"',
        expected: 'false',
        assertion: "assertDeepEqual(candidate('([)]'), false)",
      },
      {
        title: 'неверный тип закрывающей скобки',
        input: '"(]"',
        expected: 'false',
        assertion: "assertDeepEqual(candidate('(]'), false)",
      },
    ],
    solutionNotes: [
      'Используйте стек для открывающих скобок.',
      'При закрывающей скобке сравните её с последним элементом стека.',
      'В конце стек должен быть пустым.',
    ],
  },
  {
    id: 'lc-chunk-array',
    slug: 'chunk-array',
    title: 'Разбить массив на части',
    category: 'Arrays',
    difficulty: 'easy',
    companies: ['BFE', 'Lodash', 'Frontend'],
    successRate: 72,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию chunk: она разбивает массив на группы длиной size. Последняя группа может быть короче.',
    constraints: [
      'size всегда больше 0',
      'исходный массив нельзя мутировать',
      'элементы массива могут быть любого типа',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3, 4, 5], 2)',
        output: '[[1, 2], [3, 4], [5]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('items, size', '  // ваш код\n  return []'),
      typescript: jsStarter('items, size', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'разбивает на равные группы и хвост',
        input: '[1, 2, 3, 4, 5], 2',
        expected: '[[1, 2], [3, 4], [5]]',
        assertion:
          'assertDeepEqual(candidate([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])',
      },
      {
        title: 'пустой массив возвращает пустой массив',
        input: '[], 3',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([], 3), [])',
      },
      {
        title: 'size больше длины массива',
        input: '[1, 2, 3], 5',
        expected: '[[1, 2, 3]]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3], 5), [[1, 2, 3]])',
      },
    ],
    solutionNotes: [
      'Идите по массиву с шагом size.',
      'На каждом шаге добавляйте items.slice(i, i + size).',
      'Не используйте splice, если не хотите мутировать исходный массив.',
    ],
  },
  {
    id: 'lc-title-case',
    slug: 'title-case',
    title: 'Title Case для строки',
    category: 'Strings',
    difficulty: 'easy',
    companies: ['Frontend', 'VK', 'Sber'],
    successRate: 74,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Преобразуйте строку в Title Case: каждое слово должно начинаться с заглавной буквы, остальные буквы должны быть строчными.',
    constraints: [
      'лишние пробелы в начале, конце и между словами нужно убрать',
      'пустая строка должна вернуть пустую строку',
      'слова состоят из латинских букв',
    ],
    examples: [
      {
        input: 'solution("hello world")',
        output: '"Hello World"',
      },
      {
        input: 'solution("  react   developer ")',
        output: '"React Developer"',
      },
    ],
    starterCode: {
      javascript: jsStarter('text', '  // ваш код\n  return text'),
      typescript: jsStarter('text', '  // ваш код\n  return text'),
    },
    tests: [
      {
        title: 'форматирует простую строку',
        input: '"hello world"',
        expected: '"Hello World"',
        assertion: "assertDeepEqual(candidate('hello world'), 'Hello World')",
      },
      {
        title: 'убирает лишние пробелы',
        input: '"  react   developer "',
        expected: '"React Developer"',
        assertion: "assertDeepEqual(candidate('  react   developer '), 'React Developer')",
      },
      {
        title: 'работает с разным регистром',
        input: '"jAvA sCrIpT"',
        expected: '"Java Script"',
        assertion: "assertDeepEqual(candidate('jAvA sCrIpT'), 'Java Script')",
      },
      {
        title: 'пустая строка',
        input: '""',
        expected: '""',
        assertion: "assertDeepEqual(candidate(''), '')",
      },
    ],
    solutionNotes: [
      'Сначала сделайте trim и split по одному или нескольким пробелам.',
      'Каждое слово приведите к lowerCase, затем поднимите первый символ.',
      'Соедините слова через один пробел.',
    ],
  },
  {
    id: 'lc-first-unique-character',
    slug: 'first-unique-character',
    title: 'Первый уникальный символ',
    category: 'Strings',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Tinkoff'],
    successRate: 69,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка. Верните индекс первого символа, который встречается только один раз. Если такого символа нет, верните -1.',
    constraints: [
      'строка может быть пустой',
      'регистр символов важен',
      'нужно вернуть индекс, а не сам символ',
    ],
    examples: [
      {
        input: 'solution("leetcode")',
        output: '0',
      },
      {
        input: 'solution("loveleetcode")',
        output: '2',
      },
    ],
    starterCode: {
      javascript: jsStarter('s', '  // ваш код\n  return -1'),
      typescript: jsStarter('s', '  // ваш код\n  return -1'),
    },
    tests: [
      {
        title: 'первый символ уникален',
        input: '"leetcode"',
        expected: '0',
        assertion: "assertDeepEqual(candidate('leetcode'), 0)",
      },
      {
        title: 'уникальный символ в середине',
        input: '"loveleetcode"',
        expected: '2',
        assertion: "assertDeepEqual(candidate('loveleetcode'), 2)",
      },
      {
        title: 'уникального символа нет',
        input: '"aabb"',
        expected: '-1',
        assertion: "assertDeepEqual(candidate('aabb'), -1)",
      },
      {
        title: 'пустая строка',
        input: '""',
        expected: '-1',
        assertion: "assertDeepEqual(candidate(''), -1)",
      },
    ],
    solutionNotes: [
      'Сначала посчитайте частоты символов через Map или объект.',
      'Затем пройдите строку второй раз и найдите первый символ с частотой 1.',
      'Так решение будет O(n) по времени.',
    ],
  },
  {
    id: 'lc-flatten-depth',
    slug: 'flatten-depth',
    title: 'Flatten с ограничением глубины',
    category: 'Arrays',
    difficulty: 'medium',
    companies: ['Meta', 'Yandex', 'Avito'],
    successRate: 43,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Напишите функцию, которая разворачивает вложенный массив не глубже указанного уровня. Поведение должно быть близко к Array.prototype.flat(depth), но без использования flat.',
    constraints: [
      'depth всегда целое число от 0 до 10',
      'в массиве могут быть числа, строки, null и другие массивы',
      'исходный массив нельзя мутировать',
    ],
    examples: [
      {
        input: 'solution([1, [2, [3, [4]]]], 2)',
        output: '[1, 2, 3, [4]]',
      },
      {
        input: 'solution([1, [2], 3], 0)',
        output: '[1, [2], 3]',
      },
    ],
    starterCode: {
      javascript: jsStarter('items, depth', '  // ваш код\n  return items'),
      typescript: jsStarter('items, depth', '  // ваш код\n  return items'),
    },
    tests: [
      {
        title: 'разворачивает на заданную глубину',
        input: '[1, [2, [3, [4]]]], 2',
        expected: '[1, 2, 3, [4]]',
        assertion:
          "assertDeepEqual(candidate([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]])",
      },
      {
        title: 'depth = 0 возвращает копию первого уровня',
        input: '[1, [2], 3], 0',
        expected: '[1, [2], 3]',
        assertion: "assertDeepEqual(candidate([1, [2], 3], 0), [1, [2], 3])",
      },
      {
        title: 'обрабатывает пустые массивы',
        input: '[[[], 1], [2, [3]]], 3',
        expected: '[1, 2, 3]',
        assertion: "assertDeepEqual(candidate([[[], 1], [2, [3]]], 3), [1, 2, 3])",
      },
    ],
    solutionNotes: [
      'Используйте рекурсию или стек с текущей глубиной.',
      'На каждом уровне проверяйте Array.isArray(value) и depth > 0.',
      'Не вызывайте flat: на интервью обычно хотят увидеть ручной обход.',
    ],
  },
  {
    id: 'lc-compact-object',
    slug: 'compact-object',
    title: 'Очистка объекта от пустых значений',
    category: 'Objects',
    difficulty: 'medium',
    companies: ['BFE', 'Tinkoff', 'Ozon'],
    successRate: 38,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Верните новую структуру, рекурсивно удалив из словарей (объектов) и списков (массивов) значения null и пустые строки. Все остальные значения, включая 0 и false, сохраняются. Вложенность может быть произвольной.',
    constraints: [
      'исходную структуру нельзя мутировать',
      '0 и false должны сохраняться',
      'пустые объекты и массивы после очистки можно оставлять',
    ],
    examples: [
      {
        input: "solution({ a: 1, b: null, c: { d: '', e: 0 } })",
        output: '{ a: 1, c: { e: 0 } }',
      },
    ],
    starterCode: {
      javascript: jsStarter('value', '  // ваш код\n  return value'),
      typescript: jsStarter('value', '  // ваш код\n  return value'),
    },
    tests: [
      {
        title: 'чистит вложенный объект',
        input: "{ a: 1, b: null, c: { d: '', e: 0, f: false } }",
        expected: '{ a: 1, c: { e: 0, f: false } }',
        assertion:
          "assertDeepEqual(candidate({ a: 1, b: null, c: { d: '', e: 0, f: false } }), { a: 1, c: { e: 0, f: false } })",
      },
      {
        title: 'чистит массивы',
        input: "[1, null, 0, '', [2, null, 3]]",
        expected: '[1, 0, [2, 3]]',
        assertion:
          "assertDeepEqual(candidate([1, null, 0, '', [2, null, 3]]), [1, 0, [2, 3]])",
      },
      {
        title: 'сохраняет 0 и false',
        input: "{ a: 0, b: false, c: null, d: '' }",
        expected: '{ a: 0, b: false }',
        assertion:
          "assertDeepEqual(candidate({ a: 0, b: false, c: null, d: '' }), { a: 0, b: false })",
      },
    ],
    solutionNotes: [
      'Сначала определите предикат «пустого» значения: null или пустая строка.',
      'Для массивов рекурсивно обработайте элементы и отфильтруйте пустые.',
      'Для объектов соберите новый словарь только из непустых значений.',
    ],
  },
  {
    id: 'lc-parse-query',
    slug: 'parse-query-string',
    title: 'Парсер query string',
    category: 'Parsing & Formatting',
    difficulty: 'easy',
    companies: ['VK', 'Sber', 'Frontend'],
    successRate: 61,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Распарсите строку параметров URL в объект. Повторяющиеся ключи должны превращаться в массив значений.',
    constraints: [
      'строка может начинаться с ?',
      'ключи и значения нужно декодировать через decodeURIComponent',
      'параметр без значения должен иметь пустую строку',
    ],
    examples: [
      {
        input: 'solution("?tag=js&tag=react&page=2")',
        output: '{ tag: ["js", "react"], page: "2" }',
      },
    ],
    starterCode: {
      javascript: jsStarter('query', '  // ваш код\n  return {}'),
      typescript: jsStarter('query', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'собирает повторяющиеся ключи в массив',
        input: '?tag=js&tag=react&page=2',
        expected: '{ tag: ["js", "react"], page: "2" }',
        assertion:
          "assertDeepEqual(candidate('?tag=js&tag=react&page=2'), { tag: ['js', 'react'], page: '2' })",
      },
      {
        title: 'декодирует значения',
        input: 'q=hello%20world&empty',
        expected: '{ q: "hello world", empty: "" }',
        assertion:
          "assertDeepEqual(candidate('q=hello%20world&empty'), { q: 'hello world', empty: '' })",
      },
    ],
    solutionNotes: [
      'Уберите первый символ, если это ?.',
      'Разделите строку по &, затем каждую пару по первому =.',
      'Если ключ уже есть, превратите значение в массив или добавьте в существующий массив.',
    ],
  },
  {
    id: 'lc-merge-intervals',
    slug: 'merge-intervals',
    title: 'Слияние интервалов',
    category: 'Algorithms',
    difficulty: 'medium',
    companies: ['Google', 'Amazon', 'Yandex'],
    successRate: 47,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив интервалов [start, end]. Объедините пересекающиеся интервалы и верните отсортированный результат.',
    constraints: [
      'start всегда меньше или равен end',
      'интервалы могут идти в любом порядке',
      'смежные интервалы [1,2] и [2,3] считаются пересекающимися',
    ],
    examples: [
      {
        input: 'solution([[1,3], [2,6], [8,10]])',
        output: '[[1,6], [8,10]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('intervals', '  // ваш код\n  return intervals'),
      typescript: jsStarter('intervals', '  // ваш код\n  return intervals'),
    },
    tests: [
      {
        title: 'сливает пересечения',
        input: '[[1,3], [2,6], [8,10], [15,18]]',
        expected: '[[1,6], [8,10], [15,18]]',
        assertion:
          'assertDeepEqual(candidate([[1,3], [2,6], [8,10], [15,18]]), [[1,6], [8,10], [15,18]])',
      },
      {
        title: 'учитывает смежные интервалы',
        input: '[[1,4], [4,5]]',
        expected: '[[1,5]]',
        assertion: 'assertDeepEqual(candidate([[1,4], [4,5]]), [[1,5]])',
      },
      {
        title: 'сортирует входные интервалы',
        input: '[[6,8], [1,9], [2,4], [4,7]]',
        expected: '[[1,9]]',
        assertion: 'assertDeepEqual(candidate([[6,8], [1,9], [2,4], [4,7]]), [[1,9]])',
      },
    ],
    solutionNotes: [
      'Сначала отсортируйте интервалы по началу.',
      'Храните последний интервал в результате и расширяйте его end.',
      'Если новый интервал начинается позже текущего end, добавляйте новый блок.',
    ],
  },
  {
    id: 'lc-camelize-keys',
    slug: 'camelize-keys',
    title: 'camelCase для ключей API',
    category: 'Data transforms',
    difficulty: 'hard',
    companies: ['BFE', 'JetBrains', 'Ozon'],
    successRate: 29,
    estimatedMinutes: 35,
    languages: ['javascript', 'typescript'],
    description:
      'Бэкенд отдаёт JSON с ключами в snake_case и kebab-case, а во фронтенде принято camelCase. Напишите функцию, которая принимает объект и возвращает его копию, где все ключи — в том числе во вложенных объектах и внутри массивов — переведены в camelCase.',
    constraints: [
      'вложенные объекты и массивы обходите рекурсивно',
      'значения-примитивы и null возвращайте как есть',
      'исходный объект менять нельзя — соберите новый',
    ],
    examples: [
      {
        input: 'solution({ user_id: 1, user_name: "Ada" })',
        output: '{ userId: 1, userName: "Ada" }',
      },
      {
        input: 'solution({ "page-size": 10 })',
        output: '{ pageSize: 10 }',
        explanation: 'Дефисы обрабатываются так же, как подчёркивания.',
      },
    ],
    starterCode: {
      javascript: jsStarter('value', '  // ваш код\n  return value'),
      typescript: jsStarter('value', '  // ваш код\n  return value'),
    },
    tests: [
      {
        title: 'преобразует вложенные ключи',
        input: '{ user_id: 1, profile_data: { first_name: "Ada" } }',
        expected: '{ userId: 1, profileData: { firstName: "Ada" } }',
        assertion:
          "assertDeepEqual(candidate({ user_id: 1, profile_data: { first_name: 'Ada' } }), { userId: 1, profileData: { firstName: 'Ada' } })",
      },
      {
        title: 'понимает kebab-case',
        input: "{ 'page-size': 10, 'sort-order': 'asc' }",
        expected: "{ pageSize: 10, sortOrder: 'asc' }",
        assertion:
          "assertDeepEqual(candidate({ 'page-size': 10, 'sort-order': 'asc' }), { pageSize: 10, sortOrder: 'asc' })",
      },
      {
        title: 'обходит объекты внутри массивов',
        input: '{ items_list: [{ item_id: 1 }, { item_id: 2 }] }',
        expected: '{ itemsList: [{ itemId: 1 }, { itemId: 2 }] }',
        assertion:
          'assertDeepEqual(candidate({ items_list: [{ item_id: 1 }, { item_id: 2 }] }), { itemsList: [{ itemId: 1 }, { itemId: 2 }] })',
      },
      {
        title: 'null остаётся null',
        input: '{ user_name: null }',
        expected: '{ userName: null }',
        assertion: 'assertDeepEqual(candidate({ user_name: null }), { userName: null })',
      },
      {
        title: 'не мутирует исходный объект',
        input: '{ user_id: 1 }',
        expected: 'исходник не изменился',
        assertion:
          'const source = { user_id: 1 }; candidate(source); assertDeepEqual(source, { user_id: 1 })',
      },
    ],
    solutionNotes: [
      'Разбейте ключ по дефисам и подчёркиваниям: key.split(/[-_]/).',
      'Первый кусок оставьте как есть, у остальных поднимите первую букву в верхний регистр.',
      'Идите по структуре рекурсивно: массив — map, объект — пересоберите ключи, всё остальное верните как есть.',
    ],
  },
  {
    id: 'lc-top-k-frequent',
    slug: 'top-k-frequent',
    title: 'Top K частых элементов',
    category: 'Algorithms',
    difficulty: 'medium',
    companies: ['Amazon', 'Tinkoff', 'VK'],
    successRate: 49,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Верните k наиболее часто встречающихся элементов массива. Если частота равна, меньший элемент должен идти раньше.',
    constraints: [
      'массив содержит только числа',
      '1 <= k <= количество уникальных элементов',
      'результат должен быть массивом чисел',
    ],
    examples: [
      {
        input: 'solution([1,1,1,2,2,3], 2)',
        output: '[1, 2]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, k', '  // ваш код\n  return []'),
      typescript: jsStarter('nums, k', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'возвращает самые частые элементы',
        input: '[1,1,1,2,2,3], 2',
        expected: '[1, 2]',
        assertion: 'assertDeepEqual(candidate([1,1,1,2,2,3], 2), [1, 2])',
      },
      {
        title: 'разрешает равную частоту по значению',
        input: '[4,4,1,1,2,2], 2',
        expected: '[1, 2]',
        assertion: 'assertDeepEqual(candidate([4,4,1,1,2,2], 2), [1, 2])',
      },
    ],
    solutionNotes: [
      'Посчитайте частоты через Map.',
      'Отсортируйте пары по frequency desc, value asc.',
      'Верните первые k значений.',
    ],
  },
  {
    id: 'lc-deep-equal',
    slug: 'deep-equal',
    title: 'Глубокое сравнение значений',
    category: 'Objects',
    difficulty: 'hard',
    companies: ['BFE', 'Meta', 'Frontend'],
    successRate: 32,
    estimatedMinutes: 40,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте deepEqual для примитивов, массивов и plain objects. Порядок ключей в объектах не должен влиять на результат.',
    constraints: [
      'NaN должен быть равен NaN',
      'Date, Map и Set обрабатывать не нужно',
      'циклических ссылок во входных данных нет',
    ],
    examples: [
      {
        input: 'solution({ a: [1, 2] }, { a: [1, 2] })',
        output: 'true',
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return Object.is(a, b)'),
      typescript: jsStarter('a, b', '  // ваш код\n  return Object.is(a, b)'),
    },
    tests: [
      {
        title: 'сравнивает вложенные объекты',
        input: '{ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }',
        expected: 'true',
        assertion:
          'assertDeepEqual(candidate({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }), true)',
      },
      {
        title: 'учитывает разные массивы',
        input: '[1,2,3], [1,3,2]',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate([1,2,3], [1,3,2]), false)',
      },
      {
        title: 'NaN равен NaN',
        input: 'NaN, NaN',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate(NaN, NaN), true)',
      },
    ],
    solutionNotes: [
      'Начните с Object.is(a, b): он корректно покрывает NaN.',
      'Если типы отличаются или одно значение null, возвращайте false.',
      'Для объектов сравните длину ключей, затем рекурсивно каждое значение.',
    ],
  },
  {
    id: 'lc-two-sum',
    slug: 'two-sum',
    title: 'Two Sum',
    category: 'Arrays & Hashing',
    difficulty: 'easy',
    companies: ['Neetcode', 'Google', 'Amazon'],
    successRate: 82,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел и число target. Верните индексы двух элементов, сумма которых равна target. Ответ всегда существует и он единственный; один и тот же элемент использовать дважды нельзя. Индексы в результате должны идти по возрастанию.',
    constraints: [
      '2 <= nums.length <= 10^4',
      'числа могут быть отрицательными',
      'ответ — массив из двух индексов в порядке возрастания',
    ],
    examples: [
      {
        input: 'solution([2, 7, 11, 15], 9)',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] === 9',
      },
      {
        input: 'solution([3, 2, 4], 6)',
        output: '[1, 2]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, target', '  // ваш код\n  return []'),
      typescript: jsStarter('nums, target', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[2, 7, 11, 15], 9',
        expected: '[0, 1]',
        assertion: 'assertDeepEqual(candidate([2, 7, 11, 15], 9), [0, 1])',
      },
      {
        title: 'индексы в середине',
        input: '[3, 2, 4], 6',
        expected: '[1, 2]',
        assertion: 'assertDeepEqual(candidate([3, 2, 4], 6), [1, 2])',
      },
      {
        title: 'дубликаты',
        input: '[3, 3], 6',
        expected: '[0, 1]',
        assertion: 'assertDeepEqual(candidate([3, 3], 6), [0, 1])',
      },
      {
        title: 'отрицательные числа',
        input: '[-1, -2, -3, -4, -5], -8',
        expected: '[2, 4]',
        assertion: 'assertDeepEqual(candidate([-1, -2, -3, -4, -5], -8), [2, 4])',
      },
    ],
    solutionNotes: [
      'Заведите Map: ключ — число, значение — его индекс.',
      'При проходе для каждого num ищите в Map значение target - num.',
      'Если нашли — верните [prevIndex, currentIndex]. Сложность O(n).',
    ],
  },
  {
    id: 'lc-valid-anagram',
    slug: 'valid-anagram',
    title: 'Анаграмма',
    category: 'Strings',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'VK'],
    successRate: 76,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Даны две строки s и t. Верните true, если t — это анаграмма s (состоит из тех же букв, возможно в другом порядке), иначе false.',
    constraints: [
      'строки содержат только строчные латинские буквы',
      'если длины разные — ответ сразу false',
      'пустые строки считаются анаграммами друг друга',
    ],
    examples: [
      {
        input: 'solution("anagram", "nagaram")',
        output: 'true',
      },
      {
        input: 'solution("rat", "car")',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('s, t', '  // ваш код\n  return false'),
      typescript: jsStarter('s, t', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'является анаграммой',
        input: '"anagram", "nagaram"',
        expected: 'true',
        assertion: "assertDeepEqual(candidate('anagram', 'nagaram'), true)",
      },
      {
        title: 'не является анаграммой',
        input: '"rat", "car"',
        expected: 'false',
        assertion: "assertDeepEqual(candidate('rat', 'car'), false)",
      },
      {
        title: 'разная длина',
        input: '"a", "ab"',
        expected: 'false',
        assertion: "assertDeepEqual(candidate('a', 'ab'), false)",
      },
      {
        title: 'две пустые строки',
        input: '"", ""',
        expected: 'true',
        assertion: "assertDeepEqual(candidate('', ''), true)",
      },
    ],
    solutionNotes: [
      'Самый прямой способ: отсортировать обе строки и сравнить.',
      'Лучше по времени: посчитать частоту букв в одной строке, вычитать при проходе по второй.',
      'Не забудьте сразу вернуть false при разной длине.',
    ],
  },
  {
    id: 'lc-group-anagrams',
    slug: 'group-anagrams',
    title: 'Группировка анаграмм',
    category: 'Arrays & Hashing',
    difficulty: 'medium',
    companies: ['Neetcode', 'Google', 'Yandex'],
    successRate: 58,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив строк. Сгруппируйте строки, являющиеся анаграммами друг друга. Внутри каждой группы строки должны быть отсортированы по возрастанию, а сами группы — по первой строке каждой группы.',
    constraints: [
      'строки состоят из строчных латинских букв',
      'одинаковые строки считаются анаграммами',
      'пустую строку обрабатываем как отдельную группу',
    ],
    examples: [
      {
        input: 'solution(["eat","tea","tan","ate","nat","bat"])',
        output: '[["ate","eat","tea"],["bat"],["nat","tan"]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('strs', '  // ваш код\n  return []'),
      typescript: jsStarter('strs', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'базовая группировка',
        input: '["eat","tea","tan","ate","nat","bat"]',
        expected: '[["ate","eat","tea"],["bat"],["nat","tan"]]',
        assertion:
          "assertDeepEqual(candidate(['eat','tea','tan','ate','nat','bat']), [['ate','eat','tea'],['bat'],['nat','tan']])",
      },
      {
        title: 'одна пустая строка',
        input: '[""]',
        expected: '[[""]]',
        assertion: "assertDeepEqual(candidate(['']), [['']])",
      },
      {
        title: 'без общих анаграмм',
        input: '["a","b","c"]',
        expected: '[["a"],["b"],["c"]]',
        assertion:
          "assertDeepEqual(candidate(['a','b','c']), [['a'],['b'],['c']])",
      },
    ],
    solutionNotes: [
      'Ключ группировки — отсортированные буквы строки (или массив частот).',
      'Складывайте строки по ключу в Map.',
      'В конце отсортируйте каждую группу и затем сам массив групп.',
    ],
  },
  {
    id: 'lc-longest-consecutive',
    slug: 'longest-consecutive',
    title: 'Длиннейшая последовательность подряд',
    category: 'Arrays & Hashing',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'Meta'],
    successRate: 45,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел. Найдите длину самой длинной последовательности подряд идущих чисел (в любом порядке ввода). Решение должно работать за O(n).',
    constraints: [
      '0 <= nums.length <= 10^5',
      'числа могут повторяться и быть отрицательными',
      'решение должно быть за O(n) в среднем',
    ],
    examples: [
      {
        input: 'solution([100, 4, 200, 1, 3, 2])',
        output: '4',
        explanation: '[1, 2, 3, 4] — длиннейшая цепочка',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[100, 4, 200, 1, 3, 2]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([100, 4, 200, 1, 3, 2]), 4)',
      },
      {
        title: 'дубликаты не влияют',
        input: '[0,3,7,2,5,8,4,6,0,1]',
        expected: '9',
        assertion: 'assertDeepEqual(candidate([0,3,7,2,5,8,4,6,0,1]), 9)',
      },
      {
        title: 'пустой массив',
        input: '[]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([]), 0)',
      },
    ],
    solutionNotes: [
      'Положите все числа в Set для O(1) проверки.',
      'Стартуйте цепочку только с num, у которого нет num - 1 в Set — иначе посчитаете дважды.',
      'Дальше идите вперёд num + 1, num + 2... и считайте длину.',
    ],
  },
  {
    id: 'lc-product-except-self',
    slug: 'product-except-self',
    title: 'Произведение всех, кроме самого',
    category: 'Arrays',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'Tinkoff'],
    successRate: 52,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел. Верните массив той же длины, где в позиции i лежит произведение всех элементов nums, кроме nums[i]. Решение должно быть за O(n) и без использования деления.',
    constraints: [
      '2 <= nums.length <= 10^5',
      'деление использовать нельзя',
      'исходный массив нельзя мутировать',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3, 4])',
        output: '[24, 12, 8, 6]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return []'),
      typescript: jsStarter('nums', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[1, 2, 3, 4]',
        expected: '[24, 12, 8, 6]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4]), [24, 12, 8, 6])',
      },
      {
        title: 'с нулём',
        input: '[-1, 1, 0, -3, 3]',
        expected: '[0, 0, 9, 0, 0]',
        assertion:
          'assertDeepEqual(candidate([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0])',
      },
      {
        title: 'два элемента',
        input: '[2, 3]',
        expected: '[3, 2]',
        assertion: 'assertDeepEqual(candidate([2, 3]), [3, 2])',
      },
    ],
    solutionNotes: [
      'Сначала пройдите слева направо и запишите префиксные произведения.',
      'Затем пройдите справа налево, умножая накопленный суффикс.',
      'Так достаточно одного прохода для каждого направления и O(1) доп. памяти без учёта результата.',
    ],
  },
  {
    id: 'lc-valid-palindrome',
    slug: 'valid-palindrome',
    title: 'Валидный палиндром',
    category: 'Two Pointers',
    difficulty: 'easy',
    companies: ['Neetcode', 'Meta', 'Sber'],
    successRate: 72,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Строка является палиндромом, если после удаления всех небуквенно-цифровых символов и приведения к нижнему регистру она читается одинаково слева направо и справа налево. Вернуть true или false.',
    constraints: [
      'игнорируйте пробелы, знаки препинания, регистр',
      'пустая строка считается палиндромом',
      'учитываются только буквы латиницы и цифры',
    ],
    examples: [
      {
        input: 'solution("A man, a plan, a canal: Panama")',
        output: 'true',
      },
      {
        input: 'solution("race a car")',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('s', '  // ваш код\n  return false'),
      typescript: jsStarter('s', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'классический палиндром',
        input: '"A man, a plan, a canal: Panama"',
        expected: 'true',
        assertion:
          "assertDeepEqual(candidate('A man, a plan, a canal: Panama'), true)",
      },
      {
        title: 'не палиндром',
        input: '"race a car"',
        expected: 'false',
        assertion: "assertDeepEqual(candidate('race a car'), false)",
      },
      {
        title: 'пустая строка',
        input: '" "',
        expected: 'true',
        assertion: "assertDeepEqual(candidate(' '), true)",
      },
    ],
    solutionNotes: [
      'Два указателя: слева и справа.',
      'Пропускайте символы, не являющиеся буквой или цифрой.',
      'Сравнивайте через toLowerCase; расходятся — возвращайте false.',
    ],
  },
  {
    id: 'lc-two-sum-sorted',
    slug: 'two-sum-sorted',
    title: 'Two Sum II (отсортированный массив)',
    category: 'Two Pointers',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'Ozon'],
    successRate: 63,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дан отсортированный по возрастанию массив чисел и число target. Найдите два индекса (1-based), сумма элементов по которым равна target. Ответ единственный, один индекс использовать дважды нельзя.',
    constraints: [
      'массив отсортирован по неубыванию',
      'индексы 1-based (нумерация с 1)',
      'решение за O(n) без доп. памяти',
    ],
    examples: [
      {
        input: 'solution([2, 7, 11, 15], 9)',
        output: '[1, 2]',
      },
    ],
    starterCode: {
      javascript: jsStarter('numbers, target', '  // ваш код\n  return []'),
      typescript: jsStarter('numbers, target', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[2, 7, 11, 15], 9',
        expected: '[1, 2]',
        assertion: 'assertDeepEqual(candidate([2, 7, 11, 15], 9), [1, 2])',
      },
      {
        title: 'сумма внутри массива',
        input: '[2, 3, 4], 6',
        expected: '[1, 3]',
        assertion: 'assertDeepEqual(candidate([2, 3, 4], 6), [1, 3])',
      },
      {
        title: 'отрицательные числа',
        input: '[-1, 0], -1',
        expected: '[1, 2]',
        assertion: 'assertDeepEqual(candidate([-1, 0], -1), [1, 2])',
      },
    ],
    solutionNotes: [
      'Два указателя: слева и справа.',
      'Если сумма меньше target — двигайте левый, иначе правый.',
      'Не забудьте прибавить 1 к индексам для 1-based.',
    ],
  },
  {
    id: 'lc-three-sum',
    slug: 'three-sum',
    title: '3Sum',
    category: 'Two Pointers',
    difficulty: 'medium',
    companies: ['Neetcode', 'Meta', 'Yandex'],
    successRate: 41,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел. Верните все уникальные тройки [a, b, c], сумма которых равна нулю. Каждая тройка должна быть отсортирована по возрастанию, а массив троек — лексикографически.',
    constraints: [
      '3 <= nums.length <= 3000',
      'тройки должны быть уникальными',
      'внутри тройки порядок по возрастанию; массив троек отсортирован лексикографически',
    ],
    examples: [
      {
        input: 'solution([-1, 0, 1, 2, -1, -4])',
        output: '[[-1, -1, 2], [-1, 0, 1]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return []'),
      typescript: jsStarter('nums', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[-1, 0, 1, 2, -1, -4]',
        expected: '[[-1, -1, 2], [-1, 0, 1]]',
        assertion:
          'assertDeepEqual(candidate([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]])',
      },
      {
        title: 'нет решений',
        input: '[0, 1, 1]',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([0, 1, 1]), [])',
      },
      {
        title: 'все нули',
        input: '[0, 0, 0, 0]',
        expected: '[[0, 0, 0]]',
        assertion: 'assertDeepEqual(candidate([0, 0, 0, 0]), [[0, 0, 0]])',
      },
    ],
    solutionNotes: [
      'Отсортируйте массив по возрастанию.',
      'Для каждого i ищите пару двумя указателями в подмассиве (i+1..n-1) с суммой -nums[i].',
      'Пропускайте дубликаты: если nums[i] == nums[i-1] или соседние с парой равны.',
    ],
  },
  {
    id: 'lc-container-with-most-water',
    slug: 'container-with-most-water',
    title: 'Контейнер с водой',
    category: 'Two Pointers',
    difficulty: 'medium',
    companies: ['Neetcode', 'Bloomberg', 'Amazon'],
    successRate: 54,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив высот. Выберите две линии так, чтобы они вместе с осью X образовывали контейнер, в который поместится максимум воды. Верните этот максимум.',
    constraints: [
      '2 <= height.length <= 10^5',
      '0 <= height[i] <= 10^4',
      'Объём = min(h1, h2) * (j - i)',
    ],
    examples: [
      {
        input: 'solution([1,8,6,2,5,4,8,3,7])',
        output: '49',
      },
    ],
    starterCode: {
      javascript: jsStarter('height', '  // ваш код\n  return 0'),
      typescript: jsStarter('height', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[1,8,6,2,5,4,8,3,7]',
        expected: '49',
        assertion: 'assertDeepEqual(candidate([1,8,6,2,5,4,8,3,7]), 49)',
      },
      {
        title: 'две линии',
        input: '[1, 1]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([1, 1]), 1)',
      },
      {
        title: 'возрастающие',
        input: '[1, 2, 4, 3]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([1, 2, 4, 3]), 4)',
      },
    ],
    solutionNotes: [
      'Два указателя: слева и справа.',
      'Считайте объём, потом двигайте указатель с меньшей высотой — у большей нет смысла уменьшать ширину.',
      'Сложность O(n), память O(1).',
    ],
  },
  {
    id: 'lc-best-time-buy-sell',
    slug: 'best-time-buy-sell',
    title: 'Лучшее время купить и продать акцию',
    category: 'Sliding Window',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Google'],
    successRate: 74,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив цен по дням: prices[i] — цена акции в день i. Можно купить в один день и продать в любой следующий. Верните максимальную возможную прибыль. Если прибыли нет — верните 0.',
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
      'продавать можно только после покупки',
    ],
    examples: [
      {
        input: 'solution([7, 1, 5, 3, 6, 4])',
        output: '5',
        explanation: 'купить на 1, продать на 6',
      },
    ],
    starterCode: {
      javascript: jsStarter('prices', '  // ваш код\n  return 0'),
      typescript: jsStarter('prices', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[7, 1, 5, 3, 6, 4]',
        expected: '5',
        assertion: 'assertDeepEqual(candidate([7, 1, 5, 3, 6, 4]), 5)',
      },
      {
        title: 'монотонно убывающие',
        input: '[7, 6, 4, 3, 1]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([7, 6, 4, 3, 1]), 0)',
      },
      {
        title: 'один день',
        input: '[5]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([5]), 0)',
      },
    ],
    solutionNotes: [
      'Запоминайте минимум, увиденный слева.',
      'На каждом шаге обновляйте ответ как max(ответ, price - minSoFar).',
      'Сложность O(n), память O(1).',
    ],
  },
  {
    id: 'lc-longest-substring-no-repeat',
    slug: 'longest-substring-no-repeat',
    title: 'Длиннейшая подстрока без повторов',
    category: 'Sliding Window',
    difficulty: 'medium',
    companies: ['Neetcode', 'Google', 'Meta'],
    successRate: 48,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка. Верните длину самой длинной подстроки, в которой все символы различны.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      'строка может содержать любые ASCII-символы',
      'решение должно быть не хуже O(n)',
    ],
    examples: [
      {
        input: 'solution("abcabcbb")',
        output: '3',
        explanation: '"abc"',
      },
      {
        input: 'solution("bbbbb")',
        output: '1',
      },
    ],
    starterCode: {
      javascript: jsStarter('s', '  // ваш код\n  return 0'),
      typescript: jsStarter('s', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'разные символы в начале',
        input: '"abcabcbb"',
        expected: '3',
        assertion: "assertDeepEqual(candidate('abcabcbb'), 3)",
      },
      {
        title: 'все одинаковые',
        input: '"bbbbb"',
        expected: '1',
        assertion: "assertDeepEqual(candidate('bbbbb'), 1)",
      },
      {
        title: 'смешанная строка',
        input: '"pwwkew"',
        expected: '3',
        assertion: "assertDeepEqual(candidate('pwwkew'), 3)",
      },
      {
        title: 'пустая строка',
        input: '""',
        expected: '0',
        assertion: "assertDeepEqual(candidate(''), 0)",
      },
    ],
    solutionNotes: [
      'Скользящее окно: двигайте правый указатель, добавляя символы в Map последнего индекса.',
      'Если символ уже в окне — поднимите левый указатель за его предыдущую позицию.',
      'На каждом шаге обновляйте ответ длиной окна.',
    ],
  },
  {
    id: 'lc-binary-search',
    slug: 'binary-search',
    title: 'Бинарный поиск',
    category: 'Binary Search',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Tinkoff'],
    successRate: 78,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан отсортированный по возрастанию массив целых чисел и target. Верните индекс target в массиве или -1, если его нет. Решение должно быть за O(log n).',
    constraints: [
      '1 <= nums.length <= 10^4',
      'массив отсортирован по возрастанию',
      'числа уникальны',
    ],
    examples: [
      {
        input: 'solution([-1, 0, 3, 5, 9, 12], 9)',
        output: '4',
      },
      {
        input: 'solution([-1, 0, 3, 5, 9, 12], 2)',
        output: '-1',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, target', '  // ваш код\n  return -1'),
      typescript: jsStarter('nums, target', '  // ваш код\n  return -1'),
    },
    tests: [
      {
        title: 'найден в середине',
        input: '[-1, 0, 3, 5, 9, 12], 9',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([-1, 0, 3, 5, 9, 12], 9), 4)',
      },
      {
        title: 'не найден',
        input: '[-1, 0, 3, 5, 9, 12], 2',
        expected: '-1',
        assertion: 'assertDeepEqual(candidate([-1, 0, 3, 5, 9, 12], 2), -1)',
      },
      {
        title: 'один элемент',
        input: '[5], 5',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([5], 5), 0)',
      },
      {
        title: 'пустой массив',
        input: '[], 1',
        expected: '-1',
        assertion: 'assertDeepEqual(candidate([], 1), -1)',
      },
    ],
    solutionNotes: [
      'Две границы left = 0, right = n - 1.',
      'На каждом шаге mid = (left + right) >> 1, сравнивайте nums[mid] с target.',
      'Не забудьте про переполнение: лучше mid = left + ((right - left) >> 1).',
    ],
  },
  {
    id: 'lc-reverse-string',
    slug: 'reverse-string',
    title: 'Развернуть строку на месте',
    category: 'Two Pointers',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Frontend'],
    successRate: 88,
    estimatedMinutes: 5,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив символов, представляющий строку. Разверните его на месте (in-place) и верните тот же массив. Решение должно работать за O(1) по доп. памяти.',
    constraints: [
      '1 <= s.length <= 10^5',
      'in-place: нельзя создавать новый массив длины n',
      'возвращать нужно сам изменённый массив',
    ],
    examples: [
      {
        input: 'solution(["h","e","l","l","o"])',
        output: '["o","l","l","e","h"]',
      },
    ],
    starterCode: {
      javascript: jsStarter('s', '  // ваш код\n  return s'),
      typescript: jsStarter('s', '  // ваш код\n  return s'),
    },
    tests: [
      {
        title: 'нечётная длина',
        input: '["h","e","l","l","o"]',
        expected: '["o","l","l","e","h"]',
        assertion:
          "assertDeepEqual(candidate(['h','e','l','l','o']), ['o','l','l','e','h'])",
      },
      {
        title: 'чётная длина',
        input: '["H","a","n","n","a","h"]',
        expected: '["h","a","n","n","a","H"]',
        assertion:
          "assertDeepEqual(candidate(['H','a','n','n','a','h']), ['h','a','n','n','a','H'])",
      },
      {
        title: 'один символ',
        input: '["a"]',
        expected: '["a"]',
        assertion: "assertDeepEqual(candidate(['a']), ['a'])",
      },
    ],
    solutionNotes: [
      'Два указателя: начало и конец.',
      'Обменивайте символы и двигайтесь навстречу до пересечения.',
      'Возвращайте исходный массив s, не новый.',
    ],
  },
  {
    id: 'lc-longest-common-prefix',
    slug: 'longest-common-prefix',
    title: 'Длиннейший общий префикс',
    category: 'Strings',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Ozon'],
    successRate: 66,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив строк. Верните самый длинный общий префикс для всех строк. Если его нет — верните пустую строку.',
    constraints: [
      '0 <= strs.length <= 200',
      '0 <= strs[i].length <= 200',
      'строки состоят из латинских букв',
    ],
    examples: [
      {
        input: 'solution(["flower","flow","flight"])',
        output: '"fl"',
      },
      {
        input: 'solution(["dog","racecar","car"])',
        output: '""',
      },
    ],
    starterCode: {
      javascript: jsStarter('strs', "  // ваш код\n  return ''"),
      typescript: jsStarter('strs', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'общий префикс',
        input: '["flower","flow","flight"]',
        expected: '"fl"',
        assertion:
          "assertDeepEqual(candidate(['flower','flow','flight']), 'fl')",
      },
      {
        title: 'нет общего префикса',
        input: '["dog","racecar","car"]',
        expected: '""',
        assertion:
          "assertDeepEqual(candidate(['dog','racecar','car']), '')",
      },
      {
        title: 'одна строка',
        input: '["single"]',
        expected: '"single"',
        assertion: "assertDeepEqual(candidate(['single']), 'single')",
      },
      {
        title: 'пустой массив',
        input: '[]',
        expected: '""',
        assertion: "assertDeepEqual(candidate([]), '')",
      },
    ],
    solutionNotes: [
      'Возьмите первую строку за эталон префикса.',
      'Идите по остальным и укорачивайте префикс до совпадения.',
      'Если префикс стал пустым — можно сразу вернуть пустую строку.',
    ],
  },
  {
    id: 'lc-daily-temperatures',
    slug: 'daily-temperatures',
    title: 'Сколько ждать до потепления',
    category: 'Stack',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'Bloomberg'],
    successRate: 56,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив дневных температур. Для каждого дня верните, через сколько дней температура впервые станет больше текущей. Если такого дня не будет — 0.',
    constraints: [
      '1 <= temperatures.length <= 10^5',
      '30 <= temperatures[i] <= 100',
      'решение должно быть не хуже O(n)',
    ],
    examples: [
      {
        input: 'solution([73, 74, 75, 71, 69, 72, 76, 73])',
        output: '[1, 1, 4, 2, 1, 1, 0, 0]',
      },
    ],
    starterCode: {
      javascript: jsStarter('temperatures', '  // ваш код\n  return []'),
      typescript: jsStarter('temperatures', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[73, 74, 75, 71, 69, 72, 76, 73]',
        expected: '[1, 1, 4, 2, 1, 1, 0, 0]',
        assertion:
          'assertDeepEqual(candidate([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0])',
      },
      {
        title: 'монотонно растут',
        input: '[30, 40, 50, 60]',
        expected: '[1, 1, 1, 0]',
        assertion:
          'assertDeepEqual(candidate([30, 40, 50, 60]), [1, 1, 1, 0])',
      },
      {
        title: 'монотонно падают',
        input: '[60, 50, 40, 30]',
        expected: '[0, 0, 0, 0]',
        assertion:
          'assertDeepEqual(candidate([60, 50, 40, 30]), [0, 0, 0, 0])',
      },
    ],
    solutionNotes: [
      'Используйте монотонный убывающий стек индексов.',
      'Когда новая температура выше вершины стека, снимайте индекс и пишите в ответ разницу.',
      'Оставшиеся в стеке индексы получают 0.',
    ],
  },
  {
    id: 'lc-climbing-stairs',
    slug: 'climbing-stairs',
    title: 'Подъём по лестнице',
    category: 'Dynamic Programming',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Yandex'],
    successRate: 80,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'За один шаг можно подняться на 1 или 2 ступеньки. Посчитайте, сколькими способами можно добраться до ступеньки n.',
    constraints: [
      '1 <= n <= 45',
      'за один шаг разрешено 1 или 2 ступеньки',
      'результат — количество уникальных последовательностей шагов',
    ],
    examples: [
      {
        input: 'solution(2)',
        output: '2',
        explanation: '1+1 или 2',
      },
      {
        input: 'solution(3)',
        output: '3',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'n = 2',
        input: '2',
        expected: '2',
        assertion: 'assertDeepEqual(candidate(2), 2)',
      },
      {
        title: 'n = 5',
        input: '5',
        expected: '8',
        assertion: 'assertDeepEqual(candidate(5), 8)',
      },
      {
        title: 'n = 10',
        input: '10',
        expected: '89',
        assertion: 'assertDeepEqual(candidate(10), 89)',
      },
      {
        title: 'n = 1',
        input: '1',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(1), 1)',
      },
    ],
    solutionNotes: [
      'Классическая рекуррентность: f(n) = f(n-1) + f(n-2).',
      'Это числа Фибоначчи. Достаточно двух переменных — O(1) памяти.',
      'Рекурсия без мемоизации работает за O(2^n) — будет TLE.',
    ],
  },
  {
    id: 'lc-house-robber',
    slug: 'house-robber',
    title: 'Вор в домах',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'VK'],
    successRate: 59,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Вдоль улицы стоят дома, в каждом — разная сумма денег. Нельзя грабить два соседних дома подряд (сработает сигнализация). Верните максимальную сумму, которую можно унести.',
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400',
      'нельзя грабить соседние дома',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3, 1])',
        output: '4',
        explanation: 'грабим дома 0 и 2',
      },
      {
        input: 'solution([2, 7, 9, 3, 1])',
        output: '12',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[1, 2, 3, 1]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 1]), 4)',
      },
      {
        title: 'длиннее',
        input: '[2, 7, 9, 3, 1]',
        expected: '12',
        assertion: 'assertDeepEqual(candidate([2, 7, 9, 3, 1]), 12)',
      },
      {
        title: 'один дом',
        input: '[5]',
        expected: '5',
        assertion: 'assertDeepEqual(candidate([5]), 5)',
      },
      {
        title: 'два дома',
        input: '[2, 1]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([2, 1]), 2)',
      },
    ],
    solutionNotes: [
      'Рекуррентность: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
      'Достаточно двух переменных prev и prev2 — O(1) по памяти.',
      'База: prev = 0, prev2 = 0, идём слева направо.',
    ],
  },
  {
    id: 'lc-coin-change',
    slug: 'coin-change',
    title: 'Размен монетами',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'Google'],
    successRate: 44,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Даны номиналы монет и сумма amount. Верните минимальное количество монет, которыми можно набрать эту сумму. Каждый номинал можно использовать неограниченно. Если сумму собрать нельзя — верните -1.',
    constraints: [
      '1 <= coins.length <= 12',
      '0 <= amount <= 10^4',
      'каждый номинал можно использовать сколько угодно раз',
    ],
    examples: [
      {
        input: 'solution([1, 2, 5], 11)',
        output: '3',
        explanation: '5 + 5 + 1',
      },
      {
        input: 'solution([2], 3)',
        output: '-1',
      },
    ],
    starterCode: {
      javascript: jsStarter('coins, amount', '  // ваш код\n  return -1'),
      typescript: jsStarter('coins, amount', '  // ваш код\n  return -1'),
    },
    tests: [
      {
        title: 'амунт можно собрать',
        input: '[1, 2, 5], 11',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([1, 2, 5], 11), 3)',
      },
      {
        title: 'сумму нельзя собрать',
        input: '[2], 3',
        expected: '-1',
        assertion: 'assertDeepEqual(candidate([2], 3), -1)',
      },
      {
        title: 'нулевая сумма',
        input: '[1], 0',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([1], 0), 0)',
      },
    ],
    solutionNotes: [
      'dp[x] = минимальное число монет для суммы x.',
      'База dp[0] = 0; переход: dp[x] = min(dp[x - coin] + 1) по всем coin.',
      'Если dp[amount] осталось Infinity — верните -1.',
    ],
  },
  {
    id: 'lc-maximum-subarray',
    slug: 'maximum-subarray',
    title: 'Максимальная сумма подмассива',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'Meta'],
    successRate: 62,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел. Найдите непрерывный подмассив ненулевой длины с максимальной суммой и верните эту сумму. Алгоритм Кадане.',
    constraints: [
      '1 <= nums.length <= 10^5',
      'элементы могут быть отрицательными',
      'подмассив должен быть непрерывным и непустым',
    ],
    examples: [
      {
        input: 'solution([-2, 1, -3, 4, -1, 2, 1, -5, 4])',
        output: '6',
        explanation: '[4, -1, 2, 1] даёт сумму 6',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expected: '6',
        assertion:
          'assertDeepEqual(candidate([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6)',
      },
      {
        title: 'один элемент',
        input: '[1]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([1]), 1)',
      },
      {
        title: 'все отрицательные',
        input: '[-3, -2, -5, -1]',
        expected: '-1',
        assertion: 'assertDeepEqual(candidate([-3, -2, -5, -1]), -1)',
      },
    ],
    solutionNotes: [
      'Храните текущую сумму cur и лучший ответ best.',
      'Переход: cur = max(nums[i], cur + nums[i]).',
      'Ответ — максимум всех cur за проход. Сложность O(n).',
    ],
  },
  {
    id: 'lc-jump-game',
    slug: 'jump-game',
    title: 'Игра в прыжки',
    category: 'Greedy',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon', 'Tinkoff'],
    successRate: 50,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив неотрицательных чисел. Вы стартуете в индексе 0, и из позиции i можете прыгнуть не дальше чем на nums[i] позиций вперёд. Верните true, если можно добраться до последнего индекса, иначе false.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 10^5',
      'стартовая позиция — индекс 0',
    ],
    examples: [
      {
        input: 'solution([2, 3, 1, 1, 4])',
        output: 'true',
      },
      {
        input: 'solution([3, 2, 1, 0, 4])',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return false'),
      typescript: jsStarter('nums', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'можно дойти',
        input: '[2, 3, 1, 1, 4]',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate([2, 3, 1, 1, 4]), true)',
      },
      {
        title: 'нельзя дойти',
        input: '[3, 2, 1, 0, 4]',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate([3, 2, 1, 0, 4]), false)',
      },
      {
        title: 'массив длины 1',
        input: '[0]',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate([0]), true)',
      },
    ],
    solutionNotes: [
      'Жадно: храните дальнюю достижимую позицию maxReach.',
      'Если i > maxReach — вернуть false (застряли).',
      'Обновляйте maxReach = max(maxReach, i + nums[i]); если >= n-1 — true.',
    ],
  },
  {
    id: 'lc-single-number',
    slug: 'single-number',
    title: 'Одинокое число',
    category: 'Bit Manipulation',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Яндекс'],
    successRate: 84,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив, где каждое число встречается дважды, кроме одного. Найдите это одиночное число. Решение должно быть за O(n) по времени и O(1) по памяти.',
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      'каждый элемент встречается дважды, кроме одного',
      'решение должно быть за O(1) по памяти',
    ],
    examples: [
      {
        input: 'solution([2, 2, 1])',
        output: '1',
      },
      {
        input: 'solution([4, 1, 2, 1, 2])',
        output: '4',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[2, 2, 1]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([2, 2, 1]), 1)',
      },
      {
        title: 'длиннее',
        input: '[4, 1, 2, 1, 2]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([4, 1, 2, 1, 2]), 4)',
      },
      {
        title: 'один элемент',
        input: '[7]',
        expected: '7',
        assertion: 'assertDeepEqual(candidate([7]), 7)',
      },
    ],
    solutionNotes: [
      'Ключ — XOR: a ^ a === 0, a ^ 0 === a.',
      'Сверните массив XOR-ом, останется одиночное значение.',
      'O(n) по времени, O(1) по памяти.',
    ],
  },
  {
    id: 'lc-missing-number',
    slug: 'missing-number',
    title: 'Пропущенное число',
    category: 'Bit Manipulation',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Ozon'],
    successRate: 79,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив из n различных чисел в диапазоне [0, n]. Ровно одно число из диапазона пропущено. Найдите его.',
    constraints: [
      '1 <= n <= 10^4',
      'числа в массиве уникальны',
      'диапазон: [0, n]',
    ],
    examples: [
      {
        input: 'solution([3, 0, 1])',
        output: '2',
      },
      {
        input: 'solution([0, 1])',
        output: '2',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'пропуск в середине',
        input: '[3, 0, 1]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([3, 0, 1]), 2)',
      },
      {
        title: 'пропуск в конце',
        input: '[0, 1]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([0, 1]), 2)',
      },
      {
        title: 'пропуск в начале',
        input: '[1, 2, 3]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([1, 2, 3]), 0)',
      },
    ],
    solutionNotes: [
      'Подход через сумму: n * (n + 1) / 2 - sum(nums).',
      'Подход через XOR: XOR индексов [0..n] и всех элементов.',
      'Оба дают O(n) по времени и O(1) по памяти.',
    ],
  },
  {
    id: 'lc-number-of-1-bits',
    slug: 'number-of-1-bits',
    title: 'Число единичных битов',
    category: 'Bit Manipulation',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon', 'Sber'],
    successRate: 81,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дано беззнаковое целое число. Верните количество единичных битов в его двоичном представлении (известно как Hamming weight).',
    constraints: [
      '0 <= n <= 2^31 - 1',
      'число неотрицательное',
      'используйте побитовые операции',
    ],
    examples: [
      {
        input: 'solution(11)',
        output: '3',
        explanation: '11 = 0b1011 → 3 единицы',
      },
      {
        input: 'solution(128)',
        output: '1',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: '11 = 0b1011',
        input: '11',
        expected: '3',
        assertion: 'assertDeepEqual(candidate(11), 3)',
      },
      {
        title: '128 = 0b10000000',
        input: '128',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(128), 1)',
      },
      {
        title: '0',
        input: '0',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(0), 0)',
      },
      {
        title: '0b11111111',
        input: '255',
        expected: '8',
        assertion: 'assertDeepEqual(candidate(255), 8)',
      },
    ],
    solutionNotes: [
      'Простой способ: цикл, проверяйте младший бит (n & 1), сдвигайте n >>>= 1.',
      'Быстрее: трюк n & (n - 1) сбрасывает младший единичный бит. Считайте, сколько раз можно так сделать.',
      'Сложность O(число единиц) у второго подхода.',
    ],
  },
  {
    id: 'lc-fizzbuzz',
    slug: 'fizzbuzz',
    title: 'FizzBuzz',
    category: 'Strings',
    difficulty: 'easy',
    companies: ['Neetcode', 'Microsoft'],
    successRate: 90,
    estimatedMinutes: 8,
    languages: ['javascript', 'typescript'],
    description:
      'Верните массив строк длины n. Для чисел от 1 до n: если число делится на 3 — "Fizz", если на 5 — "Buzz", если на 15 — "FizzBuzz", иначе само число в виде строки.',
    constraints: ['1 <= n <= 10^4', 'результат — массив строк длины n'],
    examples: [
      { input: 'solution(5)', output: "['1', '2', 'Fizz', '4', 'Buzz']" },
      { input: 'solution(3)', output: "['1', '2', 'Fizz']", explanation: '3 делится на 3' },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return []'),
      typescript: jsStarter('n', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'малый n',
        input: '5',
        expected: "['1', '2', 'Fizz', '4', 'Buzz']",
        assertion: "assertDeepEqual(candidate(5), ['1', '2', 'Fizz', '4', 'Buzz'])",
      },
      {
        title: 'кратно 3',
        input: '3',
        expected: "['1', '2', 'Fizz']",
        assertion: "assertDeepEqual(candidate(3), ['1', '2', 'Fizz'])",
      },
      {
        title: 'FizzBuzz на 15',
        input: '15',
        expected: "[..., 'FizzBuzz']",
        assertion:
          "assertDeepEqual(candidate(15), ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'])",
      },
      {
        title: 'n = 1',
        input: '1',
        expected: "['1']",
        assertion: "assertDeepEqual(candidate(1), ['1'])",
      },
    ],
    solutionNotes: [
      'Идите циклом от 1 до n включительно.',
      'Проверяйте делимость на 15 первой (или комбинируйте флаги для 3 и 5).',
      'Число добавляйте как строку: String(i).',
    ],
  },
  {
    id: 'lc-move-zeroes',
    slug: 'move-zeroes',
    title: 'Перенести нули в конец',
    category: 'Two Pointers',
    difficulty: 'easy',
    companies: ['Facebook', 'Amazon'],
    successRate: 78,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел. Верните массив, в котором все нули перенесены в конец, а относительный порядок ненулевых элементов сохранён.',
    constraints: [
      '1 <= nums.length <= 10^4',
      'относительный порядок ненулевых элементов сохраняется',
    ],
    examples: [
      { input: 'solution([0, 1, 0, 3, 12])', output: '[1, 3, 12, 0, 0]' },
      { input: 'solution([0])', output: '[0]' },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return []'),
      typescript: jsStarter('nums', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[0, 1, 0, 3, 12]',
        expected: '[1, 3, 12, 0, 0]',
        assertion: 'assertDeepEqual(candidate([0, 1, 0, 3, 12]), [1, 3, 12, 0, 0])',
      },
      {
        title: 'один ноль',
        input: '[0]',
        expected: '[0]',
        assertion: 'assertDeepEqual(candidate([0]), [0])',
      },
      {
        title: 'без нулей',
        input: '[1, 2, 3]',
        expected: '[1, 2, 3]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3]), [1, 2, 3])',
      },
      {
        title: 'нули в начале',
        input: '[0, 0, 1]',
        expected: '[1, 0, 0]',
        assertion: 'assertDeepEqual(candidate([0, 0, 1]), [1, 0, 0])',
      },
    ],
    solutionNotes: [
      'Соберите ненулевые элементы по порядку.',
      'Добавьте в конец столько нулей, сколько их было.',
      'Можно за один проход с указателем позиции вставки. Сложность O(n).',
    ],
  },
  {
    id: 'lc-majority-element',
    slug: 'majority-element',
    title: 'Мажоритарный элемент',
    category: 'Arrays',
    difficulty: 'easy',
    companies: ['Amazon', 'Adobe'],
    successRate: 80,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив длины n. Верните элемент, который встречается более ⌊n/2⌋ раз. Такой элемент гарантированно существует.',
    constraints: ['1 <= nums.length <= 10^4', 'мажоритарный элемент гарантированно есть'],
    examples: [
      { input: 'solution([3, 2, 3])', output: '3' },
      { input: 'solution([2, 2, 1, 1, 1, 2, 2])', output: '2' },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'короткий массив',
        input: '[3, 2, 3]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([3, 2, 3]), 3)',
      },
      {
        title: 'длиннее',
        input: '[2, 2, 1, 1, 1, 2, 2]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([2, 2, 1, 1, 1, 2, 2]), 2)',
      },
      {
        title: 'один элемент',
        input: '[1]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([1]), 1)',
      },
      {
        title: 'два против одного',
        input: '[6, 5, 5]',
        expected: '5',
        assertion: 'assertDeepEqual(candidate([6, 5, 5]), 5)',
      },
    ],
    solutionNotes: [
      'Простой способ: посчитайте частоты в Map и верните элемент с count > n / 2.',
      'Алгоритм Бойера—Мура: храните кандидата и счётчик. O(n) времени, O(1) памяти.',
    ],
  },
  {
    id: 'lc-rotate-array',
    slug: 'rotate-array',
    title: 'Поворот массива',
    category: 'Arrays',
    difficulty: 'medium',
    companies: ['Microsoft', 'Amazon'],
    successRate: 65,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив nums и неотрицательное число k. Верните массив, повёрнутый вправо на k позиций. k может быть больше длины массива.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= k <= 10^9', 'поворот циклический'],
    examples: [
      {
        input: 'solution([1, 2, 3, 4, 5, 6, 7], 3)',
        output: '[5, 6, 7, 1, 2, 3, 4]',
        explanation: 'три последних элемента уходят в начало',
      },
      { input: 'solution([-1, -100, 3, 99], 2)', output: '[3, 99, -1, -100]' },
    ],
    starterCode: {
      javascript: jsStarter('nums, k', '  // ваш код\n  return []'),
      typescript: jsStarter('nums, k', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '[1, 2, 3, 4, 5, 6, 7], 3',
        expected: '[5, 6, 7, 1, 2, 3, 4]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4, 5, 6, 7], 3), [5, 6, 7, 1, 2, 3, 4])',
      },
      {
        title: 'отрицательные числа',
        input: '[-1, -100, 3, 99], 2',
        expected: '[3, 99, -1, -100]',
        assertion: 'assertDeepEqual(candidate([-1, -100, 3, 99], 2), [3, 99, -1, -100])',
      },
      {
        title: 'k больше длины',
        input: '[1, 2], 3',
        expected: '[2, 1]',
        assertion: 'assertDeepEqual(candidate([1, 2], 3), [2, 1])',
      },
      {
        title: 'k = 0',
        input: '[1, 2, 3], 0',
        expected: '[1, 2, 3]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3], 0), [1, 2, 3])',
      },
    ],
    solutionNotes: [
      'Возьмите k = k % nums.length, иначе лишние полные обороты.',
      'Ответ: последние k элементов, затем первые (n - k). Можно через slice и concat.',
      'In-place вариант — тройной разворот массива. Сложность O(n).',
    ],
  },
  {
    id: 'lc-longest-increasing-subsequence',
    slug: 'longest-increasing-subsequence',
    title: 'Наибольшая возрастающая подпоследовательность',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    companies: ['Google', 'Microsoft'],
    successRate: 55,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел. Верните длину наибольшей строго возрастающей подпоследовательности (элементы не обязаны идти подряд).',
    constraints: ['1 <= nums.length <= 2500', 'подпоследовательность строго возрастающая'],
    examples: [
      {
        input: 'solution([10, 9, 2, 5, 3, 7, 101, 18])',
        output: '4',
        explanation: 'например, [2, 3, 7, 18]',
      },
      { input: 'solution([7, 7, 7, 7])', output: '1' },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[10, 9, 2, 5, 3, 7, 101, 18]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([10, 9, 2, 5, 3, 7, 101, 18]), 4)',
      },
      {
        title: 'с повторами уровней',
        input: '[0, 1, 0, 3, 2, 3]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([0, 1, 0, 3, 2, 3]), 4)',
      },
      {
        title: 'все одинаковые',
        input: '[7, 7, 7, 7]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([7, 7, 7, 7]), 1)',
      },
      {
        title: 'один элемент',
        input: '[4]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([4]), 1)',
      },
    ],
    solutionNotes: [
      'DP O(n^2): dp[i] — длина LIS, оканчивающейся на i; dp[i] = 1 + max(dp[j]) для j < i и nums[j] < nums[i].',
      'Ответ — максимум по dp.',
      'O(n log n): поддерживайте массив "хвостов" и бинарный поиск позиции вставки.',
    ],
  },
  {
    id: 'lc-unique-paths',
    slug: 'unique-paths',
    title: 'Уникальные пути',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    companies: ['Amazon', 'Bloomberg'],
    successRate: 62,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Робот стоит в левом верхнем углу сетки m x n и хочет попасть в правый нижний угол. За один шаг он может идти только вправо или вниз. Сколько существует уникальных путей?',
    constraints: ['1 <= m, n <= 100', 'робот двигается только вправо или вниз'],
    examples: [
      { input: 'solution(3, 7)', output: '28' },
      { input: 'solution(3, 2)', output: '3' },
    ],
    starterCode: {
      javascript: jsStarter('m, n', '  // ваш код\n  return 0'),
      typescript: jsStarter('m, n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: '3 x 7',
        input: '3, 7',
        expected: '28',
        assertion: 'assertDeepEqual(candidate(3, 7), 28)',
      },
      {
        title: '3 x 2',
        input: '3, 2',
        expected: '3',
        assertion: 'assertDeepEqual(candidate(3, 2), 3)',
      },
      {
        title: '1 x 1',
        input: '1, 1',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(1, 1), 1)',
      },
      {
        title: '3 x 3',
        input: '3, 3',
        expected: '6',
        assertion: 'assertDeepEqual(candidate(3, 3), 6)',
      },
    ],
    solutionNotes: [
      'DP: dp[i][j] = dp[i-1][j] + dp[i][j-1], первая строка и первый столбец равны 1.',
      'Хватает одной строки массива (rolling row). Сложность O(m*n).',
      'Комбинаторика: C(m+n-2, m-1).',
    ],
  },
  {
    id: 'lc-trapping-rain-water',
    slug: 'trapping-rain-water',
    title: 'Сбор дождевой воды',
    category: 'Two Pointers',
    difficulty: 'hard',
    companies: ['Google', 'Amazon', 'Facebook'],
    successRate: 48,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив неотрицательных чисел — высоты столбиков шириной 1. Посчитайте, сколько единиц воды удержится между столбиками после дождя.',
    constraints: ['0 <= height.length <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      { input: 'solution([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])', output: '6' },
      { input: 'solution([4, 2, 0, 3, 2, 5])', output: '9' },
    ],
    starterCode: {
      javascript: jsStarter('height', '  // ваш код\n  return 0'),
      typescript: jsStarter('height', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        expected: '6',
        assertion: 'assertDeepEqual(candidate([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6)',
      },
      {
        title: 'глубокая яма',
        input: '[4, 2, 0, 3, 2, 5]',
        expected: '9',
        assertion: 'assertDeepEqual(candidate([4, 2, 0, 3, 2, 5]), 9)',
      },
      {
        title: 'пустой массив',
        input: '[]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([]), 0)',
      },
      {
        title: 'возрастающие столбики',
        input: '[1, 2, 3]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([1, 2, 3]), 0)',
      },
    ],
    solutionNotes: [
      'Над каждым индексом вода = min(maxLeft, maxRight) - height[i], если положительно.',
      'Два указателя двигайте к меньшей из стенок, поддерживая maxLeft и maxRight.',
      'Сложность O(n) времени, O(1) памяти.',
    ],
  },
  {
    id: 'lc-edit-distance',
    slug: 'edit-distance',
    title: 'Редакционное расстояние',
    category: 'Dynamic Programming',
    difficulty: 'hard',
    companies: ['Google', 'Amazon'],
    successRate: 46,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Даны две строки word1 и word2. Верните минимальное число операций, чтобы превратить word1 в word2. Разрешены вставка, удаление и замена одного символа.',
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'операции: вставка, удаление, замена',
    ],
    examples: [
      {
        input: "solution('horse', 'ros')",
        output: '3',
        explanation: 'horse → rorse → rose → ros',
      },
      { input: "solution('intention', 'execution')", output: '5' },
    ],
    starterCode: {
      javascript: jsStarter('word1, word2', '  // ваш код\n  return 0'),
      typescript: jsStarter('word1, word2', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'horse → ros',
        input: "'horse', 'ros'",
        expected: '3',
        assertion: "assertDeepEqual(candidate('horse', 'ros'), 3)",
      },
      {
        title: 'intention → execution',
        input: "'intention', 'execution'",
        expected: '5',
        assertion: "assertDeepEqual(candidate('intention', 'execution'), 5)",
      },
      {
        title: 'из пустой строки',
        input: "'', 'abc'",
        expected: '3',
        assertion: "assertDeepEqual(candidate('', 'abc'), 3)",
      },
      {
        title: 'равные строки',
        input: "'abc', 'abc'",
        expected: '0',
        assertion: "assertDeepEqual(candidate('abc', 'abc'), 0)",
      },
    ],
    solutionNotes: [
      'DP: dp[i][j] — расстояние между префиксами word1[:i] и word2[:j].',
      'Если символы равны — dp[i][j] = dp[i-1][j-1], иначе 1 + min(удаление, вставка, замена).',
      'База: dp[0][j] = j, dp[i][0] = i. Сложность O(n*m).',
    ],
  },
  {
    id: 'lc-count-vowels',
    slug: 'count-vowels',
    title: 'Сколько гласных в строке',
    category: 'Strings',
    difficulty: 'easy',
    companies: ['Frontend', 'Ozon', 'Авито'],
    successRate: 82,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Посчитайте, сколько гласных букв в английской строке. Гласными считаем a, e, i, o, u — в любом регистре.',
    constraints: [
      'строка может быть пустой',
      'учитываются и заглавные, и строчные буквы',
      'все остальные символы просто игнорируются',
    ],
    examples: [
      {
        input: "solution('hello world')",
        output: '3',
        explanation: "Гласные: 'e', 'o' и ещё одна 'o' в 'world'.",
      },
      {
        input: "solution('XYZ')",
        output: '0',
      },
    ],
    starterCode: {
      javascript: jsStarter('text', '  // ваш код\n  return 0'),
      typescript: jsStarter('text', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'считает гласные в предложении',
        input: "'hello world'",
        expected: '3',
        assertion: "assertDeepEqual(candidate('hello world'), 3)",
      },
      {
        title: 'не зависит от регистра',
        input: "'AEIOU'",
        expected: '5',
        assertion: "assertDeepEqual(candidate('AEIOU'), 5)",
      },
      {
        title: 'строка без гласных',
        input: "'xyz'",
        expected: '0',
        assertion: "assertDeepEqual(candidate('xyz'), 0)",
      },
      {
        title: 'пустая строка',
        input: "''",
        expected: '0',
        assertion: "assertDeepEqual(candidate(''), 0)",
      },
    ],
    solutionNotes: [
      'Приведите строку к одному регистру: text.toLowerCase().',
      "Держите гласные под рукой — в строке 'aeiou' или в Set.",
      'Дальше один проход циклом или filter по символам.',
    ],
  },
  {
    id: 'lc-remove-duplicates',
    slug: 'remove-duplicates',
    title: 'Убрать дубликаты, сохранив порядок',
    category: 'Arrays',
    difficulty: 'easy',
    companies: ['Frontend', 'Яндекс', 'Tinkoff'],
    successRate: 84,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив значений — числа и строки. Верните новый массив без повторов: каждое значение остаётся ровно один раз, на месте своего первого появления.',
    constraints: [
      'порядок первых вхождений менять нельзя',
      'исходный массив не мутируйте',
      'в массиве только примитивы',
    ],
    examples: [
      {
        input: 'solution([1, 2, 2, 3, 1])',
        output: '[1, 2, 3]',
      },
      {
        input: "solution(['a', 'b', 'a'])",
        output: "['a', 'b']",
      },
    ],
    starterCode: {
      javascript: jsStarter('values', '  // ваш код\n  return values'),
      typescript: jsStarter('values', '  // ваш код\n  return values'),
    },
    tests: [
      {
        title: 'убирает повторы чисел',
        input: '[1, 2, 2, 3, 1]',
        expected: '[1, 2, 3]',
        assertion: 'assertDeepEqual(candidate([1, 2, 2, 3, 1]), [1, 2, 3])',
      },
      {
        title: 'работает со строками',
        input: "['a', 'b', 'a', 'c', 'b']",
        expected: "['a', 'b', 'c']",
        assertion: "assertDeepEqual(candidate(['a', 'b', 'a', 'c', 'b']), ['a', 'b', 'c'])",
      },
      {
        title: 'пустой массив',
        input: '[]',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([]), [])',
      },
      {
        title: 'не мутирует исходный массив',
        input: '[1, 1, 2]',
        expected: 'исходник не изменился',
        assertion:
          'const source = [1, 1, 2]; candidate(source); assertDeepEqual(source, [1, 1, 2])',
      },
    ],
    solutionNotes: [
      'Set запоминает, какие значения уже встречались.',
      '[...new Set(values)] решает задачу в одну строку — но будьте готовы объяснить, почему порядок сохраняется.',
      'Альтернатива: values.filter((value, index) => values.indexOf(value) === index).',
    ],
  },
  {
    id: 'lc-deep-sum',
    slug: 'deep-sum',
    title: 'Сумма во вложенном массиве',
    category: 'Arrays',
    difficulty: 'easy',
    companies: ['Frontend', 'Яндекс', 'Авито'],
    successRate: 74,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив, внутри которого могут лежать числа и другие такие же массивы — любой глубины вложенности. Посчитайте сумму всех чисел.',
    constraints: [
      'вложенность может быть любой глубины',
      'кроме чисел и массивов в данных ничего нет',
      'пустой массив даёт 0',
    ],
    examples: [
      {
        input: 'solution([1, [2, [3, 4]], 5])',
        output: '15',
      },
      {
        input: 'solution([])',
        output: '0',
      },
    ],
    starterCode: {
      javascript: jsStarter('values', '  // ваш код\n  return 0'),
      typescript: jsStarter('values', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'смешанная вложенность',
        input: '[1, [2, [3, 4]], 5]',
        expected: '15',
        assertion: 'assertDeepEqual(candidate([1, [2, [3, 4]], 5]), 15)',
      },
      {
        title: 'пустой массив',
        input: '[]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([]), 0)',
      },
      {
        title: 'глубокая вложенность',
        input: '[[[[10]]]]',
        expected: '10',
        assertion: 'assertDeepEqual(candidate([[[[10]]]]), 10)',
      },
      {
        title: 'плоский массив',
        input: '[1, 2, 3]',
        expected: '6',
        assertion: 'assertDeepEqual(candidate([1, 2, 3]), 6)',
      },
    ],
    solutionNotes: [
      'Рекурсия: встретили число — прибавили, встретили массив — вызвали себя.',
      'Array.isArray(value) отличает массив от числа.',
      'Можно и без рекурсии: values.flat(Infinity) и reduce.',
    ],
  },
  {
    id: 'lc-group-by',
    slug: 'group-by',
    title: 'Группировка элементов (groupBy)',
    category: 'Data transforms',
    difficulty: 'medium',
    companies: ['BFE', 'Яндекс', 'Tinkoff'],
    successRate: 56,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Напишите свой groupBy — как в lodash. Функция принимает массив и колбэк, который для каждого элемента возвращает ключ группы. Верните объект: под каждым ключом — массив элементов этой группы, в исходном порядке.',
    constraints: [
      'колбэк возвращает строку или число (число станет строковым ключом объекта)',
      'порядок элементов внутри группы — как в исходном массиве',
      'исходный массив не мутируйте',
    ],
    examples: [
      {
        input: 'solution([6.1, 4.2, 6.3], Math.floor)',
        output: '{ 4: [4.2], 6: [6.1, 6.3] }',
      },
      {
        input: "solution(['one', 'two', 'three'], (word) => word.length)",
        output: "{ 3: ['one', 'two'], 5: ['three'] }",
      },
    ],
    starterCode: {
      javascript: jsStarter('items, getKey', '  // ваш код\n  return {}'),
      typescript: jsStarter('items, getKey', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'группирует по результату колбэка',
        input: '[6.1, 4.2, 6.3], Math.floor',
        expected: '{ 4: [4.2], 6: [6.1, 6.3] }',
        assertion:
          'assertDeepEqual(candidate([6.1, 4.2, 6.3], Math.floor), { 4: [4.2], 6: [6.1, 6.3] })',
      },
      {
        title: 'группирует строки по длине',
        input: "['one', 'two', 'three'], (word) => word.length",
        expected: "{ 3: ['one', 'two'], 5: ['three'] }",
        assertion:
          "assertDeepEqual(candidate(['one', 'two', 'three'], (word) => word.length), { 3: ['one', 'two'], 5: ['three'] })",
      },
      {
        title: 'пустой массив',
        input: '[], (x) => x',
        expected: '{}',
        assertion: 'assertDeepEqual(candidate([], (x) => x), {})',
      },
    ],
    solutionNotes: [
      'Заведите пустой объект-результат.',
      'Для каждого элемента вычислите ключ; если такой группы ещё нет — создайте пустой массив.',
      'Добавьте элемент в свою группу. reduce здесь тоже отлично подходит.',
    ],
  },
  {
    id: 'lc-flatten-object',
    slug: 'flatten-object',
    title: 'Плоский объект из вложенного',
    category: 'Objects',
    difficulty: 'medium',
    companies: ['BFE', 'JetBrains', 'Ozon'],
    successRate: 47,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Конфиг хранится как вложенный объект, а для формы настроек нужен «плоский» вид. Преобразуйте вложенный объект в одноуровневый: ключом становится путь до значения через точку.',
    constraints: [
      'значения — примитивы или вложенные plain-объекты, массивов нет',
      'порядок ключей не важен',
      'исходный объект не мутируйте',
    ],
    examples: [
      {
        input: 'solution({ a: { b: 1 }, c: 2 })',
        output: "{ 'a.b': 1, c: 2 }",
      },
      {
        input: "solution({ theme: { colors: { bg: '#fff' } } })",
        output: "{ 'theme.colors.bg': '#fff' }",
      },
    ],
    starterCode: {
      javascript: jsStarter('config', '  // ваш код\n  return config'),
      typescript: jsStarter('config', '  // ваш код\n  return config'),
    },
    tests: [
      {
        title: 'разворачивает один уровень вложенности',
        input: '{ a: { b: 1 }, c: 2 }',
        expected: "{ 'a.b': 1, c: 2 }",
        assertion: "assertDeepEqual(candidate({ a: { b: 1 }, c: 2 }), { 'a.b': 1, c: 2 })",
      },
      {
        title: 'собирает глубокие пути',
        input: "{ theme: { colors: { bg: '#fff', text: '#000' } } }",
        expected: "{ 'theme.colors.bg': '#fff', 'theme.colors.text': '#000' }",
        assertion:
          "assertDeepEqual(candidate({ theme: { colors: { bg: '#fff', text: '#000' } } }), { 'theme.colors.bg': '#fff', 'theme.colors.text': '#000' })",
      },
      {
        title: 'плоский объект остаётся как есть',
        input: '{ x: 1 }',
        expected: '{ x: 1 }',
        assertion: 'assertDeepEqual(candidate({ x: 1 }), { x: 1 })',
      },
    ],
    solutionNotes: [
      'Рекурсивный обход с накоплением префикса пути.',
      "Ключ верхнего уровня — просто имя; глубже — prefix + '.' + имя.",
      "Объект распознаётся проверкой value !== null && typeof value === 'object'.",
    ],
  },
  {
    id: 'lc-lru-cache',
    slug: 'lru-cache',
    title: 'LRU-кэш',
    category: 'Algorithms',
    difficulty: 'hard',
    companies: ['Amazon', 'Яндекс', 'Tinkoff'],
    successRate: 31,
    estimatedMinutes: 40,
    languages: ['javascript', 'typescript'],
    description:
      'Кэш с ограниченной вместимостью: когда место заканчивается, выкидываем то, чем дольше всего не пользовались (Least Recently Used). Напишите функцию, создающую кэш с методами get(key) — вернуть значение или -1, если ключа нет, и put(key, value) — записать значение. И get, и put делают ключ «свежим».',
    constraints: [
      'capacity — целое число больше 0',
      'get несуществующего ключа возвращает -1',
      'при переполнении удаляется самый давно не использованный ключ',
    ],
    examples: [
      {
        input:
          "const cache = solution(2); cache.put('a', 1); cache.put('b', 2); cache.get('a'); cache.put('c', 3); cache.get('b')",
        output: '-1',
        explanation:
          "Вместимость 2: к моменту записи 'c' самым «несвежим» был 'b' (к 'a' обращались позже), поэтому вытеснили 'b'.",
      },
    ],
    starterCode: {
      javascript: jsStarter(
        'capacity',
        '  // верните объект с методами get(key) и put(key, value)\n  return {\n    get(key) {\n      return -1\n    },\n    put(key, value) {},\n  }'
      ),
      typescript: jsStarter(
        'capacity',
        '  // верните объект с методами get(key) и put(key, value)\n  return {\n    get(key) {\n      return -1\n    },\n    put(key, value) {},\n  }'
      ),
    },
    tests: [
      {
        title: 'хранит и возвращает значения',
        input: "put('a', 1), put('b', 2), get обоих",
        expected: '1 и 2',
        assertion:
          "const cache = candidate(2); cache.put('a', 1); cache.put('b', 2); assertDeepEqual(cache.get('a'), 1); assertDeepEqual(cache.get('b'), 2)",
      },
      {
        title: 'get несуществующего ключа',
        input: "get('нет')",
        expected: '-1',
        assertion: "const cache = candidate(2); assertDeepEqual(cache.get('нет'), -1)",
      },
      {
        title: 'вытесняет самый давно не использованный ключ',
        input: "put a, put b, get a, put c — вместимость 2",
        expected: "b вытеснен, a и c на месте",
        assertion:
          "const cache = candidate(2); cache.put('a', 1); cache.put('b', 2); cache.get('a'); cache.put('c', 3); assertDeepEqual(cache.get('b'), -1); assertDeepEqual(cache.get('a'), 1); assertDeepEqual(cache.get('c'), 3)",
      },
      {
        title: 'put существующего ключа обновляет и освежает его',
        input: "put a, put b, put a(10), put c",
        expected: "вытеснен b, a равен 10",
        assertion:
          "const cache = candidate(2); cache.put('a', 1); cache.put('b', 2); cache.put('a', 10); cache.put('c', 3); assertDeepEqual(cache.get('b'), -1); assertDeepEqual(cache.get('a'), 10)",
      },
    ],
    solutionNotes: [
      'Map в JavaScript помнит порядок вставки ключей — этого достаточно.',
      '«Освежить» ключ = удалить его из Map и вставить заново.',
      'При переполнении удалите самый старый ключ: map.keys().next().value.',
    ],
  },
  {
    id: 'lc-baseball-game',
    slug: 'baseball-game',
    title: 'Бейсбольный счёт',
    category: 'Stack',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon'],
    successRate: 71,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив операций со счётом. Число — записать очки. "C" — удалить последнюю запись. "D" — записать удвоенное значение последней записи. "+" — записать сумму двух последних записей. Верните сумму всех записей после выполнения операций.',
    constraints: [
      'операции всегда корректны: для "C", "D" и "+" в списке достаточно записей',
      'числа в операциях могут быть отрицательными',
      'если записей не осталось, сумма равна 0',
    ],
    examples: [
      {
        input: "solution(['5', '2', 'C', 'D', '+'])",
        output: '30',
        explanation: 'Записи: 5, затем 2, C удаляет 2, D добавляет 10, "+" добавляет 15. Сумма 5 + 10 + 15 = 30.',
      },
    ],
    starterCode: {
      javascript: jsStarter('operations', '  // ваш код\n  return 0'),
      typescript: jsStarter('operations', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'базовый сценарий',
        input: "['5', '2', 'C', 'D', '+']",
        expected: '30',
        assertion: "assertDeepEqual(candidate(['5', '2', 'C', 'D', '+']), 30)",
      },
      {
        title: 'отрицательные очки',
        input: "['5', '-2', '4', 'C', 'D', '9', '+', '+']",
        expected: '27',
        assertion:
          "assertDeepEqual(candidate(['5', '-2', '4', 'C', 'D', '9', '+', '+']), 27)",
      },
      {
        title: 'все записи удалены',
        input: "['1', 'C']",
        expected: '0',
        assertion: "assertDeepEqual(candidate(['1', 'C']), 0)",
      },
    ],
    solutionNotes: [
      'Держите стек записанных очков.',
      'Каждая операция работает только с вершиной стека: push, pop или чтение последних элементов.',
      'В конце сложите всё, что осталось в стеке.',
    ],
  },
  {
    id: 'lc-remove-adjacent-duplicates',
    slug: 'remove-adjacent-duplicates',
    title: 'Удалить соседние дубликаты',
    category: 'Stack',
    difficulty: 'easy',
    companies: ['Amazon', 'Yandex', 'Frontend'],
    successRate: 68,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка из строчных латинских букв. Удаляйте пары одинаковых соседних символов до тех пор, пока это возможно, и верните итоговую строку.',
    constraints: [
      'строка состоит из строчных латинских букв',
      'удаление пары может открыть новую пару — её тоже нужно удалить',
      'результат может быть пустой строкой',
    ],
    examples: [
      {
        input: "solution('abbaca')",
        output: "'ca'",
        explanation: "Удаляем 'bb' → 'aaca', затем 'aa' → 'ca'.",
      },
    ],
    starterCode: {
      javascript: jsStarter('s', "  // ваш код\n  return ''"),
      typescript: jsStarter('s', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'каскадное удаление',
        input: "'abbaca'",
        expected: "'ca'",
        assertion: "assertDeepEqual(candidate('abbaca'), 'ca')",
      },
      {
        title: 'удаление в середине',
        input: "'azxxzy'",
        expected: "'ay'",
        assertion: "assertDeepEqual(candidate('azxxzy'), 'ay')",
      },
      {
        title: 'строка удаляется целиком',
        input: "'aabb'",
        expected: "''",
        assertion: "assertDeepEqual(candidate('aabb'), '')",
      },
      {
        title: 'нет дубликатов',
        input: "'abc'",
        expected: "'abc'",
        assertion: "assertDeepEqual(candidate('abc'), 'abc')",
      },
    ],
    solutionNotes: [
      'Кладите символы в стек по одному.',
      'Если очередной символ совпадает с вершиной стека — снимите вершину вместо добавления.',
      'В конце склейте стек в строку: join("").',
    ],
  },
  {
    id: 'lc-backspace-compare',
    slug: 'backspace-compare',
    title: 'Сравнение строк с backspace',
    category: 'Stack',
    difficulty: 'easy',
    companies: ['Google', 'Frontend'],
    successRate: 64,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Даны две строки, где символ # означает backspace (удаление предыдущего символа). Верните true, если после применения всех backspace строки равны.',
    constraints: [
      'строки состоят из строчных букв и символов #',
      'backspace на пустой строке ничего не делает',
      'решение через стек — самое наглядное',
    ],
    examples: [
      {
        input: "solution('ab#c', 'ad#c')",
        output: 'true',
        explanation: "Обе строки превращаются в 'ac'.",
      },
    ],
    starterCode: {
      javascript: jsStarter('s, t', '  // ваш код\n  return false'),
      typescript: jsStarter('s, t', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'строки совпадают после удаления',
        input: "'ab#c', 'ad#c'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('ab#c', 'ad#c'), true)",
      },
      {
        title: 'обе строки пустеют',
        input: "'ab##', 'c#d#'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('ab##', 'c#d#'), true)",
      },
      {
        title: 'строки различаются',
        input: "'a#c', 'b'",
        expected: 'false',
        assertion: "assertDeepEqual(candidate('a#c', 'b'), false)",
      },
      {
        title: 'backspace на пустой строке',
        input: "'a##c', '#a#c'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('a##c', '#a#c'), true)",
      },
    ],
    solutionNotes: [
      'Соберите каждую строку через стек: символ — push, # — pop.',
      'Сравните получившиеся стеки через join.',
      'Продвинутый вариант без памяти: идите по строкам с конца двумя указателями.',
    ],
  },
  {
    id: 'lc-min-stack',
    slug: 'min-stack',
    title: 'Стек с минимумом',
    category: 'Stack',
    difficulty: 'medium',
    companies: ['Amazon', 'Yandex', 'Tinkoff'],
    successRate: 52,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте стек, который кроме push, pop и top умеет возвращать минимальный элемент за O(1). Функция должна вернуть объект с методами push(value), pop(), top() и getMin().',
    constraints: [
      'все операции должны работать за O(1)',
      'pop и top вызываются только на непустом стеке',
      'значения могут быть отрицательными',
    ],
    examples: [
      {
        input:
          'const stack = solution(); stack.push(-2); stack.push(0); stack.push(-3); stack.getMin()',
        output: '-3',
      },
    ],
    starterCode: {
      javascript: jsStarter(
        '',
        '  // верните объект с методами push(value), pop(), top() и getMin()\n  return {\n    push(value) {},\n    pop() {},\n    top() {},\n    getMin() {},\n  }'
      ),
      typescript: jsStarter(
        '',
        '  // верните объект с методами push(value), pop(), top() и getMin()\n  return {\n    push(value) {},\n    pop() {},\n    top() {},\n    getMin() {},\n  }'
      ),
    },
    tests: [
      {
        title: 'getMin возвращает минимум',
        input: 'push(-2), push(0), push(-3), getMin()',
        expected: '-3',
        assertion:
          'const stack = candidate(); stack.push(-2); stack.push(0); stack.push(-3); assertDeepEqual(stack.getMin(), -3)',
      },
      {
        title: 'минимум обновляется после pop',
        input: 'push(-2), push(0), push(-3), pop(), getMin()',
        expected: '-2',
        assertion:
          'const stack = candidate(); stack.push(-2); stack.push(0); stack.push(-3); stack.pop(); assertDeepEqual(stack.getMin(), -2); assertDeepEqual(stack.top(), 0)',
      },
      {
        title: 'top возвращает вершину',
        input: 'push(5), push(1), top()',
        expected: '1',
        assertion:
          'const stack = candidate(); stack.push(5); stack.push(1); assertDeepEqual(stack.top(), 1)',
      },
      {
        title: 'дубликаты минимума',
        input: 'push(1), push(1), pop(), getMin()',
        expected: '1',
        assertion:
          'const stack = candidate(); stack.push(1); stack.push(1); stack.pop(); assertDeepEqual(stack.getMin(), 1)',
      },
    ],
    solutionNotes: [
      'Держите второй стек минимумов параллельно основному.',
      'При push кладите в стек минимумов Math.min(value, текущий минимум).',
      'При pop снимайте элементы с обоих стеков — так getMin всегда O(1).',
    ],
  },
  {
    id: 'lc-evaluate-rpn',
    slug: 'evaluate-rpn',
    title: 'Обратная польская запись',
    category: 'Stack',
    difficulty: 'medium',
    companies: ['Neetcode', 'Google', 'Sber'],
    successRate: 55,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив токенов арифметического выражения в обратной польской записи (RPN). Вычислите его значение. Допустимые операторы: +, -, *, /. Деление усекается к нулю.',
    constraints: [
      'выражение всегда корректно',
      'деление усекается в сторону нуля: 6 / -132 = 0',
      'промежуточные значения помещаются в 32-битное число',
    ],
    examples: [
      {
        input: "solution(['2', '1', '+', '3', '*'])",
        output: '9',
        explanation: '(2 + 1) * 3 = 9.',
      },
    ],
    starterCode: {
      javascript: jsStarter('tokens', '  // ваш код\n  return 0'),
      typescript: jsStarter('tokens', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'сложение и умножение',
        input: "['2', '1', '+', '3', '*']",
        expected: '9',
        assertion: "assertDeepEqual(candidate(['2', '1', '+', '3', '*']), 9)",
      },
      {
        title: 'деление с усечением',
        input: "['4', '13', '5', '/', '+']",
        expected: '6',
        assertion: "assertDeepEqual(candidate(['4', '13', '5', '/', '+']), 6)",
      },
      {
        title: 'сложное выражение с отрицательными числами',
        input: "['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']",
        expected: '22',
        assertion:
          "assertDeepEqual(candidate(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']), 22)",
      },
      {
        title: 'одно число',
        input: "['42']",
        expected: '42',
        assertion: "assertDeepEqual(candidate(['42']), 42)",
      },
    ],
    solutionNotes: [
      'Числа кладите в стек, оператор снимает два верхних операнда.',
      'Порядок важен: второй снятый операнд — левый: b op a, где a снят первым.',
      'Для деления используйте Math.trunc, а не Math.floor — поведение с отрицательными отличается.',
    ],
  },
  {
    id: 'lc-largest-rectangle-histogram',
    slug: 'largest-rectangle-histogram',
    title: 'Наибольший прямоугольник в гистограмме',
    category: 'Stack',
    difficulty: 'hard',
    companies: ['Google', 'Amazon', 'Yandex'],
    successRate: 27,
    estimatedMinutes: 40,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив высот столбцов гистограммы (ширина каждого столбца равна 1). Найдите площадь наибольшего прямоугольника, который можно вписать в гистограмму.',
    constraints: [
      'высоты — неотрицательные целые числа',
      'ожидаемая сложность O(n) с монотонным стеком',
      'массив может содержать один элемент',
    ],
    examples: [
      {
        input: 'solution([2, 1, 5, 6, 2, 3])',
        output: '10',
        explanation: 'Прямоугольник высотой 5 на столбцах 5 и 6: 5 * 2 = 10.',
      },
    ],
    starterCode: {
      javascript: jsStarter('heights', '  // ваш код\n  return 0'),
      typescript: jsStarter('heights', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[2, 1, 5, 6, 2, 3]',
        expected: '10',
        assertion: 'assertDeepEqual(candidate([2, 1, 5, 6, 2, 3]), 10)',
      },
      {
        title: 'два столбца',
        input: '[2, 4]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([2, 4]), 4)',
      },
      {
        title: 'один столбец',
        input: '[1]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([1]), 1)',
      },
      {
        title: 'широкий низкий прямоугольник выгоднее',
        input: '[2, 1, 2]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([2, 1, 2]), 3)',
      },
    ],
    solutionNotes: [
      'Храните в стеке индексы столбцов с возрастающими высотами.',
      'Когда текущий столбец ниже вершины стека — снимайте столбцы и считайте площадь: высота снятого на ширину между соседями в стеке.',
      'В конце прогоните «виртуальный» столбец высоты 0, чтобы опустошить стек.',
    ],
  },
  {
    id: 'lc-reverse-words',
    slug: 'reverse-words',
    title: 'Перевернуть порядок слов',
    category: 'Strings',
    difficulty: 'easy',
    companies: ['Microsoft', 'VK', 'Frontend'],
    successRate: 70,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка из слов, разделённых пробелами. Верните строку, в которой слова идут в обратном порядке и разделены ровно одним пробелом.',
    constraints: [
      'в строке могут быть ведущие, хвостовые и повторяющиеся пробелы — их нужно убрать',
      'слова внутри не переворачиваются',
      'результат не должен содержать лишних пробелов',
    ],
    examples: [
      {
        input: "solution('the sky is blue')",
        output: "'blue is sky the'",
      },
      {
        input: "solution('  hello world  ')",
        output: "'world hello'",
      },
    ],
    starterCode: {
      javascript: jsStarter('s', "  // ваш код\n  return ''"),
      typescript: jsStarter('s', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'обычное предложение',
        input: "'the sky is blue'",
        expected: "'blue is sky the'",
        assertion: "assertDeepEqual(candidate('the sky is blue'), 'blue is sky the')",
      },
      {
        title: 'пробелы по краям',
        input: "'  hello world  '",
        expected: "'world hello'",
        assertion: "assertDeepEqual(candidate('  hello world  '), 'world hello')",
      },
      {
        title: 'несколько пробелов между словами',
        input: "'a good   example'",
        expected: "'example good a'",
        assertion: "assertDeepEqual(candidate('a good   example'), 'example good a')",
      },
      {
        title: 'одно слово',
        input: "'hello'",
        expected: "'hello'",
        assertion: "assertDeepEqual(candidate('hello'), 'hello')",
      },
    ],
    solutionNotes: [
      'trim() уберёт пробелы по краям.',
      'split(/\\s+/) разобьёт по любому количеству пробелов.',
      'Останется reverse() и join(" ").',
    ],
  },
  {
    id: 'lc-run-length-encoding',
    slug: 'run-length-encoding',
    title: 'Сжатие строки (RLE)',
    category: 'Strings',
    difficulty: 'medium',
    companies: ['Amazon', 'Ozon', 'Frontend'],
    successRate: 58,
    estimatedMinutes: 18,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте простое сжатие строки: каждая серия одинаковых символов заменяется на символ и длину серии. Если символ встречается один раз, цифра не пишется.',
    constraints: [
      'строка состоит из латинских букв',
      'серии длиной 1 записываются без числа',
      'серии могут быть длиннее 9 символов — число может быть многозначным',
    ],
    examples: [
      {
        input: "solution('aaabbc')",
        output: "'a3b2c'",
      },
      {
        input: "solution('abcd')",
        output: "'abcd'",
      },
    ],
    starterCode: {
      javascript: jsStarter('s', "  // ваш код\n  return ''"),
      typescript: jsStarter('s', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'серии и одиночные символы',
        input: "'aaabbc'",
        expected: "'a3b2c'",
        assertion: "assertDeepEqual(candidate('aaabbc'), 'a3b2c')",
      },
      {
        title: 'без повторов строка не меняется',
        input: "'abcd'",
        expected: "'abcd'",
        assertion: "assertDeepEqual(candidate('abcd'), 'abcd')",
      },
      {
        title: 'длинная серия с двузначным счётчиком',
        input: "'aaaaaaaaaaab'",
        expected: "'a11b'",
        assertion: "assertDeepEqual(candidate('aaaaaaaaaaab'), 'a11b')",
      },
      {
        title: 'пустая строка',
        input: "''",
        expected: "''",
        assertion: "assertDeepEqual(candidate(''), '')",
      },
    ],
    solutionNotes: [
      'Идите по строке и считайте длину текущей серии.',
      'Когда символ меняется — допишите серию в результат и сбросьте счётчик.',
      'Не забудьте дописать последнюю серию после цикла.',
    ],
  },
  {
    id: 'lc-longest-palindromic-substring',
    slug: 'longest-palindromic-substring',
    title: 'Самый длинный палиндром в строке',
    category: 'Strings',
    difficulty: 'medium',
    companies: ['Amazon', 'Yandex', 'Google'],
    successRate: 41,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка. Найдите самую длинную подстроку, которая является палиндромом. Если таких подстрок несколько, верните ту, что начинается раньше.',
    constraints: [
      'строка непустая',
      'при нескольких ответах одинаковой длины верните первый по позиции в строке',
      'ожидаемая сложность O(n²) с расширением от центра',
    ],
    examples: [
      {
        input: "solution('babad')",
        output: "'bab'",
        explanation: "'aba' тоже палиндром длины 3, но 'bab' начинается раньше.",
      },
    ],
    starterCode: {
      javascript: jsStarter('s', "  // ваш код\n  return ''"),
      typescript: jsStarter('s', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'нечётный палиндром',
        input: "'babad'",
        expected: "'bab'",
        assertion: "assertDeepEqual(candidate('babad'), 'bab')",
      },
      {
        title: 'чётный палиндром',
        input: "'cbbd'",
        expected: "'bb'",
        assertion: "assertDeepEqual(candidate('cbbd'), 'bb')",
      },
      {
        title: 'один символ',
        input: "'a'",
        expected: "'a'",
        assertion: "assertDeepEqual(candidate('a'), 'a')",
      },
      {
        title: 'длинный палиндром в середине',
        input: "'forgeeksskeegfor'",
        expected: "'geeksskeeg'",
        assertion: "assertDeepEqual(candidate('forgeeksskeegfor'), 'geeksskeeg')",
      },
    ],
    solutionNotes: [
      'Для каждой позиции расширяйте палиндром от центра: отдельно для нечётной (i, i) и чётной (i, i + 1) длины.',
      'Запоминайте границы лучшего палиндрома, обновляя только при строгом увеличении длины — так выигрывает первый.',
      'В конце верните slice по сохранённым границам.',
    ],
  },
  {
    id: 'lc-array-intersection',
    slug: 'array-intersection',
    title: 'Пересечение массивов',
    category: 'Arrays',
    difficulty: 'easy',
    companies: ['Frontend', 'VK', 'Avito'],
    successRate: 73,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Даны два массива чисел. Верните отсортированный по возрастанию массив уникальных значений, которые встречаются в обоих массивах.',
    constraints: [
      'каждый элемент результата должен встречаться один раз',
      'результат отсортирован по возрастанию',
      'исходные массивы нельзя мутировать',
    ],
    examples: [
      {
        input: 'solution([4, 9, 5], [9, 4, 9, 8, 4])',
        output: '[4, 9]',
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return []'),
      typescript: jsStarter('a, b', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'дубликаты схлопываются',
        input: '[1, 2, 2, 1], [2, 2]',
        expected: '[2]',
        assertion: 'assertDeepEqual(candidate([1, 2, 2, 1], [2, 2]), [2])',
      },
      {
        title: 'результат отсортирован',
        input: '[4, 9, 5], [9, 4, 9, 8, 4]',
        expected: '[4, 9]',
        assertion: 'assertDeepEqual(candidate([4, 9, 5], [9, 4, 9, 8, 4]), [4, 9])',
      },
      {
        title: 'нет общих элементов',
        input: '[1, 2], [3, 4]',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([1, 2], [3, 4]), [])',
      },
    ],
    solutionNotes: [
      'Сложите первый массив в Set.',
      'Пройдите по второму и собирайте элементы, которые есть в Set, удаляя их, чтобы не задвоить.',
      'Отсортируйте результат: sort((x, y) => x - y).',
    ],
  },
  {
    id: 'lc-spiral-matrix',
    slug: 'spiral-matrix',
    title: 'Обход матрицы по спирали',
    category: 'Arrays',
    difficulty: 'medium',
    companies: ['Microsoft', 'Yandex', 'Tinkoff'],
    successRate: 44,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дана матрица m × n. Верните все её элементы одним массивом, обходя матрицу по спирали по часовой стрелке, начиная с левого верхнего угла.',
    constraints: [
      'матрица может быть прямоугольной (m ≠ n)',
      'матрица может состоять из одной строки или одного столбца',
      'исходную матрицу нельзя мутировать',
    ],
    examples: [
      {
        input: 'solution([[1, 2, 3], [4, 5, 6], [7, 8, 9]])',
        output: '[1, 2, 3, 6, 9, 8, 7, 4, 5]',
      },
    ],
    starterCode: {
      javascript: jsStarter('matrix', '  // ваш код\n  return []'),
      typescript: jsStarter('matrix', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'квадратная матрица 3×3',
        input: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
        expected: '[1, 2, 3, 6, 9, 8, 7, 4, 5]',
        assertion:
          'assertDeepEqual(candidate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5])',
      },
      {
        title: 'прямоугольная матрица 3×4',
        input: '[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]',
        expected: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]',
        assertion:
          'assertDeepEqual(candidate([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7])',
      },
      {
        title: 'один столбец',
        input: '[[1], [2], [3]]',
        expected: '[1, 2, 3]',
        assertion: 'assertDeepEqual(candidate([[1], [2], [3]]), [1, 2, 3])',
      },
      {
        title: 'одна ячейка',
        input: '[[1]]',
        expected: '[1]',
        assertion: 'assertDeepEqual(candidate([[1]]), [1])',
      },
    ],
    solutionNotes: [
      'Держите четыре границы: top, bottom, left, right.',
      'Обходите слой за слоем: верхняя строка → правый столбец → нижняя строка → левый столбец, сужая границы.',
      'Перед обходом нижней строки и левого столбца проверяйте, что границы ещё не пересеклись.',
    ],
  },
  {
    id: 'lc-pick-keys',
    slug: 'pick-keys',
    title: 'Реализовать pick',
    category: 'Objects',
    difficulty: 'easy',
    companies: ['Lodash', 'Frontend', 'VK'],
    successRate: 76,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию pick(obj, keys): она возвращает новый объект только с перечисленными ключами. Ключи, которых нет в исходном объекте, пропускаются.',
    constraints: [
      'исходный объект нельзя мутировать',
      'отсутствующие в объекте ключи не попадают в результат',
      'пустой список ключей даёт пустой объект',
    ],
    examples: [
      {
        input: "solution({ a: 1, b: 2, c: 3 }, ['a', 'c'])",
        output: '{ a: 1, c: 3 }',
      },
    ],
    starterCode: {
      javascript: jsStarter('obj, keys', '  // ваш код\n  return {}'),
      typescript: jsStarter('obj, keys', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'выбирает указанные ключи',
        input: "{ a: 1, b: 2, c: 3 }, ['a', 'c']",
        expected: '{ a: 1, c: 3 }',
        assertion:
          "assertDeepEqual(candidate({ a: 1, b: 2, c: 3 }, ['a', 'c']), { a: 1, c: 3 })",
      },
      {
        title: 'пропускает отсутствующие ключи',
        input: "{ a: 1 }, ['a', 'x']",
        expected: '{ a: 1 }',
        assertion: "assertDeepEqual(candidate({ a: 1 }, ['a', 'x']), { a: 1 })",
      },
      {
        title: 'пустой список ключей',
        input: '{ a: 1 }, []',
        expected: '{}',
        assertion: 'assertDeepEqual(candidate({ a: 1 }, []), {})',
      },
      {
        title: 'не мутирует исходный объект',
        input: "{ a: 1, b: 2 }, ['a']",
        expected: 'исходный объект не изменился',
        assertion:
          "const source = { a: 1, b: 2 }; candidate(source, ['a']); assertDeepEqual(source, { a: 1, b: 2 })",
      },
    ],
    solutionNotes: [
      'Пройдите по keys и копируйте только существующие свойства.',
      'Проверка наличия: key in obj или Object.hasOwn(obj, key).',
      'Значение undefined у существующего ключа — тонкий момент: in отличит его от отсутствующего.',
    ],
  },
  {
    id: 'lc-invert-object',
    slug: 'invert-object',
    title: 'Инвертировать объект',
    category: 'Objects',
    difficulty: 'easy',
    companies: ['Lodash', 'Frontend'],
    successRate: 74,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию invert(obj): ключи становятся значениями, а значения — ключами. Если несколько ключей имеют одинаковое значение, побеждает последний.',
    constraints: [
      'значения исходного объекта — строки или числа',
      'при совпадении значений в результат попадает последний ключ',
      'исходный объект нельзя мутировать',
    ],
    examples: [
      {
        input: "solution({ a: 'x', b: 'y' })",
        output: "{ x: 'a', y: 'b' }",
      },
    ],
    starterCode: {
      javascript: jsStarter('obj', '  // ваш код\n  return {}'),
      typescript: jsStarter('obj', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'меняет ключи и значения местами',
        input: "{ a: 'x', b: 'y' }",
        expected: "{ x: 'a', y: 'b' }",
        assertion:
          "assertDeepEqual(candidate({ a: 'x', b: 'y' }), { x: 'a', y: 'b' })",
      },
      {
        title: 'числовые значения становятся строковыми ключами',
        input: '{ one: 1, two: 2 }',
        expected: "{ '1': 'one', '2': 'two' }",
        assertion:
          "assertDeepEqual(candidate({ one: 1, two: 2 }), { 1: 'one', 2: 'two' })",
      },
      {
        title: 'при дубликатах побеждает последний ключ',
        input: "{ a: 'x', b: 'x' }",
        expected: "{ x: 'b' }",
        assertion: "assertDeepEqual(candidate({ a: 'x', b: 'x' }), { x: 'b' })",
      },
      {
        title: 'пустой объект',
        input: '{}',
        expected: '{}',
        assertion: 'assertDeepEqual(candidate({}), {})',
      },
    ],
    solutionNotes: [
      'Object.entries даст пары [ключ, значение].',
      'Соберите новый объект, записывая result[value] = key.',
      'Порядок обхода entries гарантирует, что последний ключ перезапишет предыдущие.',
    ],
  },
  {
    id: 'lc-get-path',
    slug: 'get-path',
    title: 'Реализовать get по пути',
    category: 'Objects',
    difficulty: 'medium',
    companies: ['Lodash', 'Yandex', 'Frontend'],
    successRate: 54,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию get(obj, path, defaultValue): она возвращает значение по строковому пути вида "a.b[0].c". Если путь обрывается (undefined или null по дороге), верните defaultValue.',
    constraints: [
      'путь состоит из ключей через точку и индексов в квадратных скобках',
      'если значение по пути undefined — верните defaultValue',
      'defaultValue может быть не передан — тогда верните undefined',
    ],
    examples: [
      {
        input: "solution({ a: { b: [{ c: 3 }] } }, 'a.b[0].c')",
        output: '3',
      },
      {
        input: "solution({}, 'a.b', 'нет')",
        output: "'нет'",
      },
    ],
    starterCode: {
      javascript: jsStarter('obj, path, defaultValue', '  // ваш код\n  return defaultValue'),
      typescript: jsStarter('obj, path, defaultValue', '  // ваш код\n  return defaultValue'),
    },
    tests: [
      {
        title: 'простой путь через точки',
        input: "{ a: { b: { c: 3 } } }, 'a.b.c'",
        expected: '3',
        assertion: "assertDeepEqual(candidate({ a: { b: { c: 3 } } }, 'a.b.c'), 3)",
      },
      {
        title: 'путь с индексом массива',
        input: "{ a: [{ b: 1 }] }, 'a[0].b'",
        expected: '1',
        assertion: "assertDeepEqual(candidate({ a: [{ b: 1 }] }, 'a[0].b'), 1)",
      },
      {
        title: 'обрыв пути возвращает defaultValue',
        input: "{}, 'a.b', 'нет'",
        expected: "'нет'",
        assertion: "assertDeepEqual(candidate({}, 'a.b', 'нет'), 'нет')",
      },
      {
        title: 'null в середине пути',
        input: "{ a: null }, 'a.b', 0",
        expected: '0',
        assertion: "assertDeepEqual(candidate({ a: null }, 'a.b', 0), 0)",
      },
      {
        title: 'существующее значение важнее defaultValue',
        input: "{ a: { b: false } }, 'a.b', true",
        expected: 'false',
        assertion: "assertDeepEqual(candidate({ a: { b: false } }, 'a.b', true), false)",
      },
    ],
    solutionNotes: [
      'Нормализуйте путь: замените [0] на .0 (replace(/\\[(\\d+)\\]/g, ".$1")) и разбейте по точке.',
      'Идите по сегментам, пока текущее значение не null/undefined.',
      'Верните defaultValue только если итог undefined — false и 0 являются валидными значениями.',
    ],
  },
  {
    id: 'lc-deep-merge',
    slug: 'deep-merge',
    title: 'Глубокое слияние объектов',
    category: 'Objects',
    difficulty: 'hard',
    companies: ['Lodash', 'Sber', 'Frontend'],
    successRate: 38,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию deepMerge(target, source): она рекурсивно сливает два объекта в новый. Вложенные объекты объединяются, скалярные значения и массивы из source перезаписывают значения из target.',
    constraints: [
      'исходные объекты нельзя мутировать',
      'массивы не сливаются поэлементно, а заменяются целиком',
      'при конфликте скаляров побеждает source',
    ],
    examples: [
      {
        input: 'solution({ a: { x: 1 }, b: 1 }, { a: { y: 2 }, c: 3 })',
        output: '{ a: { x: 1, y: 2 }, b: 1, c: 3 }',
      },
    ],
    starterCode: {
      javascript: jsStarter('target, source', '  // ваш код\n  return {}'),
      typescript: jsStarter('target, source', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'вложенные объекты объединяются',
        input: '{ a: { x: 1 }, b: 1 }, { a: { y: 2 }, c: 3 }',
        expected: '{ a: { x: 1, y: 2 }, b: 1, c: 3 }',
        assertion:
          'assertDeepEqual(candidate({ a: { x: 1 }, b: 1 }, { a: { y: 2 }, c: 3 }), { a: { x: 1, y: 2 }, b: 1, c: 3 })',
      },
      {
        title: 'при конфликте скаляров побеждает source',
        input: '{ a: 1 }, { a: 2 }',
        expected: '{ a: 2 }',
        assertion: 'assertDeepEqual(candidate({ a: 1 }, { a: 2 }), { a: 2 })',
      },
      {
        title: 'массивы заменяются целиком',
        input: '{ list: [1, 2] }, { list: [3] }',
        expected: '{ list: [3] }',
        assertion:
          'assertDeepEqual(candidate({ list: [1, 2] }, { list: [3] }), { list: [3] })',
      },
      {
        title: 'глубокая вложенность',
        input: '{ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } }',
        expected: '{ a: { b: { c: 1, d: 2 } } }',
        assertion:
          'assertDeepEqual(candidate({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } }), { a: { b: { c: 1, d: 2 } } })',
      },
      {
        title: 'не мутирует аргументы',
        input: '{ a: { x: 1 } }, { a: { y: 2 } }',
        expected: 'target остался прежним',
        assertion:
          'const target = { a: { x: 1 } }; candidate(target, { a: { y: 2 } }); assertDeepEqual(target, { a: { x: 1 } })',
      },
    ],
    solutionNotes: [
      'Проверяйте «оба значения — плоские объекты» перед рекурсией: typeof x === "object", не null и не Array.isArray.',
      'Начните с копии target, затем накладывайте ключи source.',
      'Копируйте вложенные структуры, а не переиспользуйте ссылки — иначе мутации просочатся в исходники.',
    ],
  },
  {
    id: 'lc-build-query',
    slug: 'build-query',
    title: 'Собрать query string',
    category: 'Parsing & Formatting',
    difficulty: 'easy',
    companies: ['Frontend', 'VK', 'Avito'],
    successRate: 72,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию buildQuery(params): она превращает объект параметров в query string. Значения кодируются через encodeURIComponent, пары с null и undefined пропускаются, массивы превращаются в повторяющиеся ключи.',
    constraints: [
      'порядок пар соответствует порядку ключей в объекте',
      'null и undefined не попадают в результат',
      'массив значений даёт несколько пар с одним ключом',
    ],
    examples: [
      {
        input: 'solution({ page: 2, limit: 10 })',
        output: "'page=2&limit=10'",
      },
      {
        input: "solution({ tag: ['js', 'css'] })",
        output: "'tag=js&tag=css'",
      },
    ],
    starterCode: {
      javascript: jsStarter('params', "  // ваш код\n  return ''"),
      typescript: jsStarter('params', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'простые параметры',
        input: '{ page: 2, limit: 10 }',
        expected: "'page=2&limit=10'",
        assertion: "assertDeepEqual(candidate({ page: 2, limit: 10 }), 'page=2&limit=10')",
      },
      {
        title: 'кодирует спецсимволы',
        input: "{ q: 'hello world' }",
        expected: "'q=hello%20world'",
        assertion: "assertDeepEqual(candidate({ q: 'hello world' }), 'q=hello%20world')",
      },
      {
        title: 'пропускает null и undefined',
        input: '{ a: 1, b: null, c: undefined }',
        expected: "'a=1'",
        assertion: "assertDeepEqual(candidate({ a: 1, b: null, c: undefined }), 'a=1')",
      },
      {
        title: 'массив значений',
        input: "{ tag: ['js', 'css'] }",
        expected: "'tag=js&tag=css'",
        assertion: "assertDeepEqual(candidate({ tag: ['js', 'css'] }), 'tag=js&tag=css')",
      },
      {
        title: 'пустой объект',
        input: '{}',
        expected: "''",
        assertion: "assertDeepEqual(candidate({}), '')",
      },
    ],
    solutionNotes: [
      'Соберите массив пар "ключ=значение" и склейте через &.',
      'Для массива значений добавляйте пару для каждого элемента.',
      'Не забудьте encodeURIComponent и для ключа, и для значения.',
    ],
  },
  {
    id: 'lc-hex-to-rgb',
    slug: 'hex-to-rgb',
    title: 'HEX в RGB',
    category: 'Parsing & Formatting',
    difficulty: 'easy',
    companies: ['Frontend', 'Codewars'],
    successRate: 70,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию hexToRgb(hex): она преобразует CSS-цвет вида #1e90ff или #abc в объект { r, g, b } с числами от 0 до 255. Короткая форма #abc раскрывается в #aabbcc.',
    constraints: [
      'на вход приходит валидный цвет с решёткой: #rgb или #rrggbb',
      'буквы могут быть в любом регистре',
      'верните объект { r, g, b } с числами',
    ],
    examples: [
      {
        input: "solution('#1e90ff')",
        output: '{ r: 30, g: 144, b: 255 }',
      },
      {
        input: "solution('#abc')",
        output: '{ r: 170, g: 187, b: 204 }',
      },
    ],
    starterCode: {
      javascript: jsStarter('hex', '  // ваш код\n  return { r: 0, g: 0, b: 0 }'),
      typescript: jsStarter('hex', '  // ваш код\n  return { r: 0, g: 0, b: 0 }'),
    },
    tests: [
      {
        title: 'полная форма',
        input: "'#1e90ff'",
        expected: '{ r: 30, g: 144, b: 255 }',
        assertion: "assertDeepEqual(candidate('#1e90ff'), { r: 30, g: 144, b: 255 })",
      },
      {
        title: 'белый цвет',
        input: "'#ffffff'",
        expected: '{ r: 255, g: 255, b: 255 }',
        assertion: "assertDeepEqual(candidate('#ffffff'), { r: 255, g: 255, b: 255 })",
      },
      {
        title: 'короткая форма',
        input: "'#abc'",
        expected: '{ r: 170, g: 187, b: 204 }',
        assertion: "assertDeepEqual(candidate('#abc'), { r: 170, g: 187, b: 204 })",
      },
      {
        title: 'верхний регистр',
        input: "'#FFA500'",
        expected: '{ r: 255, g: 165, b: 0 }',
        assertion: "assertDeepEqual(candidate('#FFA500'), { r: 255, g: 165, b: 0 })",
      },
    ],
    solutionNotes: [
      'Уберите решётку и приведите к нижнему регистру.',
      'Короткую форму раскройте, удвоив каждый символ.',
      'parseInt(pair, 16) переводит пару hex-цифр в число.',
    ],
  },
  {
    id: 'lc-escape-html',
    slug: 'escape-html',
    title: 'Экранировать HTML',
    category: 'Parsing & Formatting',
    difficulty: 'easy',
    companies: ['Frontend', 'Yandex', 'VK'],
    successRate: 69,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию escapeHtml(s): она заменяет опасные символы на HTML-сущности: & на &amp;, < на &lt;, > на &gt;, " на &quot;, одинарную кавычку на &#39;. Такая функция защищает вывод пользовательского текста от XSS.',
    constraints: [
      'амперсанд экранируйте первым, иначе сломаете уже добавленные сущности',
      'остальные символы строки не меняются',
      'пустая строка возвращается как есть',
    ],
    examples: [
      {
        input: "solution('<b>Tom & Jerry</b>')",
        output: "'&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;'",
      },
    ],
    starterCode: {
      javascript: jsStarter('s', "  // ваш код\n  return ''"),
      typescript: jsStarter('s', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'теги и амперсанд',
        input: "'<b>Tom & Jerry</b>'",
        expected: "'&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;'",
        assertion:
          "assertDeepEqual(candidate('<b>Tom & Jerry</b>'), '&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;')",
      },
      {
        title: 'двойные кавычки',
        input: '\'<div class="a">\'',
        expected: "'&lt;div class=&quot;a&quot;&gt;'",
        assertion:
          "assertDeepEqual(candidate('<div class=\"a\">'), '&lt;div class=&quot;a&quot;&gt;')",
      },
      {
        title: 'одинарные кавычки',
        input: '"it\'s"',
        expected: "'it&#39;s'",
        assertion: 'assertDeepEqual(candidate("it\'s"), \'it&#39;s\')',
      },
      {
        title: 'строка без спецсимволов',
        input: "'plain text'",
        expected: "'plain text'",
        assertion: "assertDeepEqual(candidate('plain text'), 'plain text')",
      },
    ],
    solutionNotes: [
      'Серия replaceAll в правильном порядке: сначала &, потом остальные.',
      'Альтернатива — один replace с регуляркой /[&<>"\']/g и таблицей замен.',
      'Именно так работают функции escape в шаблонизаторах.',
    ],
  },
  {
    id: 'lc-parse-cookie',
    slug: 'parse-cookie',
    title: 'Разобрать строку cookie',
    category: 'Parsing & Formatting',
    difficulty: 'easy',
    companies: ['Frontend', 'Sber'],
    successRate: 71,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию parseCookie(str): она разбирает строку document.cookie вида "theme=dark; token=abc123" в объект { theme: "dark", token: "abc123" }. Значения декодируются через decodeURIComponent.',
    constraints: [
      'пары разделены точкой с запятой и пробелом, но пробелы вокруг пар могут быть лишними',
      'значение может содержать символ = — делите только по первому',
      'пустая строка даёт пустой объект',
    ],
    examples: [
      {
        input: "solution('theme=dark; token=abc123')",
        output: "{ theme: 'dark', token: 'abc123' }",
      },
    ],
    starterCode: {
      javascript: jsStarter('str', '  // ваш код\n  return {}'),
      typescript: jsStarter('str', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'несколько пар',
        input: "'theme=dark; token=abc123'",
        expected: "{ theme: 'dark', token: 'abc123' }",
        assertion:
          "assertDeepEqual(candidate('theme=dark; token=abc123'), { theme: 'dark', token: 'abc123' })",
      },
      {
        title: 'декодирует значения',
        input: "'q=a%20b'",
        expected: "{ q: 'a b' }",
        assertion: "assertDeepEqual(candidate('q=a%20b'), { q: 'a b' })",
      },
      {
        title: 'знак равенства внутри значения',
        input: "'a=b=c'",
        expected: "{ a: 'b=c' }",
        assertion: "assertDeepEqual(candidate('a=b=c'), { a: 'b=c' })",
      },
      {
        title: 'пустая строка',
        input: "''",
        expected: '{}',
        assertion: "assertDeepEqual(candidate(''), {})",
      },
    ],
    solutionNotes: [
      'split(";") и trim каждой пары.',
      'Делите пару по первому знаку =: indexOf и slice.',
      'Не забудьте decodeURIComponent для значения.',
    ],
  },
  {
    id: 'lc-format-bytes',
    slug: 'format-bytes',
    title: 'Форматировать размер файла',
    category: 'Parsing & Formatting',
    difficulty: 'easy',
    companies: ['Frontend', 'Ozon'],
    successRate: 68,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию formatBytes(bytes): она переводит число байт в человекочитаемую строку с единицами B, KB, MB, GB (множитель 1024). Результат округляется до одного знака после запятой, целые значения выводятся без десятичной части.',
    constraints: [
      'bytes — неотрицательное целое число',
      'единица измерения отделена пробелом: "1.5 KB"',
      'у целых значений нет ".0": "1 KB", а не "1.0 KB"',
    ],
    examples: [
      {
        input: 'solution(1536)',
        output: "'1.5 KB'",
      },
      {
        input: 'solution(512)',
        output: "'512 B'",
      },
    ],
    starterCode: {
      javascript: jsStarter('bytes', "  // ваш код\n  return ''"),
      typescript: jsStarter('bytes', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'байты без перевода',
        input: '512',
        expected: "'512 B'",
        assertion: "assertDeepEqual(candidate(512), '512 B')",
      },
      {
        title: 'ровно один килобайт',
        input: '1024',
        expected: "'1 KB'",
        assertion: "assertDeepEqual(candidate(1024), '1 KB')",
      },
      {
        title: 'дробное значение',
        input: '1536',
        expected: "'1.5 KB'",
        assertion: "assertDeepEqual(candidate(1536), '1.5 KB')",
      },
      {
        title: 'мегабайты и гигабайты',
        input: '1048576 и 2684354560',
        expected: "'1 MB' и '2.5 GB'",
        assertion:
          "assertDeepEqual(candidate(1048576), '1 MB'); assertDeepEqual(candidate(2684354560), '2.5 GB')",
      },
      {
        title: 'ноль байт',
        input: '0',
        expected: "'0 B'",
        assertion: "assertDeepEqual(candidate(0), '0 B')",
      },
    ],
    solutionNotes: [
      'Делите на 1024, пока значение не станет меньше 1024, и двигайтесь по массиву единиц.',
      'Округление: Math.round(value * 10) / 10.',
      'Целое значение легко проверить через value % 1 === 0.',
    ],
  },
  {
    id: 'lc-template-render',
    slug: 'template-render',
    title: 'Мини-шаблонизатор',
    category: 'Parsing & Formatting',
    difficulty: 'medium',
    companies: ['Frontend', 'Yandex', 'Tinkoff'],
    successRate: 53,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию render(template, data): она подставляет значения из data вместо плейсхолдеров вида {{name}}. Пробелы внутри скобок допустимы: {{ name }}. Если ключа нет в data, плейсхолдер заменяется пустой строкой.',
    constraints: [
      'имя плейсхолдера — последовательность букв, цифр и подчёркиваний',
      'плейсхолдер может встречаться несколько раз',
      'отсутствующий ключ заменяется на пустую строку',
    ],
    examples: [
      {
        input: "solution('Привет, {{name}}!', { name: 'Иван' })",
        output: "'Привет, Иван!'",
      },
    ],
    starterCode: {
      javascript: jsStarter('template, data', "  // ваш код\n  return ''"),
      typescript: jsStarter('template, data', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'простая подстановка',
        input: "'Привет, {{name}}!', { name: 'Иван' }",
        expected: "'Привет, Иван!'",
        assertion:
          "assertDeepEqual(candidate('Привет, {{name}}!', { name: 'Иван' }), 'Привет, Иван!')",
      },
      {
        title: 'пробелы внутри скобок',
        input: "'{{ a }} + {{ b }}', { a: 1, b: 2 }",
        expected: "'1 + 2'",
        assertion: "assertDeepEqual(candidate('{{ a }} + {{ b }}', { a: 1, b: 2 }), '1 + 2')",
      },
      {
        title: 'отсутствующий ключ',
        input: "'Hi {{user}}!', {}",
        expected: "'Hi !'",
        assertion: "assertDeepEqual(candidate('Hi {{user}}!', {}), 'Hi !')",
      },
      {
        title: 'повторяющийся плейсхолдер',
        input: "'{{x}}-{{x}}', { x: 'a' }",
        expected: "'a-a'",
        assertion: "assertDeepEqual(candidate('{{x}}-{{x}}', { x: 'a' }), 'a-a')",
      },
    ],
    solutionNotes: [
      'Одна регулярка решает задачу: /\\{\\{\\s*(\\w+)\\s*\\}\\}/g.',
      'replace с функцией-заменителем подставит значение по имени группы.',
      'Для отсутствующего ключа верните "" — проверьте через in или ?? "".',
    ],
  },
  {
    id: 'lc-is-prime',
    slug: 'is-prime',
    title: 'Проверка на простое число',
    category: 'Algorithms',
    difficulty: 'easy',
    companies: ['Codewars', 'Frontend'],
    successRate: 75,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дано целое число. Верните true, если оно простое (делится только на 1 и на себя), иначе false. Числа меньше 2 простыми не считаются.',
    constraints: [
      'число может быть достаточно большим — наивный перебор до n не пройдёт по времени',
      'проверяйте делители только до квадратного корня',
      '0, 1 и отрицательные числа — не простые',
    ],
    examples: [
      {
        input: 'solution(17)',
        output: 'true',
      },
      {
        input: 'solution(100)',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return false'),
      typescript: jsStarter('n', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'простые числа',
        input: '2, 17, 97',
        expected: 'true для всех',
        assertion:
          'assertDeepEqual(candidate(2), true); assertDeepEqual(candidate(17), true); assertDeepEqual(candidate(97), true)',
      },
      {
        title: 'составные числа',
        input: '100, 21',
        expected: 'false для всех',
        assertion:
          'assertDeepEqual(candidate(100), false); assertDeepEqual(candidate(21), false)',
      },
      {
        title: 'граничные случаи',
        input: '0, 1',
        expected: 'false для всех',
        assertion:
          'assertDeepEqual(candidate(0), false); assertDeepEqual(candidate(1), false)',
      },
      {
        title: 'большое простое число',
        input: '7919',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate(7919), true)',
      },
    ],
    solutionNotes: [
      'Сразу отсеките n < 2.',
      'Проверяйте делители от 2 до Math.sqrt(n) включительно.',
      'Оптимизация: проверьте 2 отдельно и дальше идите только по нечётным.',
    ],
  },
  {
    id: 'lc-gcd',
    slug: 'gcd',
    title: 'Наибольший общий делитель',
    category: 'Algorithms',
    difficulty: 'easy',
    companies: ['Codewars', 'Sber'],
    successRate: 72,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Даны два неотрицательных целых числа. Найдите их наибольший общий делитель (НОД) с помощью алгоритма Евклида.',
    constraints: [
      'хотя бы одно из чисел больше нуля',
      'gcd(0, x) равен x',
      'ожидаемая сложность O(log(min(a, b)))',
    ],
    examples: [
      {
        input: 'solution(12, 18)',
        output: '6',
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return 0'),
      typescript: jsStarter('a, b', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'обычный случай',
        input: '12, 18',
        expected: '6',
        assertion: 'assertDeepEqual(candidate(12, 18), 6)',
      },
      {
        title: 'взаимно простые числа',
        input: '7, 13',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(7, 13), 1)',
      },
      {
        title: 'ноль в аргументах',
        input: '0, 5',
        expected: '5',
        assertion: 'assertDeepEqual(candidate(0, 5), 5)',
      },
      {
        title: 'большие числа',
        input: '1071, 462',
        expected: '21',
        assertion: 'assertDeepEqual(candidate(1071, 462), 21)',
      },
    ],
    solutionNotes: [
      'Алгоритм Евклида: gcd(a, b) = gcd(b, a % b).',
      'База рекурсии: gcd(a, 0) = a.',
      'Итеративный вариант: while (b) { [a, b] = [b, a % b] }.',
    ],
  },
  {
    id: 'lc-pascal-triangle',
    slug: 'pascal-triangle',
    title: 'Треугольник Паскаля',
    category: 'Algorithms',
    difficulty: 'easy',
    companies: ['Neetcode', 'VK'],
    successRate: 68,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дано число n. Верните первые n строк треугольника Паскаля: каждая строка начинается и заканчивается единицей, а каждый внутренний элемент равен сумме двух элементов над ним.',
    constraints: [
      'n — неотрицательное целое число',
      'n = 0 даёт пустой массив',
      'результат — массив массивов чисел',
    ],
    examples: [
      {
        input: 'solution(5)',
        output: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return []'),
      typescript: jsStarter('n', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'пять строк',
        input: '5',
        expected: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]',
        assertion:
          'assertDeepEqual(candidate(5), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]])',
      },
      {
        title: 'одна строка',
        input: '1',
        expected: '[[1]]',
        assertion: 'assertDeepEqual(candidate(1), [[1]])',
      },
      {
        title: 'ноль строк',
        input: '0',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate(0), [])',
      },
    ],
    solutionNotes: [
      'Стройте каждую строку из предыдущей.',
      'row[j] = prev[j - 1] + prev[j], края — единицы.',
      'Аккуратно с границами: первая и последняя позиция каждой строки равны 1.',
    ],
  },
  {
    id: 'lc-merge-sort',
    slug: 'merge-sort',
    title: 'Сортировка слиянием',
    category: 'Algorithms',
    difficulty: 'medium',
    companies: ['Yandex', 'Sber', 'AlgoExpert'],
    successRate: 50,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте сортировку слиянием: функция принимает массив чисел и возвращает новый отсортированный по возрастанию массив. Использовать встроенный Array.prototype.sort нельзя.',
    constraints: [
      'нельзя использовать встроенный sort',
      'исходный массив нельзя мутировать',
      'ожидаемая сложность O(n log n)',
    ],
    examples: [
      {
        input: 'solution([5, 2, 8, 1, 9, 3])',
        output: '[1, 2, 3, 5, 8, 9]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return []'),
      typescript: jsStarter('nums', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'перемешанный массив',
        input: '[5, 2, 8, 1, 9, 3]',
        expected: '[1, 2, 3, 5, 8, 9]',
        assertion: 'assertDeepEqual(candidate([5, 2, 8, 1, 9, 3]), [1, 2, 3, 5, 8, 9])',
      },
      {
        title: 'отрицательные числа и дубликаты',
        input: '[3, -1, 0, 3, -5]',
        expected: '[-5, -1, 0, 3, 3]',
        assertion: 'assertDeepEqual(candidate([3, -1, 0, 3, -5]), [-5, -1, 0, 3, 3])',
      },
      {
        title: 'уже отсортированный массив',
        input: '[1, 2, 3]',
        expected: '[1, 2, 3]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3]), [1, 2, 3])',
      },
      {
        title: 'не мутирует исходный массив',
        input: '[3, 1, 2]',
        expected: 'исходный массив не изменился',
        assertion:
          'const source = [3, 1, 2]; candidate(source); assertDeepEqual(source, [3, 1, 2])',
      },
      {
        title: 'пустой массив и один элемент',
        input: '[] и [7]',
        expected: '[] и [7]',
        assertion:
          'assertDeepEqual(candidate([]), []); assertDeepEqual(candidate([7]), [7])',
      },
    ],
    solutionNotes: [
      'Делите массив пополам рекурсивно, пока не останется 0–1 элемент.',
      'Слияние: два указателя по отсортированным половинам, выбирайте меньший элемент.',
      'Не забудьте дописать остаток той половины, что не закончилась.',
    ],
  },
  {
    id: 'lc-count-primes',
    slug: 'count-primes',
    title: 'Количество простых чисел',
    category: 'Algorithms',
    difficulty: 'medium',
    companies: ['Amazon', 'Yandex'],
    successRate: 45,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дано число n. Верните количество простых чисел строго меньше n. Для больших n понадобится решето Эратосфена.',
    constraints: [
      'n может быть до 10⁶ — проверка каждого числа по отдельности слишком медленная',
      'считаются простые строго меньше n',
      'для n ≤ 2 ответ 0',
    ],
    examples: [
      {
        input: 'solution(10)',
        output: '4',
        explanation: 'Простые меньше 10: 2, 3, 5, 7.',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'базовый пример',
        input: '10',
        expected: '4',
        assertion: 'assertDeepEqual(candidate(10), 4)',
      },
      {
        title: 'граничные случаи',
        input: '0, 1, 2',
        expected: '0 для всех',
        assertion:
          'assertDeepEqual(candidate(0), 0); assertDeepEqual(candidate(1), 0); assertDeepEqual(candidate(2), 0)',
      },
      {
        title: 'сто',
        input: '100',
        expected: '25',
        assertion: 'assertDeepEqual(candidate(100), 25)',
      },
      {
        title: 'большое n',
        input: '100000',
        expected: '9592',
        assertion: 'assertDeepEqual(candidate(100000), 9592)',
      },
    ],
    solutionNotes: [
      'Решето Эратосфена: массив флагов длины n, изначально все «простые».',
      'Для каждого простого p вычёркивайте кратные, начиная с p * p.',
      'Внешний цикл достаточно вести до Math.sqrt(n).',
    ],
  },
  {
    id: 'lc-zip-arrays',
    slug: 'zip-arrays',
    title: 'Реализовать zip',
    category: 'Data transforms',
    difficulty: 'easy',
    companies: ['Lodash', 'Frontend'],
    successRate: 75,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию zip(a, b): она объединяет два массива в массив пар [a[i], b[i]]. Длина результата равна длине более короткого массива.',
    constraints: [
      'лишние элементы более длинного массива отбрасываются',
      'исходные массивы нельзя мутировать',
      'элементы могут быть любого типа',
    ],
    examples: [
      {
        input: "solution([1, 2, 3], ['a', 'b', 'c'])",
        output: "[[1, 'a'], [2, 'b'], [3, 'c']]",
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return []'),
      typescript: jsStarter('a, b', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'массивы одинаковой длины',
        input: "[1, 2, 3], ['a', 'b', 'c']",
        expected: "[[1, 'a'], [2, 'b'], [3, 'c']]",
        assertion:
          "assertDeepEqual(candidate([1, 2, 3], ['a', 'b', 'c']), [[1, 'a'], [2, 'b'], [3, 'c']])",
      },
      {
        title: 'разная длина — по короткому',
        input: "[1, 2, 3], ['a']",
        expected: "[[1, 'a']]",
        assertion: "assertDeepEqual(candidate([1, 2, 3], ['a']), [[1, 'a']])",
      },
      {
        title: 'пустой массив',
        input: '[], [1, 2]',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([], [1, 2]), [])',
      },
    ],
    solutionNotes: [
      'Длина результата: Math.min(a.length, b.length).',
      'Array.from({ length }, (_, i) => [a[i], b[i]]) делает всё в одну строку.',
      'Или обычный цикл до минимальной длины.',
    ],
  },
  {
    id: 'lc-count-by',
    slug: 'count-by',
    title: 'Реализовать countBy',
    category: 'Data transforms',
    difficulty: 'easy',
    companies: ['Lodash', 'Frontend', 'Avito'],
    successRate: 73,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию countBy(items, fn): она группирует элементы по результату fn(item) и возвращает объект, где ключ — результат функции, а значение — количество элементов с таким ключом.',
    constraints: [
      'fn применяется к каждому элементу ровно один раз',
      'ключи результата — строки (результат fn приводится к строке)',
      'пустой массив даёт пустой объект',
    ],
    examples: [
      {
        input: "solution(['apple', 'banana', 'avocado'], word => word[0])",
        output: '{ a: 2, b: 1 }',
      },
    ],
    starterCode: {
      javascript: jsStarter('items, fn', '  // ваш код\n  return {}'),
      typescript: jsStarter('items, fn', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'группировка по первой букве',
        input: "['apple', 'banana', 'avocado'], word => word[0]",
        expected: '{ a: 2, b: 1 }',
        assertion:
          "assertDeepEqual(candidate(['apple', 'banana', 'avocado'], (word) => word[0]), { a: 2, b: 1 })",
      },
      {
        title: 'группировка чисел через Math.floor',
        input: '[1.2, 2.4, 2.9], Math.floor',
        expected: "{ '1': 1, '2': 2 }",
        assertion:
          'assertDeepEqual(candidate([1.2, 2.4, 2.9], Math.floor), { 1: 1, 2: 2 })',
      },
      {
        title: 'пустой массив',
        input: '[], x => x',
        expected: '{}',
        assertion: 'assertDeepEqual(candidate([], (x) => x), {})',
      },
    ],
    solutionNotes: [
      'Аккумулируйте объект через reduce или цикл.',
      'result[key] = (result[key] ?? 0) + 1.',
      'Это countBy из lodash — родственник groupBy.',
    ],
  },
  {
    id: 'lc-key-by',
    slug: 'key-by',
    title: 'Реализовать keyBy',
    category: 'Data transforms',
    difficulty: 'easy',
    companies: ['Lodash', 'VK'],
    successRate: 74,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию keyBy(items, fn): она строит объект-индекс, где ключ — результат fn(item), а значение — сам элемент. При совпадении ключей побеждает последний элемент.',
    constraints: [
      'значением является сам элемент, а не его копия',
      'при дубликатах ключа в результат попадает последний элемент',
      'пустой массив даёт пустой объект',
    ],
    examples: [
      {
        input: "solution([{ id: 'a', v: 1 }, { id: 'b', v: 2 }], item => item.id)",
        output: "{ a: { id: 'a', v: 1 }, b: { id: 'b', v: 2 } }",
      },
    ],
    starterCode: {
      javascript: jsStarter('items, fn', '  // ваш код\n  return {}'),
      typescript: jsStarter('items, fn', '  // ваш код\n  return {}'),
    },
    tests: [
      {
        title: 'индекс по id',
        input: "[{ id: 'a', v: 1 }, { id: 'b', v: 2 }], item => item.id",
        expected: "{ a: { id: 'a', v: 1 }, b: { id: 'b', v: 2 } }",
        assertion:
          "assertDeepEqual(candidate([{ id: 'a', v: 1 }, { id: 'b', v: 2 }], (item) => item.id), { a: { id: 'a', v: 1 }, b: { id: 'b', v: 2 } })",
      },
      {
        title: 'при дубликатах побеждает последний',
        input: "[{ id: 'a', v: 1 }, { id: 'a', v: 2 }], item => item.id",
        expected: "{ a: { id: 'a', v: 2 } }",
        assertion:
          "assertDeepEqual(candidate([{ id: 'a', v: 1 }, { id: 'a', v: 2 }], (item) => item.id), { a: { id: 'a', v: 2 } })",
      },
      {
        title: 'пустой массив',
        input: '[], x => x',
        expected: '{}',
        assertion: 'assertDeepEqual(candidate([], (x) => x), {})',
      },
    ],
    solutionNotes: [
      'Один проход: result[fn(item)] = item.',
      'В отличие от groupBy здесь хранится один элемент, а не массив.',
      'Такой индекс превращает поиск по id из O(n) в O(1).',
    ],
  },
  {
    id: 'lc-unique-by',
    slug: 'unique-by',
    title: 'Реализовать uniqueBy',
    category: 'Data transforms',
    difficulty: 'medium',
    companies: ['Lodash', 'Ozon', 'Frontend'],
    successRate: 60,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте функцию uniqueBy(items, fn): она убирает дубликаты по ключу fn(item), оставляя первый встретившийся элемент. Порядок остальных элементов сохраняется.',
    constraints: [
      'из дубликатов остаётся первый по порядку',
      'порядок элементов в результате соответствует исходному',
      'исходный массив нельзя мутировать',
    ],
    examples: [
      {
        input: 'solution([{ id: 1 }, { id: 2 }, { id: 1 }], item => item.id)',
        output: '[{ id: 1 }, { id: 2 }]',
      },
    ],
    starterCode: {
      javascript: jsStarter('items, fn', '  // ваш код\n  return []'),
      typescript: jsStarter('items, fn', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'дубликаты по id',
        input: '[{ id: 1 }, { id: 2 }, { id: 1 }], item => item.id',
        expected: '[{ id: 1 }, { id: 2 }]',
        assertion:
          'assertDeepEqual(candidate([{ id: 1 }, { id: 2 }, { id: 1 }], (item) => item.id), [{ id: 1 }, { id: 2 }])',
      },
      {
        title: 'остаётся первый из дубликатов',
        input: '[1.1, 1.9, 2.5], Math.floor',
        expected: '[1.1, 2.5]',
        assertion: 'assertDeepEqual(candidate([1.1, 1.9, 2.5], Math.floor), [1.1, 2.5])',
      },
      {
        title: 'без дубликатов массив не меняется',
        input: '[1, 2, 3], x => x',
        expected: '[1, 2, 3]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3], (x) => x), [1, 2, 3])',
      },
      {
        title: 'пустой массив',
        input: '[], x => x',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([], (x) => x), [])',
      },
    ],
    solutionNotes: [
      'Set хранит уже встреченные ключи.',
      'filter: пропускайте элемент, если ключ уже в Set, иначе добавляйте ключ и оставляйте элемент.',
      'Map тоже подойдёт, если потом нужны и ключи, и элементы.',
    ],
  },
  {
    id: 'lc-tree-from-list',
    slug: 'tree-from-list',
    title: 'Дерево из плоского списка',
    category: 'Data transforms',
    difficulty: 'medium',
    companies: ['Yandex', 'Tinkoff', 'Frontend'],
    successRate: 47,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Дан плоский список узлов вида { id, parentId, name }, где parentId корневых узлов равен null. Соберите дерево: каждый узел превращается в { id, name, children }, children упорядочены по позиции в исходном списке. Верните массив корневых узлов.',
    constraints: [
      'порядок элементов в списке произвольный — ребёнок может идти раньше родителя',
      'каждый узел результата обязан иметь массив children (возможно пустой)',
      'корней может быть несколько',
    ],
    examples: [
      {
        input:
          "solution([{ id: 1, parentId: null, name: 'root' }, { id: 2, parentId: 1, name: 'a' }])",
        output: "[{ id: 1, name: 'root', children: [{ id: 2, name: 'a', children: [] }] }]",
      },
    ],
    starterCode: {
      javascript: jsStarter('list', '  // ваш код\n  return []'),
      typescript: jsStarter('list', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'двухуровневое дерево',
        input: 'root → a (с внуком a1) и b',
        expected: 'вложенная структура с children',
        assertion:
          "assertDeepEqual(candidate([{ id: 1, parentId: null, name: 'root' }, { id: 2, parentId: 1, name: 'a' }, { id: 3, parentId: 1, name: 'b' }, { id: 4, parentId: 2, name: 'a1' }]), [{ id: 1, name: 'root', children: [{ id: 2, name: 'a', children: [{ id: 4, name: 'a1', children: [] }] }, { id: 3, name: 'b', children: [] }] }])",
      },
      {
        title: 'ребёнок идёт раньше родителя',
        input: 'список в произвольном порядке',
        expected: 'дерево всё равно собирается',
        assertion:
          "assertDeepEqual(candidate([{ id: 2, parentId: 1, name: 'a' }, { id: 1, parentId: null, name: 'root' }]), [{ id: 1, name: 'root', children: [{ id: 2, name: 'a', children: [] }] }])",
      },
      {
        title: 'несколько корней',
        input: 'два узла с parentId: null',
        expected: 'массив из двух корней',
        assertion:
          "assertDeepEqual(candidate([{ id: 1, parentId: null, name: 'x' }, { id: 2, parentId: null, name: 'y' }]), [{ id: 1, name: 'x', children: [] }, { id: 2, name: 'y', children: [] }])",
      },
      {
        title: 'пустой список',
        input: '[]',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([]), [])',
      },
    ],
    solutionNotes: [
      'Два прохода: сначала создайте узлы { id, name, children: [] } и сложите в Map по id.',
      'Вторым проходом раскладывайте: parentId === null — в корни, иначе в children родителя из Map.',
      'Map гарантирует O(n) — без вложенных поисков родителя.',
    ],
  },
  {
    id: 'lc-flatten-tree',
    slug: 'flatten-tree',
    title: 'Плоский список из дерева',
    category: 'Data transforms',
    difficulty: 'medium',
    companies: ['Yandex', 'Frontend'],
    successRate: 52,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Обратная задача: дан массив корневых узлов дерева вида { id, name, children }. Разверните его в плоский список { id, name, parentId } в порядке обхода в глубину (DFS). parentId корней равен null.',
    constraints: [
      'порядок результата — обход в глубину: узел, затем его поддеревья',
      'у элементов результата нет поля children',
      'дерево может быть пустым',
    ],
    examples: [
      {
        input: "solution([{ id: 1, name: 'root', children: [{ id: 2, name: 'a', children: [] }] }])",
        output: "[{ id: 1, name: 'root', parentId: null }, { id: 2, name: 'a', parentId: 1 }]",
      },
    ],
    starterCode: {
      javascript: jsStarter('nodes', '  // ваш код\n  return []'),
      typescript: jsStarter('nodes', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'дерево с двумя уровнями',
        input: 'root → a (с внуком a1) и b',
        expected: 'DFS-порядок: root, a, a1, b',
        assertion:
          "assertDeepEqual(candidate([{ id: 1, name: 'root', children: [{ id: 2, name: 'a', children: [{ id: 4, name: 'a1', children: [] }] }, { id: 3, name: 'b', children: [] }] }]), [{ id: 1, name: 'root', parentId: null }, { id: 2, name: 'a', parentId: 1 }, { id: 4, name: 'a1', parentId: 2 }, { id: 3, name: 'b', parentId: 1 }])",
      },
      {
        title: 'несколько корней',
        input: 'два корня без детей',
        expected: 'оба с parentId: null',
        assertion:
          "assertDeepEqual(candidate([{ id: 1, name: 'x', children: [] }, { id: 2, name: 'y', children: [] }]), [{ id: 1, name: 'x', parentId: null }, { id: 2, name: 'y', parentId: null }])",
      },
      {
        title: 'пустое дерево',
        input: '[]',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([]), [])',
      },
    ],
    solutionNotes: [
      'Рекурсивный обход: функция visit(node, parentId) пушит запись и обходит children.',
      'parentId для детей — id текущего узла.',
      'Итеративный вариант — стек, но следите за порядком детей.',
    ],
  },
  {
    id: 'lc-ransom-note',
    slug: 'ransom-note',
    title: 'Записка из журнала',
    category: 'Arrays & Hashing',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon'],
    successRate: 72,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Даны строки note и magazine. Верните true, если записку note можно составить из букв журнала magazine. Каждую букву журнала можно использовать только один раз.',
    constraints: [
      'обе строки состоят из строчных латинских букв',
      'каждая буква журнала используется не более одного раза',
      'пустую записку можно составить всегда',
    ],
    examples: [
      {
        input: "solution('aa', 'aab')",
        output: 'true',
      },
      {
        input: "solution('aa', 'ab')",
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('note, magazine', '  // ваш код\n  return false'),
      typescript: jsStarter('note, magazine', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'букв хватает',
        input: "'aa', 'aab'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('aa', 'aab'), true)",
      },
      {
        title: 'буквы не хватает',
        input: "'aa', 'ab'",
        expected: 'false',
        assertion: "assertDeepEqual(candidate('aa', 'ab'), false)",
      },
      {
        title: 'нет нужной буквы',
        input: "'a', 'b'",
        expected: 'false',
        assertion: "assertDeepEqual(candidate('a', 'b'), false)",
      },
      {
        title: 'пустая записка',
        input: "'', 'abc'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('', 'abc'), true)",
      },
    ],
    solutionNotes: [
      'Посчитайте частоты букв журнала в объекте или Map.',
      'Идите по записке и уменьшайте счётчики.',
      'Если счётчик буквы ушёл в минус — ответ false.',
    ],
  },
  {
    id: 'lc-isomorphic-strings',
    slug: 'isomorphic-strings',
    title: 'Изоморфные строки',
    category: 'Arrays & Hashing',
    difficulty: 'easy',
    companies: ['LinkedIn', 'Yandex'],
    successRate: 65,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Даны две строки одинаковой длины. Верните true, если они изоморфны: символы s можно заменить так, чтобы получить t, причём замена взаимно однозначная — два разных символа не могут отображаться в один.',
    constraints: [
      'строки имеют одинаковую длину',
      'отображение должно быть взаимно однозначным в обе стороны',
      'символ может отображаться сам в себя',
    ],
    examples: [
      {
        input: "solution('egg', 'add')",
        output: 'true',
      },
      {
        input: "solution('foo', 'bar')",
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('s, t', '  // ваш код\n  return false'),
      typescript: jsStarter('s, t', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'изоморфные строки',
        input: "'egg', 'add'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('egg', 'add'), true)",
      },
      {
        title: 'не изоморфные',
        input: "'foo', 'bar'",
        expected: 'false',
        assertion: "assertDeepEqual(candidate('foo', 'bar'), false)",
      },
      {
        title: 'длинный пример',
        input: "'paper', 'title'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('paper', 'title'), true)",
      },
      {
        title: 'нарушение в обратную сторону',
        input: "'badc', 'baba'",
        expected: 'false',
        assertion: "assertDeepEqual(candidate('badc', 'baba'), false)",
      },
    ],
    solutionNotes: [
      'Держите два отображения: s → t и t → s.',
      'На каждой позиции проверяйте согласованность обоих отображений.',
      'Однонаправленной проверки мало: "badc" → "baba" ловится только обратным отображением.',
    ],
  },
  {
    id: 'lc-happy-number',
    slug: 'happy-number',
    title: 'Счастливое число',
    category: 'Arrays & Hashing',
    difficulty: 'easy',
    companies: ['Google', 'Airbnb'],
    successRate: 62,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Число называется счастливым, если многократная замена числа на сумму квадратов его цифр в конце концов даёт 1. Если процесс зацикливается, число несчастливое. Верните true для счастливого числа.',
    constraints: [
      'n — положительное целое число',
      'процесс либо приходит к 1, либо зацикливается',
      'для обнаружения цикла пригодится Set',
    ],
    examples: [
      {
        input: 'solution(19)',
        output: 'true',
        explanation: '1² + 9² = 82 → 64 + 4 = 68 → 36 + 64 = 100 → 1.',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return false'),
      typescript: jsStarter('n', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'счастливое число',
        input: '19',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate(19), true)',
      },
      {
        title: 'несчастливое число',
        input: '2',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate(2), false)',
      },
      {
        title: 'единица счастлива',
        input: '1',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate(1), true)',
      },
      {
        title: 'ещё одно счастливое',
        input: '7',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate(7), true)',
      },
    ],
    solutionNotes: [
      'Складывайте встреченные числа в Set — повтор означает цикл.',
      'Сумма квадратов цифр: n % 10 и Math.floor(n / 10) в цикле.',
      'Альтернатива без памяти — быстрый и медленный указатели, как в поиске цикла в списке.',
    ],
  },
  {
    id: 'lc-subarray-sum-k',
    slug: 'subarray-sum-k',
    title: 'Подмассивы с суммой k',
    category: 'Arrays & Hashing',
    difficulty: 'medium',
    companies: ['Facebook', 'Yandex', 'Tinkoff'],
    successRate: 43,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив целых чисел и число k. Посчитайте количество непрерывных подмассивов, сумма которых равна k. Числа могут быть отрицательными, поэтому скользящее окно не подходит — нужны префиксные суммы.',
    constraints: [
      'числа могут быть отрицательными и нулевыми',
      'ожидаемая сложность O(n) с хеш-таблицей префиксных сумм',
      'подмассив должен быть непустым и непрерывным',
    ],
    examples: [
      {
        input: 'solution([1, 1, 1], 2)',
        output: '2',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, k', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums, k', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'перекрывающиеся подмассивы',
        input: '[1, 1, 1], 2',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([1, 1, 1], 2), 2)',
      },
      {
        title: 'подмассивы разной длины',
        input: '[1, 2, 3], 3',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([1, 2, 3], 3), 2)',
      },
      {
        title: 'отрицательные числа и ноль',
        input: '[1, -1, 0], 0',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([1, -1, 0], 0), 3)',
      },
      {
        title: 'большой пример',
        input: '[3, 4, 7, 2, -3, 1, 4, 2], 7',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([3, 4, 7, 2, -3, 1, 4, 2], 7), 4)',
      },
    ],
    solutionNotes: [
      'Сумма подмассива (i, j] — это prefix[j] - prefix[i].',
      'Идите слева направо и храните в Map количество каждой префиксной суммы.',
      'Для текущей суммы s добавляйте к ответу map.get(s - k); не забудьте map.set(0, 1).',
    ],
  },
  {
    id: 'lc-encode-decode-strings',
    slug: 'encode-decode-strings',
    title: 'Кодирование списка строк',
    category: 'Arrays & Hashing',
    difficulty: 'medium',
    companies: ['Neetcode', 'Google'],
    successRate: 48,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Спроектируйте кодек для передачи списка строк одной строкой: функция возвращает объект с методами encode(strings) — упаковать массив строк в одну строку, и decode(encoded) — восстановить исходный массив. Строки могут содержать любые символы, включая ваш разделитель.',
    constraints: [
      'decode(encode(strings)) должен вернуть исходный массив',
      'строки могут содержать любые символы, в том числе # и цифры',
      'пустые строки и пустой список должны выживать round-trip',
    ],
    examples: [
      {
        input: "const codec = solution(); codec.decode(codec.encode(['hello', 'world']))",
        output: "['hello', 'world']",
      },
    ],
    starterCode: {
      javascript: jsStarter(
        '',
        "  // верните объект с методами encode(strings) и decode(encoded)\n  return {\n    encode(strings) {\n      return ''\n    },\n    decode(encoded) {\n      return []\n    },\n  }"
      ),
      typescript: jsStarter(
        '',
        "  // верните объект с методами encode(strings) и decode(encoded)\n  return {\n    encode(strings) {\n      return ''\n    },\n    decode(encoded) {\n      return []\n    },\n  }"
      ),
    },
    tests: [
      {
        title: 'round-trip простых строк',
        input: "['hello', 'world']",
        expected: "['hello', 'world']",
        assertion:
          "const codec = candidate(); assertDeepEqual(codec.decode(codec.encode(['hello', 'world'])), ['hello', 'world'])",
      },
      {
        title: 'encode возвращает строку',
        input: "['a', 'b']",
        expected: "typeof === 'string'",
        assertion:
          "const codec = candidate(); assertDeepEqual(typeof codec.encode(['a', 'b']), 'string')",
      },
      {
        title: 'строки с разделителями и пустые',
        input: "['a#b', '', '##', '5#x']",
        expected: 'массив восстанавливается без потерь',
        assertion:
          "const codec = candidate(); assertDeepEqual(codec.decode(codec.encode(['a#b', '', '##', '5#x'])), ['a#b', '', '##', '5#x'])",
      },
      {
        title: 'пустой список',
        input: '[]',
        expected: '[]',
        assertion:
          'const codec = candidate(); assertDeepEqual(codec.decode(codec.encode([])), [])',
      },
    ],
    solutionNotes: [
      'Префикс длины: кодируйте каждую строку как `длина#строка`.',
      'При декодировании читайте число до #, затем ровно столько символов.',
      'Просто join по разделителю не работает — разделитель может встретиться в данных.',
    ],
  },
  {
    id: 'lc-merge-sorted-arrays',
    slug: 'merge-sorted-arrays',
    title: 'Слить два отсортированных массива',
    category: 'Two Pointers',
    difficulty: 'easy',
    companies: ['Facebook', 'Sber', 'Frontend'],
    successRate: 70,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Даны два массива, отсортированных по возрастанию. Верните новый отсортированный массив со всеми элементами обоих массивов. Решение должно работать за O(n + m) — без конкатенации и повторной сортировки.',
    constraints: [
      'нельзя использовать sort',
      'исходные массивы нельзя мутировать',
      'дубликаты сохраняются',
    ],
    examples: [
      {
        input: 'solution([1, 3, 5], [2, 4, 6])',
        output: '[1, 2, 3, 4, 5, 6]',
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return []'),
      typescript: jsStarter('a, b', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'чередующиеся элементы',
        input: '[1, 3, 5], [2, 4, 6]',
        expected: '[1, 2, 3, 4, 5, 6]',
        assertion: 'assertDeepEqual(candidate([1, 3, 5], [2, 4, 6]), [1, 2, 3, 4, 5, 6])',
      },
      {
        title: 'один массив пустой',
        input: '[], [1, 2]',
        expected: '[1, 2]',
        assertion: 'assertDeepEqual(candidate([], [1, 2]), [1, 2])',
      },
      {
        title: 'дубликаты сохраняются',
        input: '[1, 2, 2], [2, 3]',
        expected: '[1, 2, 2, 2, 3]',
        assertion: 'assertDeepEqual(candidate([1, 2, 2], [2, 3]), [1, 2, 2, 2, 3])',
      },
      {
        title: 'не мутирует исходные массивы',
        input: '[2], [1]',
        expected: 'исходники не изменились',
        assertion:
          'const left = [2]; const right = [1]; candidate(left, right); assertDeepEqual(left, [2]); assertDeepEqual(right, [1])',
      },
    ],
    solutionNotes: [
      'Два указателя i и j, выбирайте меньший элемент и двигайте соответствующий указатель.',
      'Когда один массив закончился — допишите хвост другого.',
      'Это и есть фаза merge из сортировки слиянием.',
    ],
  },
  {
    id: 'lc-sort-colors',
    slug: 'sort-colors',
    title: 'Сортировка цветов',
    category: 'Two Pointers',
    difficulty: 'medium',
    companies: ['Microsoft', 'Yandex'],
    successRate: 52,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив из нулей, единиц и двоек (цвета флага). Отсортируйте его за один проход без использования sort и верните результат. Классическая задача «голландский флаг» Дейкстры.',
    constraints: [
      'массив содержит только 0, 1 и 2',
      'нельзя использовать sort',
      'ожидаемое решение — один проход с тремя указателями',
    ],
    examples: [
      {
        input: 'solution([2, 0, 2, 1, 1, 0])',
        output: '[0, 0, 1, 1, 2, 2]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return nums'),
      typescript: jsStarter('nums', '  // ваш код\n  return nums'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[2, 0, 2, 1, 1, 0]',
        expected: '[0, 0, 1, 1, 2, 2]',
        assertion: 'assertDeepEqual(candidate([2, 0, 2, 1, 1, 0]), [0, 0, 1, 1, 2, 2])',
      },
      {
        title: 'по одному каждого цвета',
        input: '[2, 0, 1]',
        expected: '[0, 1, 2]',
        assertion: 'assertDeepEqual(candidate([2, 0, 1]), [0, 1, 2])',
      },
      {
        title: 'один элемент',
        input: '[0]',
        expected: '[0]',
        assertion: 'assertDeepEqual(candidate([0]), [0])',
      },
      {
        title: 'только один цвет',
        input: '[1, 1, 1]',
        expected: '[1, 1, 1]',
        assertion: 'assertDeepEqual(candidate([1, 1, 1]), [1, 1, 1])',
      },
    ],
    solutionNotes: [
      'Три указателя: low (граница нулей), mid (текущий), high (граница двоек).',
      '0 — меняйте с low и двигайте оба; 2 — меняйте с high и двигайте только high; 1 — просто mid++.',
      'После обмена с high не двигайте mid: приехавший элемент ещё не проверен.',
    ],
  },
  {
    id: 'lc-max-average-subarray',
    slug: 'max-average-subarray',
    title: 'Максимальное среднее подмассива',
    category: 'Sliding Window',
    difficulty: 'easy',
    companies: ['Neetcode', 'Frontend'],
    successRate: 66,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив чисел и число k. Найдите непрерывный подмассив длины k с максимальной суммой и верните его среднее значение.',
    constraints: [
      'k не превышает длину массива',
      'числа могут быть отрицательными',
      'ожидаемая сложность O(n) со скользящим окном',
    ],
    examples: [
      {
        input: 'solution([1, 12, -5, -6, 50, 3], 4)',
        output: '12.75',
        explanation: 'Окно [12, -5, -6, 50] даёт сумму 51, среднее 51 / 4 = 12.75.',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, k', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums, k', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[1, 12, -5, -6, 50, 3], 4',
        expected: '12.75',
        assertion: 'assertDeepEqual(candidate([1, 12, -5, -6, 50, 3], 4), 12.75)',
      },
      {
        title: 'окно размером 1',
        input: '[0, 4, 0, 3, 2], 1',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([0, 4, 0, 3, 2], 1), 4)',
      },
      {
        title: 'один элемент',
        input: '[5], 1',
        expected: '5',
        assertion: 'assertDeepEqual(candidate([5], 1), 5)',
      },
      {
        title: 'все числа отрицательные',
        input: '[-1, -2, -3], 2',
        expected: '-1.5',
        assertion: 'assertDeepEqual(candidate([-1, -2, -3], 2), -1.5)',
      },
    ],
    solutionNotes: [
      'Посчитайте сумму первых k элементов.',
      'Сдвигайте окно: прибавляйте новый элемент, вычитайте выпавший.',
      'Держите максимум суммы и в конце разделите на k.',
    ],
  },
  {
    id: 'lc-min-subarray-len',
    slug: 'min-subarray-len',
    title: 'Кратчайший подмассив с суммой ≥ target',
    category: 'Sliding Window',
    difficulty: 'medium',
    companies: ['Facebook', 'Yandex'],
    successRate: 47,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив положительных чисел и число target. Найдите минимальную длину непрерывного подмассива, сумма которого больше или равна target. Если такого подмассива нет, верните 0.',
    constraints: [
      'все числа положительные',
      'если сумма всего массива меньше target — ответ 0',
      'ожидаемая сложность O(n)',
    ],
    examples: [
      {
        input: 'solution([2, 3, 1, 2, 4, 3], 7)',
        output: '2',
        explanation: 'Кратчайший подходящий подмассив — [4, 3].',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, target', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums, target', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[2, 3, 1, 2, 4, 3], 7',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([2, 3, 1, 2, 4, 3], 7), 2)',
      },
      {
        title: 'один элемент покрывает target',
        input: '[1, 4, 4], 4',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([1, 4, 4], 4), 1)',
      },
      {
        title: 'решения нет',
        input: '[1, 1, 1, 1], 11',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([1, 1, 1, 1], 11), 0)',
      },
      {
        title: 'нужен весь массив',
        input: '[1, 2, 3, 4, 5], 15',
        expected: '5',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4, 5], 15), 5)',
      },
    ],
    solutionNotes: [
      'Расширяйте окно правым указателем, накапливая сумму.',
      'Пока сумма ≥ target — фиксируйте длину и сжимайте окно слева.',
      'Сжатие именно в while, а не if: окно может ужаться сразу на несколько шагов.',
    ],
  },
  {
    id: 'lc-longest-ones',
    slug: 'longest-ones',
    title: 'Максимум единиц с k заменами',
    category: 'Sliding Window',
    difficulty: 'medium',
    companies: ['Google', 'Tinkoff'],
    successRate: 45,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан бинарный массив и число k. Можно заменить не более k нулей на единицы. Найдите длину самого длинного непрерывного отрезка из единиц после замен.',
    constraints: [
      'массив состоит из 0 и 1',
      'k может быть 0',
      'ожидаемая сложность O(n)',
    ],
    examples: [
      {
        input: 'solution([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)',
        output: '6',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, k', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums, k', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2',
        expected: '6',
        assertion:
          'assertDeepEqual(candidate([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2), 6)',
      },
      {
        title: 'большой пример',
        input: '[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3',
        expected: '10',
        assertion:
          'assertDeepEqual(candidate([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3), 10)',
      },
      {
        title: 'без замен',
        input: '[1, 0, 1, 1], 0',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([1, 0, 1, 1], 0), 2)',
      },
    ],
    solutionNotes: [
      'Скользящее окно, в котором не больше k нулей.',
      'Считайте нули в окне; когда их стало больше k — двигайте левую границу.',
      'Ответ — максимальная ширина окна за весь проход.',
    ],
  },
  {
    id: 'lc-permutation-in-string',
    slug: 'permutation-in-string',
    title: 'Перестановка в строке',
    category: 'Sliding Window',
    difficulty: 'medium',
    companies: ['Microsoft', 'Yandex'],
    successRate: 44,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Даны строки s1 и s2. Верните true, если s2 содержит какую-нибудь перестановку строки s1 как непрерывную подстроку.',
    constraints: [
      'строки состоят из строчных латинских букв',
      'окно фиксированной длины s1.length',
      'ожидаемая сложность O(n)',
    ],
    examples: [
      {
        input: "solution('ab', 'eidbaooo')",
        output: 'true',
        explanation: "Подстрока 'ba' — перестановка 'ab'.",
      },
    ],
    starterCode: {
      javascript: jsStarter('s1, s2', '  // ваш код\n  return false'),
      typescript: jsStarter('s1, s2', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'перестановка есть',
        input: "'ab', 'eidbaooo'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('ab', 'eidbaooo'), true)",
      },
      {
        title: 'буквы есть, но не подряд',
        input: "'ab', 'eidboaoo'",
        expected: 'false',
        assertion: "assertDeepEqual(candidate('ab', 'eidboaoo'), false)",
      },
      {
        title: 'строки совпадают',
        input: "'a', 'a'",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('a', 'a'), true)",
      },
      {
        title: 'не хватает плотности букв',
        input: "'abc', 'ccccbbbbaaaa'",
        expected: 'false',
        assertion: "assertDeepEqual(candidate('abc', 'ccccbbbbaaaa'), false)",
      },
    ],
    solutionNotes: [
      'Сравнивайте частоты букв: эталон по s1 и окно длины s1.length в s2.',
      'При сдвиге окна обновляйте две частоты: входящую и выходящую букву.',
      'Держите счётчик совпадающих букв, чтобы не сравнивать массивы по 26 элементов на каждом шаге.',
    ],
  },
  {
    id: 'lc-longest-repeating-replacement',
    slug: 'longest-repeating-replacement',
    title: 'Замены до одинаковых символов',
    category: 'Sliding Window',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon'],
    successRate: 42,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка из заглавных латинских букв и число k. Можно заменить не более k символов на любые другие. Найдите длину самой длинной подстроки из одинаковых символов, которую можно получить.',
    constraints: [
      'строка состоит из заглавных латинских букв',
      'k может быть 0',
      'ожидаемая сложность O(n)',
    ],
    examples: [
      {
        input: "solution('AABABBA', 1)",
        output: '4',
        explanation: "Заменив B на A в 'AABA', получаем 'AAAA'.",
      },
    ],
    starterCode: {
      javascript: jsStarter('s, k', '  // ваш код\n  return 0'),
      typescript: jsStarter('s, k', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'две замены',
        input: "'ABAB', 2",
        expected: '4',
        assertion: "assertDeepEqual(candidate('ABAB', 2), 4)",
      },
      {
        title: 'одна замена',
        input: "'AABABBA', 1",
        expected: '4',
        assertion: "assertDeepEqual(candidate('AABABBA', 1), 4)",
      },
      {
        title: 'замены не нужны',
        input: "'AAAA', 0",
        expected: '4',
        assertion: "assertDeepEqual(candidate('AAAA', 0), 4)",
      },
      {
        title: 'все буквы разные',
        input: "'ABCDE', 1",
        expected: '2',
        assertion: "assertDeepEqual(candidate('ABCDE', 1), 2)",
      },
    ],
    solutionNotes: [
      'Окно валидно, если (длина окна − частота самой частой буквы) ≤ k.',
      'Храните частоты букв окна и максимум частоты.',
      'При нарушении условия двигайте левую границу на один шаг — окно никогда не уменьшается, поэтому ответ равен максимальной достигнутой ширине.',
    ],
  },
  {
    id: 'lc-min-window-substring',
    slug: 'min-window-substring',
    title: 'Минимальное окно с подстрокой',
    category: 'Sliding Window',
    difficulty: 'hard',
    companies: ['Facebook', 'Google', 'Yandex'],
    successRate: 30,
    estimatedMinutes: 40,
    languages: ['javascript', 'typescript'],
    description:
      'Даны строки s и t. Найдите минимальную по длине подстроку s, содержащую все символы t с учётом повторов. Если такой подстроки нет, верните пустую строку. Ответ гарантированно единственный.',
    constraints: [
      'повторы в t требуют столько же вхождений в окне',
      'если окна нет — верните пустую строку',
      'ожидаемая сложность O(|s| + |t|)',
    ],
    examples: [
      {
        input: "solution('ADOBECODEBANC', 'ABC')",
        output: "'BANC'",
      },
    ],
    starterCode: {
      javascript: jsStarter('s, t', "  // ваш код\n  return ''"),
      typescript: jsStarter('s, t', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'классический пример',
        input: "'ADOBECODEBANC', 'ABC'",
        expected: "'BANC'",
        assertion: "assertDeepEqual(candidate('ADOBECODEBANC', 'ABC'), 'BANC')",
      },
      {
        title: 'строка равна шаблону',
        input: "'a', 'a'",
        expected: "'a'",
        assertion: "assertDeepEqual(candidate('a', 'a'), 'a')",
      },
      {
        title: 'не хватает повторов',
        input: "'a', 'aa'",
        expected: "''",
        assertion: "assertDeepEqual(candidate('a', 'aa'), '')",
      },
      {
        title: 'окно из одного символа',
        input: "'ab', 'b'",
        expected: "'b'",
        assertion: "assertDeepEqual(candidate('ab', 'b'), 'b')",
      },
    ],
    solutionNotes: [
      'Частоты t — «долг», который нужно покрыть окном.',
      'Расширяйте окно вправо, пока долг не покрыт; затем сжимайте слева, пока окно валидно, фиксируя минимум.',
      'Счётчик «сколько различных символов уже покрыто» избавляет от полного сравнения частот на каждом шаге.',
    ],
  },
  {
    id: 'lc-min-cost-climbing-stairs',
    slug: 'min-cost-climbing-stairs',
    title: 'Лестница с минимальной стоимостью',
    category: 'Dynamic Programming',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon'],
    successRate: 64,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив cost: cost[i] — плата за шаг с i-й ступеньки. Заплатив, можно подняться на одну или две ступеньки. Начать можно с 0-й или 1-й ступеньки. Найдите минимальную стоимость подъёма за верхнюю ступеньку.',
    constraints: [
      'в массиве минимум две ступеньки',
      'стартовать можно с индекса 0 или 1 бесплатно',
      'ожидаемая сложность O(n), память O(1)',
    ],
    examples: [
      {
        input: 'solution([10, 15, 20])',
        output: '15',
        explanation: 'Старт с индекса 1, платим 15 и перешагиваем наверх.',
      },
    ],
    starterCode: {
      javascript: jsStarter('cost', '  // ваш код\n  return 0'),
      typescript: jsStarter('cost', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'короткая лестница',
        input: '[10, 15, 20]',
        expected: '15',
        assertion: 'assertDeepEqual(candidate([10, 15, 20]), 15)',
      },
      {
        title: 'длинная лестница',
        input: '[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]',
        expected: '6',
        assertion:
          'assertDeepEqual(candidate([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]), 6)',
      },
      {
        title: 'две ступеньки',
        input: '[0, 0]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([0, 0]), 0)',
      },
    ],
    solutionNotes: [
      'dp[i] — минимальная стоимость достичь ступеньки i.',
      'dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]).',
      'Достаточно двух переменных вместо массива.',
    ],
  },
  {
    id: 'lc-word-break',
    slug: 'word-break',
    title: 'Разбиение строки на слова',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    companies: ['Facebook', 'Yandex', 'Amazon'],
    successRate: 43,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка s и словарь wordDict. Верните true, если строку можно полностью разбить на слова из словаря. Слова можно использовать многократно.',
    constraints: [
      'слова словаря можно переиспользовать',
      'разбиение должно покрывать всю строку без остатка',
      'ожидаемая сложность O(n² · m) и лучше',
    ],
    examples: [
      {
        input: "solution('leetcode', ['leet', 'code'])",
        output: 'true',
      },
      {
        input: "solution('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])",
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('s, wordDict', '  // ваш код\n  return false'),
      typescript: jsStarter('s, wordDict', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'строка разбивается на два слова',
        input: "'leetcode', ['leet', 'code']",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('leetcode', ['leet', 'code']), true)",
      },
      {
        title: 'слово используется дважды',
        input: "'applepenapple', ['apple', 'pen']",
        expected: 'true',
        assertion:
          "assertDeepEqual(candidate('applepenapple', ['apple', 'pen']), true)",
      },
      {
        title: 'разбиения нет',
        input: "'catsandog', ['cats', 'dog', 'sand', 'and', 'cat']",
        expected: 'false',
        assertion:
          "assertDeepEqual(candidate('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), false)",
      },
      {
        title: 'перекрывающиеся варианты',
        input: "'aaaaaaa', ['aaaa', 'aaa']",
        expected: 'true',
        assertion: "assertDeepEqual(candidate('aaaaaaa', ['aaaa', 'aaa']), true)",
      },
    ],
    solutionNotes: [
      'dp[i] — можно ли разбить префикс длины i; dp[0] = true.',
      'dp[i] истинно, если найдётся j < i с dp[j] и s.slice(j, i) в словаре.',
      'Словарь сложите в Set, чтобы проверка была O(1).',
    ],
  },
  {
    id: 'lc-assign-cookies',
    slug: 'assign-cookies',
    title: 'Раздать печенье',
    category: 'Greedy',
    difficulty: 'easy',
    companies: ['Neetcode', 'VK'],
    successRate: 70,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив g — жадность детей и массив s — размеры печений. Ребёнок доволен, если получил печенье размером не меньше его жадности. Каждому ребёнку — максимум одно печенье. Верните максимальное число довольных детей.',
    constraints: [
      'каждое печенье можно отдать только одному ребёнку',
      'массивы могут быть пустыми',
      'жадная стратегия с сортировкой даёт оптимум',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3], [1, 1])',
        output: '1',
      },
    ],
    starterCode: {
      javascript: jsStarter('g, s', '  // ваш код\n  return 0'),
      typescript: jsStarter('g, s', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'печений не хватает',
        input: '[1, 2, 3], [1, 1]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([1, 2, 3], [1, 1]), 1)',
      },
      {
        title: 'всем хватает',
        input: '[1, 2], [1, 2, 3]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([1, 2], [1, 2, 3]), 2)',
      },
      {
        title: 'никому не подходит',
        input: '[10], [1, 2, 3]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([10], [1, 2, 3]), 0)',
      },
      {
        title: 'неотсортированный вход',
        input: '[3, 1, 2], [2, 3, 1]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([3, 1, 2], [2, 3, 1]), 3)',
      },
    ],
    solutionNotes: [
      'Отсортируйте обе последовательности по возрастанию.',
      'Два указателя: наименее жадному ребёнку — наименьшее подходящее печенье.',
      'Если печенье мало — двигайте только указатель печений.',
    ],
  },
  {
    id: 'lc-can-place-flowers',
    slug: 'can-place-flowers',
    title: 'Посадить цветы',
    category: 'Greedy',
    difficulty: 'easy',
    companies: ['LinkedIn', 'Ozon'],
    successRate: 62,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дана клумба flowerbed из 0 (пусто) и 1 (цветок) и число n. Цветы нельзя сажать на соседних клетках. Верните true, если можно посадить ещё n цветов, не нарушая правило.',
    constraints: [
      'в исходной клумбе правило соседства уже соблюдено',
      'края клумбы граничат с «пустотой»',
      'n может быть 0 — тогда ответ всегда true',
    ],
    examples: [
      {
        input: 'solution([1, 0, 0, 0, 1], 1)',
        output: 'true',
      },
      {
        input: 'solution([1, 0, 0, 0, 1], 2)',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('flowerbed, n', '  // ваш код\n  return false'),
      typescript: jsStarter('flowerbed, n', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'место для одного цветка',
        input: '[1, 0, 0, 0, 1], 1',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate([1, 0, 0, 0, 1], 1), true)',
      },
      {
        title: 'для двух места нет',
        input: '[1, 0, 0, 0, 1], 2',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate([1, 0, 0, 0, 1], 2), false)',
      },
      {
        title: 'пустая клумба',
        input: '[0, 0, 0], 2',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate([0, 0, 0], 2), true)',
      },
      {
        title: 'одна клетка',
        input: '[0], 1',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate([0], 1), true)',
      },
    ],
    solutionNotes: [
      'Идите слева направо и сажайте цветок при первой возможности — это оптимально.',
      'Клетка подходит, если она и оба соседа пусты; края считайте пустыми соседями.',
      'Посадив цветок, отметьте клетку, чтобы следующая проверка её учла.',
    ],
  },
  {
    id: 'lc-best-time-buy-sell-ii',
    slug: 'best-time-buy-sell-ii',
    title: 'Акции: много сделок',
    category: 'Greedy',
    difficulty: 'easy',
    companies: ['Neetcode', 'Tinkoff'],
    successRate: 63,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив цен акции по дням. Можно совершать сколько угодно сделок (купить, потом продать), но держать больше одной акции нельзя. Верните максимальную суммарную прибыль.',
    constraints: [
      'новую покупку можно делать только после продажи',
      'покупка и продажа в один день разрешены',
      'если цены только падают — прибыль 0',
    ],
    examples: [
      {
        input: 'solution([7, 1, 5, 3, 6, 4])',
        output: '7',
        explanation: 'Купить за 1, продать за 5 (+4); купить за 3, продать за 6 (+3).',
      },
    ],
    starterCode: {
      javascript: jsStarter('prices', '  // ваш код\n  return 0'),
      typescript: jsStarter('prices', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'две выгодные сделки',
        input: '[7, 1, 5, 3, 6, 4]',
        expected: '7',
        assertion: 'assertDeepEqual(candidate([7, 1, 5, 3, 6, 4]), 7)',
      },
      {
        title: 'монотонный рост',
        input: '[1, 2, 3, 4, 5]',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4, 5]), 4)',
      },
      {
        title: 'цены только падают',
        input: '[7, 6, 4, 3, 1]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([7, 6, 4, 3, 1]), 0)',
      },
    ],
    solutionNotes: [
      'Суммируйте все положительные разницы соседних дней.',
      'Любая «длинная» сделка раскладывается на дневные приросты.',
      'Однострочник через reduce.',
    ],
  },
  {
    id: 'lc-jump-game-ii',
    slug: 'jump-game-ii',
    title: 'Минимум прыжков',
    category: 'Greedy',
    difficulty: 'medium',
    companies: ['Amazon', 'Yandex'],
    successRate: 44,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив nums: с позиции i можно прыгнуть вперёд максимум на nums[i]. Гарантируется, что последняя позиция достижима. Верните минимальное количество прыжков от начала до конца массива.',
    constraints: [
      'последний индекс гарантированно достижим',
      'из массива длины 1 прыгать не нужно — ответ 0',
      'ожидаемая сложность O(n)',
    ],
    examples: [
      {
        input: 'solution([2, 3, 1, 1, 4])',
        output: '2',
        explanation: 'Прыжок с 0 на 1, затем с 1 сразу на конец.',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[2, 3, 1, 1, 4]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([2, 3, 1, 1, 4]), 2)',
      },
      {
        title: 'другой путь',
        input: '[2, 3, 0, 1, 4]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([2, 3, 0, 1, 4]), 2)',
      },
      {
        title: 'только короткие прыжки',
        input: '[1, 1, 1, 1]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([1, 1, 1, 1]), 3)',
      },
      {
        title: 'прыгать не нужно',
        input: '[0]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([0]), 0)',
      },
    ],
    solutionNotes: [
      'Жадный BFS по уровням: текущая граница прыжка и самая дальняя достижимая точка.',
      'Дойдя до границы — увеличьте счётчик прыжков и расширьте границу до дальней точки.',
      'Идти достаточно до предпоследнего индекса.',
    ],
  },
  {
    id: 'lc-gas-station',
    slug: 'gas-station',
    title: 'Заправки по кругу',
    category: 'Greedy',
    difficulty: 'medium',
    companies: ['Neetcode', 'Sber'],
    successRate: 42,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'По кругу расположены заправки: gas[i] — сколько топлива можно залить, cost[i] — сколько уйдёт на переезд к следующей. Найдите индекс заправки, с которой можно объехать весь круг, или -1, если это невозможно. Если решение существует, оно единственно.',
    constraints: [
      'бак изначально пуст',
      'если суммарного топлива меньше суммарного расхода — ответ -1',
      'ожидаемая сложность O(n)',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])',
        output: '3',
      },
    ],
    starterCode: {
      javascript: jsStarter('gas, cost', '  // ваш код\n  return -1'),
      typescript: jsStarter('gas, cost', '  // ваш код\n  return -1'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), 3)',
      },
      {
        title: 'объехать невозможно',
        input: '[2, 3, 4], [3, 4, 3]',
        expected: '-1',
        assertion: 'assertDeepEqual(candidate([2, 3, 4], [3, 4, 3]), -1)',
      },
      {
        title: 'одна заправка',
        input: '[5], [4]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([5], [4]), 0)',
      },
    ],
    solutionNotes: [
      'Если общий баланс топлива отрицательный — сразу -1.',
      'Идите по кругу, накапливая бак; ушли в минус — стартовать нужно после этой точки, обнулите бак.',
      'Кандидат после одного прохода и есть ответ — повторный круг не нужен.',
    ],
  },
  {
    id: 'lc-partition-labels',
    slug: 'partition-labels',
    title: 'Разбиение на метки',
    category: 'Greedy',
    difficulty: 'medium',
    companies: ['Amazon', 'Yandex'],
    successRate: 47,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка из строчных букв. Разбейте её на максимальное число частей так, чтобы каждая буква встречалась только в одной части. Верните массив длин частей.',
    constraints: [
      'каждая буква целиком принадлежит одной части',
      'частей должно быть как можно больше',
      'сумма длин равна длине строки',
    ],
    examples: [
      {
        input: "solution('ababcbacadefegdehijhklij')",
        output: '[9, 7, 8]',
      },
    ],
    starterCode: {
      javascript: jsStarter('s', '  // ваш код\n  return []'),
      typescript: jsStarter('s', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'классический пример',
        input: "'ababcbacadefegdehijhklij'",
        expected: '[9, 7, 8]',
        assertion: "assertDeepEqual(candidate('ababcbacadefegdehijhklij'), [9, 7, 8])",
      },
      {
        title: 'вся строка — одна часть',
        input: "'eccbbbbdec'",
        expected: '[10]',
        assertion: "assertDeepEqual(candidate('eccbbbbdec'), [10])",
      },
      {
        title: 'все буквы уникальны',
        input: "'abc'",
        expected: '[1, 1, 1]',
        assertion: "assertDeepEqual(candidate('abc'), [1, 1, 1])",
      },
    ],
    solutionNotes: [
      'Сначала запомните последний индекс каждой буквы.',
      'Идите по строке, расширяя границу части до последнего вхождения встреченных букв.',
      'Когда индекс догнал границу — часть закончилась, фиксируйте длину.',
    ],
  },
  {
    id: 'lc-non-overlapping-intervals',
    slug: 'non-overlapping-intervals',
    title: 'Непересекающиеся интервалы',
    category: 'Greedy',
    difficulty: 'medium',
    companies: ['Neetcode', 'Google'],
    successRate: 45,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив интервалов [start, end]. Найдите минимальное количество интервалов, которые нужно удалить, чтобы оставшиеся не пересекались. Касание концами (end одного равен start другого) пересечением не считается.',
    constraints: [
      'касание границами — не пересечение',
      'интервалы могут совпадать полностью',
      'ожидаемая сложность O(n log n)',
    ],
    examples: [
      {
        input: 'solution([[1, 2], [2, 3], [3, 4], [1, 3]])',
        output: '1',
        explanation: 'Достаточно удалить [1, 3].',
      },
    ],
    starterCode: {
      javascript: jsStarter('intervals', '  // ваш код\n  return 0'),
      typescript: jsStarter('intervals', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'удалить один интервал',
        input: '[[1, 2], [2, 3], [3, 4], [1, 3]]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([[1, 2], [2, 3], [3, 4], [1, 3]]), 1)',
      },
      {
        title: 'одинаковые интервалы',
        input: '[[1, 2], [1, 2], [1, 2]]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([[1, 2], [1, 2], [1, 2]]), 2)',
      },
      {
        title: 'удалять ничего не нужно',
        input: '[[1, 2], [2, 3]]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([[1, 2], [2, 3]]), 0)',
      },
    ],
    solutionNotes: [
      'Отсортируйте интервалы по правому концу.',
      'Жадно оставляйте интервал, если он начинается не раньше конца предыдущего оставленного.',
      'Ответ — общее количество минус количество оставленных.',
    ],
  },
  {
    id: 'lc-search-insert-position',
    slug: 'search-insert-position',
    title: 'Позиция вставки',
    category: 'Binary Search',
    difficulty: 'easy',
    companies: ['Neetcode', 'VK'],
    successRate: 68,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Дан отсортированный массив уникальных чисел и target. Верните индекс target, если он есть в массиве, иначе — индекс, куда его нужно вставить, чтобы порядок сохранился.',
    constraints: [
      'массив отсортирован по возрастанию, числа уникальны',
      'ожидаемая сложность O(log n)',
      'target может быть меньше всех или больше всех элементов',
    ],
    examples: [
      {
        input: 'solution([1, 3, 5, 6], 5)',
        output: '2',
      },
      {
        input: 'solution([1, 3, 5, 6], 2)',
        output: '1',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, target', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums, target', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'элемент найден',
        input: '[1, 3, 5, 6], 5',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([1, 3, 5, 6], 5), 2)',
      },
      {
        title: 'вставка в середину',
        input: '[1, 3, 5, 6], 2',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([1, 3, 5, 6], 2), 1)',
      },
      {
        title: 'вставка в конец',
        input: '[1, 3, 5, 6], 7',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([1, 3, 5, 6], 7), 4)',
      },
      {
        title: 'вставка в начало',
        input: '[1], 0',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([1], 0), 0)',
      },
    ],
    solutionNotes: [
      'Это поиск нижней границы (lower bound).',
      'Инвариант: ответ лежит в [left, right], где right стартует с длины массива.',
      'После цикла left и есть позиция вставки.',
    ],
  },
  {
    id: 'lc-my-sqrt',
    slug: 'my-sqrt',
    title: 'Целочисленный квадратный корень',
    category: 'Binary Search',
    difficulty: 'easy',
    companies: ['Amazon', 'Sber'],
    successRate: 60,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дано неотрицательное целое число x. Верните целую часть его квадратного корня, не используя Math.sqrt и оператор **.',
    constraints: [
      'нельзя использовать Math.sqrt, Math.pow и **',
      'x может быть до 2³¹ - 1 — линейный перебор слишком медленный',
      'ожидаемая сложность O(log x)',
    ],
    examples: [
      {
        input: 'solution(8)',
        output: '2',
        explanation: 'Корень из 8 равен 2.828…, целая часть — 2.',
      },
    ],
    starterCode: {
      javascript: jsStarter('x', '  // ваш код\n  return 0'),
      typescript: jsStarter('x', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'полный квадрат',
        input: '4',
        expected: '2',
        assertion: 'assertDeepEqual(candidate(4), 2)',
      },
      {
        title: 'округление вниз',
        input: '8',
        expected: '2',
        assertion: 'assertDeepEqual(candidate(8), 2)',
      },
      {
        title: 'ноль и единица',
        input: '0 и 1',
        expected: '0 и 1',
        assertion: 'assertDeepEqual(candidate(0), 0); assertDeepEqual(candidate(1), 1)',
      },
      {
        title: 'большое число',
        input: '2147395599',
        expected: '46339',
        assertion: 'assertDeepEqual(candidate(2147395599), 46339)',
      },
    ],
    solutionNotes: [
      'Бинарный поиск по ответу: ищем наибольшее m с m * m ≤ x.',
      'Границы: от 0 до x (или x / 2 + 1).',
      'Осторожно с переполнением в других языках; в JS числа двойной точности это выдержат.',
    ],
  },
  {
    id: 'lc-find-peak-element',
    slug: 'find-peak-element',
    title: 'Найти пиковый элемент',
    category: 'Binary Search',
    difficulty: 'medium',
    companies: ['Facebook', 'Yandex'],
    successRate: 50,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив, в котором соседние элементы не равны. Пик — элемент, который строго больше обоих соседей (за краями массива считается минус бесконечность). Найдите индекс пика за O(log n).',
    constraints: [
      'соседние элементы различны',
      'за границами массива — минус бесконечность',
      'ожидаемая сложность O(log n)',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3, 1])',
        output: '2',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'пик в середине',
        input: '[1, 2, 3, 1]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 1]), 2)',
      },
      {
        title: 'пик в конце',
        input: '[1, 2, 3, 4]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4]), 3)',
      },
      {
        title: 'пик в начале',
        input: '[4, 3, 2, 1]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([4, 3, 2, 1]), 0)',
      },
      {
        title: 'один элемент',
        input: '[7]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([7]), 0)',
      },
    ],
    solutionNotes: [
      'Сравните nums[mid] с nums[mid + 1].',
      'Если правый сосед больше — пик справа, иначе пик слева или в mid.',
      'Сходимся, пока left < right; left — ответ.',
    ],
  },
  {
    id: 'lc-find-min-rotated',
    slug: 'find-min-rotated',
    title: 'Минимум в повёрнутом массиве',
    category: 'Binary Search',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon'],
    successRate: 48,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Отсортированный массив уникальных чисел циклически сдвинули на неизвестное число позиций. Найдите минимальный элемент за O(log n).',
    constraints: [
      'числа уникальны',
      'массив мог не сдвигаться вовсе',
      'ожидаемая сложность O(log n)',
    ],
    examples: [
      {
        input: 'solution([3, 4, 5, 1, 2])',
        output: '1',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'сдвиг на три',
        input: '[3, 4, 5, 1, 2]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([3, 4, 5, 1, 2]), 1)',
      },
      {
        title: 'сдвиг на четыре',
        input: '[4, 5, 6, 7, 0, 1, 2]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([4, 5, 6, 7, 0, 1, 2]), 0)',
      },
      {
        title: 'без сдвига',
        input: '[11, 13, 15, 17]',
        expected: '11',
        assertion: 'assertDeepEqual(candidate([11, 13, 15, 17]), 11)',
      },
      {
        title: 'два элемента',
        input: '[2, 1]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([2, 1]), 1)',
      },
    ],
    solutionNotes: [
      'Сравнивайте nums[mid] с nums[right].',
      'Если nums[mid] > nums[right] — минимум справа от mid, иначе в левой половине вместе с mid.',
      'Когда left == right — это минимум.',
    ],
  },
  {
    id: 'lc-search-rotated',
    slug: 'search-rotated',
    title: 'Поиск в повёрнутом массиве',
    category: 'Binary Search',
    difficulty: 'medium',
    companies: ['Facebook', 'Yandex', 'Tinkoff'],
    successRate: 42,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Отсортированный массив уникальных чисел циклически сдвинут. Найдите индекс target за O(log n) или верните -1, если его нет.',
    constraints: [
      'числа уникальны',
      'ожидаемая сложность O(log n)',
      'массив мог не сдвигаться',
    ],
    examples: [
      {
        input: 'solution([4, 5, 6, 7, 0, 1, 2], 0)',
        output: '4',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums, target', '  // ваш код\n  return -1'),
      typescript: jsStarter('nums, target', '  // ваш код\n  return -1'),
    },
    tests: [
      {
        title: 'target в правой половине',
        input: '[4, 5, 6, 7, 0, 1, 2], 0',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([4, 5, 6, 7, 0, 1, 2], 0), 4)',
      },
      {
        title: 'target отсутствует',
        input: '[4, 5, 6, 7, 0, 1, 2], 3',
        expected: '-1',
        assertion: 'assertDeepEqual(candidate([4, 5, 6, 7, 0, 1, 2], 3), -1)',
      },
      {
        title: 'один элемент',
        input: '[1], 1',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([1], 1), 0)',
      },
      {
        title: 'короткий сдвиг',
        input: '[5, 1, 3], 3',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([5, 1, 3], 3), 2)',
      },
    ],
    solutionNotes: [
      'Одна из половин относительно mid всегда отсортирована.',
      'Определите её сравнением nums[left] ≤ nums[mid].',
      'Если target лежит в отсортированной половине — идите туда, иначе в другую.',
    ],
  },
  {
    id: 'lc-koko-bananas',
    slug: 'koko-bananas',
    title: 'Коко ест бананы',
    category: 'Binary Search',
    difficulty: 'medium',
    companies: ['Neetcode', 'Google'],
    successRate: 46,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Даны кучи бананов piles и h часов. За час Коко съедает k бананов из одной кучи; если в куче меньше k, куча заканчивается, но час всё равно потрачен. Найдите минимальную скорость k, при которой все бананы будут съедены за h часов.',
    constraints: [
      'h не меньше количества куч',
      'время на кучу — Math.ceil(pile / k)',
      'ожидаемая сложность O(n log max(piles))',
    ],
    examples: [
      {
        input: 'solution([3, 6, 7, 11], 8)',
        output: '4',
      },
    ],
    starterCode: {
      javascript: jsStarter('piles, h', '  // ваш код\n  return 1'),
      typescript: jsStarter('piles, h', '  // ваш код\n  return 1'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[3, 6, 7, 11], 8',
        expected: '4',
        assertion: 'assertDeepEqual(candidate([3, 6, 7, 11], 8), 4)',
      },
      {
        title: 'времени впритык',
        input: '[30, 11, 23, 4, 20], 5',
        expected: '30',
        assertion: 'assertDeepEqual(candidate([30, 11, 23, 4, 20], 5), 30)',
      },
      {
        title: 'на час больше',
        input: '[30, 11, 23, 4, 20], 6',
        expected: '23',
        assertion: 'assertDeepEqual(candidate([30, 11, 23, 4, 20], 6), 23)',
      },
    ],
    solutionNotes: [
      'Бинарный поиск по скорости k от 1 до максимальной кучи.',
      'Для кандидата k посчитайте суммарные часы: сумма Math.ceil(pile / k).',
      'Если успевает — пробуйте меньше, иначе больше; ищем левую границу.',
    ],
  },
  {
    id: 'lc-median-two-sorted',
    slug: 'median-two-sorted',
    title: 'Медиана двух отсортированных массивов',
    category: 'Binary Search',
    difficulty: 'hard',
    companies: ['Google', 'Amazon', 'Yandex'],
    successRate: 25,
    estimatedMinutes: 45,
    languages: ['javascript', 'typescript'],
    description:
      'Даны два отсортированных массива. Найдите медиану объединённой последовательности. Жюри принимает O(m + n) со слиянием, но эталонное решение работает за O(log(min(m, n))) бинарным поиском по разрезу.',
    constraints: [
      'хотя бы один массив непустой',
      'при чётной суммарной длине медиана — среднее двух центральных элементов',
      'эталонная сложность O(log(min(m, n)))',
    ],
    examples: [
      {
        input: 'solution([1, 3], [2])',
        output: '2',
      },
      {
        input: 'solution([1, 2], [3, 4])',
        output: '2.5',
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return 0'),
      typescript: jsStarter('a, b', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'нечётная суммарная длина',
        input: '[1, 3], [2]',
        expected: '2',
        assertion: 'assertDeepEqual(candidate([1, 3], [2]), 2)',
      },
      {
        title: 'чётная суммарная длина',
        input: '[1, 2], [3, 4]',
        expected: '2.5',
        assertion: 'assertDeepEqual(candidate([1, 2], [3, 4]), 2.5)',
      },
      {
        title: 'одинаковые значения',
        input: '[0, 0], [0, 0]',
        expected: '0',
        assertion: 'assertDeepEqual(candidate([0, 0], [0, 0]), 0)',
      },
      {
        title: 'один массив пустой',
        input: '[], [1] и [2], []',
        expected: '1 и 2',
        assertion:
          'assertDeepEqual(candidate([], [1]), 1); assertDeepEqual(candidate([2], []), 2)',
      },
      {
        title: 'массивы разной длины',
        input: '[1, 2, 5, 7], [3]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([1, 2, 5, 7], [3]), 3)',
      },
    ],
    solutionNotes: [
      'Идея разреза: левая половина объединения содержит (m + n + 1) / 2 элементов.',
      'Бинарный поиск по разрезу меньшего массива; разрез второго вычисляется автоматически.',
      'Разрез валиден, когда maxLeftA ≤ minRightB и maxLeftB ≤ minRightA; края обрабатывайте ±Infinity.',
    ],
  },
  {
    id: 'lc-power-of-two',
    slug: 'power-of-two',
    title: 'Степень двойки',
    category: 'Bit Manipulation',
    difficulty: 'easy',
    companies: ['Neetcode', 'VK'],
    successRate: 72,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дано целое число. Верните true, если оно является степенью двойки (1, 2, 4, 8, …). Попробуйте решить одной битовой операцией, без циклов.',
    constraints: [
      'ноль и отрицательные числа — не степени двойки',
      'эталонное решение без циклов и рекурсии',
      'подсказка: у степени двойки ровно один установленный бит',
    ],
    examples: [
      {
        input: 'solution(16)',
        output: 'true',
      },
      {
        input: 'solution(18)',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return false'),
      typescript: jsStarter('n', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'степени двойки',
        input: '1, 16, 1024',
        expected: 'true для всех',
        assertion:
          'assertDeepEqual(candidate(1), true); assertDeepEqual(candidate(16), true); assertDeepEqual(candidate(1024), true)',
      },
      {
        title: 'не степени двойки',
        input: '3, 18',
        expected: 'false для всех',
        assertion:
          'assertDeepEqual(candidate(3), false); assertDeepEqual(candidate(18), false)',
      },
      {
        title: 'ноль и отрицательные',
        input: '0, -16',
        expected: 'false для всех',
        assertion:
          'assertDeepEqual(candidate(0), false); assertDeepEqual(candidate(-16), false)',
      },
    ],
    solutionNotes: [
      'n & (n - 1) сбрасывает младший установленный бит.',
      'У степени двойки после этого остаётся 0.',
      'Полная проверка: n > 0 && (n & (n - 1)) === 0.',
    ],
  },
  {
    id: 'lc-counting-bits',
    slug: 'counting-bits',
    title: 'Счёт битов от 0 до n',
    category: 'Bit Manipulation',
    difficulty: 'easy',
    companies: ['Neetcode', 'Amazon'],
    successRate: 60,
    estimatedMinutes: 18,
    languages: ['javascript', 'typescript'],
    description:
      'Дано число n. Верните массив длины n + 1, где i-й элемент — количество единичных битов в числе i. Эталонное решение строит ответ за O(n), переиспользуя уже посчитанные значения.',
    constraints: [
      'длина результата n + 1',
      'эталонная сложность O(n), а не O(n log n)',
      'n может быть 0',
    ],
    examples: [
      {
        input: 'solution(5)',
        output: '[0, 1, 1, 2, 1, 2]',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return []'),
      typescript: jsStarter('n', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'до пяти',
        input: '5',
        expected: '[0, 1, 1, 2, 1, 2]',
        assertion: 'assertDeepEqual(candidate(5), [0, 1, 1, 2, 1, 2])',
      },
      {
        title: 'до двух',
        input: '2',
        expected: '[0, 1, 1]',
        assertion: 'assertDeepEqual(candidate(2), [0, 1, 1])',
      },
      {
        title: 'ноль',
        input: '0',
        expected: '[0]',
        assertion: 'assertDeepEqual(candidate(0), [0])',
      },
      {
        title: 'степень двойки имеет один бит',
        input: '16',
        expected: 'result[16] === 1',
        assertion: 'assertDeepEqual(candidate(16)[16], 1)',
      },
    ],
    solutionNotes: [
      'ДП по битам: bits[i] = bits[i >> 1] + (i & 1).',
      'Сдвиг вправо отбрасывает младший бит, который вы добавляете отдельно.',
      'Альтернатива: bits[i] = bits[i & (i - 1)] + 1.',
    ],
  },
  {
    id: 'lc-reverse-bits',
    slug: 'reverse-bits',
    title: 'Развернуть биты',
    category: 'Bit Manipulation',
    difficulty: 'medium',
    companies: ['Apple', 'Yandex'],
    successRate: 48,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дано 32-битное беззнаковое число. Разверните его биты в обратном порядке и верните получившееся беззнаковое число.',
    constraints: [
      'число трактуется как 32-битное беззнаковое',
      'результат тоже беззнаковый: используйте >>> 0',
      'ровно 32 итерации или развороты по половинам',
    ],
    examples: [
      {
        input: 'solution(43261596)',
        output: '964176192',
        explanation: '00000010100101000001111010011100 → 00111001011110000010100101000000.',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '43261596',
        expected: '964176192',
        assertion: 'assertDeepEqual(candidate(43261596), 964176192)',
      },
      {
        title: 'почти все единицы',
        input: '4294967293',
        expected: '3221225471',
        assertion: 'assertDeepEqual(candidate(4294967293), 3221225471)',
      },
      {
        title: 'ноль',
        input: '0',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(0), 0)',
      },
      {
        title: 'единица уходит в старший бит',
        input: '1',
        expected: '2147483648',
        assertion: 'assertDeepEqual(candidate(1), 2147483648)',
      },
    ],
    solutionNotes: [
      '32 итерации: сдвигайте результат влево, добавляйте младший бит n, сдвигайте n вправо.',
      'В JS битовые операции работают со знаковыми 32-битными — финальный >>> 0 вернёт беззнаковое.',
      'Для n используйте >>> (беззнаковый сдвиг), чтобы не затащить знак.',
    ],
  },
  {
    id: 'lc-add-without-plus',
    slug: 'add-without-plus',
    title: 'Сложение без плюса',
    category: 'Bit Manipulation',
    difficulty: 'medium',
    companies: ['Facebook', 'Sber'],
    successRate: 45,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Сложите два целых числа, не используя операторы + и -. Разрешены только битовые операции.',
    constraints: [
      'операторы + и - запрещены',
      'числа могут быть отрицательными',
      'результат помещается в 32-битное знаковое число',
    ],
    examples: [
      {
        input: 'solution(1, 2)',
        output: '3',
      },
      {
        input: 'solution(-2, 3)',
        output: '1',
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return 0'),
      typescript: jsStarter('a, b', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'положительные числа',
        input: '1, 2',
        expected: '3',
        assertion: 'assertDeepEqual(candidate(1, 2), 3)',
      },
      {
        title: 'разные знаки',
        input: '-2, 3',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(-2, 3), 1)',
      },
      {
        title: 'оба отрицательные',
        input: '-5, -7',
        expected: '-12',
        assertion: 'assertDeepEqual(candidate(-5, -7), -12)',
      },
      {
        title: 'нули',
        input: '0, 0',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(0, 0), 0)',
      },
    ],
    solutionNotes: [
      'XOR — сумма без переноса, AND со сдвигом влево — перенос.',
      'Повторяйте, пока перенос не обнулится: a = a ^ b, b = (a & b) << 1.',
      'В JS битовые операции автоматически приводят к 32-битным знаковым — отрицательные обрабатываются сами.',
    ],
  },
  {
    id: 'lc-single-number-ii',
    slug: 'single-number-ii',
    title: 'Одиночное число II',
    category: 'Bit Manipulation',
    difficulty: 'medium',
    companies: ['Google', 'Tinkoff'],
    successRate: 40,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'В массиве каждое число встречается ровно три раза, кроме одного — оно встречается один раз. Найдите его за O(n) времени и O(1) памяти.',
    constraints: [
      'каждое число, кроме искомого, встречается ровно трижды',
      'эталонное решение — O(1) дополнительной памяти',
      'числа могут быть отрицательными',
    ],
    examples: [
      {
        input: 'solution([2, 2, 3, 2])',
        output: '3',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return 0'),
      typescript: jsStarter('nums', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'короткий массив',
        input: '[2, 2, 3, 2]',
        expected: '3',
        assertion: 'assertDeepEqual(candidate([2, 2, 3, 2]), 3)',
      },
      {
        title: 'длинный массив',
        input: '[0, 1, 0, 1, 0, 1, 99]',
        expected: '99',
        assertion: 'assertDeepEqual(candidate([0, 1, 0, 1, 0, 1, 99]), 99)',
      },
      {
        title: 'отрицательные числа',
        input: '[-2, -2, 1, -2]',
        expected: '1',
        assertion: 'assertDeepEqual(candidate([-2, -2, 1, -2]), 1)',
      },
    ],
    solutionNotes: [
      'Подход «по битам»: для каждого из 32 битов посчитайте сумму по всем числам и возьмите по модулю 3.',
      'Оставшийся бит принадлежит искомому числу.',
      'Элегантная альтернатива: два аккумулятора ones и twos с формулами ones = (ones ^ x) & ~twos; twos = (twos ^ x) & ~ones.',
    ],
  },
  {
    id: 'lc-object-depth',
    slug: 'object-depth',
    title: 'Глубина вложенности структуры',
    category: 'Objects',
    difficulty: 'easy',
    companies: ['Frontend', 'Yandex'],
    successRate: 70,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'Дано значение: примитив или словарь (объект) с произвольной вложенностью. Верните глубину вложенности: примитив имеет глубину 0, пустой или плоский словарь — 1, словарь со словарём внутри — 2 и так далее.',
    constraints: [
      'значениями словаря могут быть примитивы или вложенные словари',
      'глубина примитива равна 0',
      'глубина словаря: 1 + максимальная глубина его значений',
    ],
    examples: [
      {
        input: 'solution({ a: { b: { c: 1 } } })',
        output: '3',
      },
      {
        input: 'solution(42)',
        output: '0',
      },
    ],
    starterCode: {
      javascript: jsStarter('value', '  // ваш код\n  return 0'),
      typescript: jsStarter('value', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'примитив',
        input: '42',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(42), 0)',
      },
      {
        title: 'плоский и пустой словарь',
        input: '{ a: 1, b: 2 } и {}',
        expected: '1 и 1',
        assertion:
          'assertDeepEqual(candidate({ a: 1, b: 2 }), 1); assertDeepEqual(candidate({}), 1)',
      },
      {
        title: 'три уровня',
        input: '{ a: { b: { c: 1 } } }',
        expected: '3',
        assertion: 'assertDeepEqual(candidate({ a: { b: { c: 1 } } }), 3)',
      },
      {
        title: 'разные ветки разной глубины',
        input: '{ a: { b: 1 }, c: { d: { e: 2 } } }',
        expected: '3',
        assertion:
          'assertDeepEqual(candidate({ a: { b: 1 }, c: { d: { e: 2 } } }), 3)',
      },
    ],
    solutionNotes: [
      'Рекурсия: если значение не словарь — верните 0.',
      'Иначе верните 1 + максимум глубин всех значений (0, если словарь пуст).',
      'Итеративный вариант — обход в ширину с уровнем.',
    ],
  },
  {
    id: 'lc-semver-compare',
    slug: 'semver-compare',
    title: 'Сравнение версий',
    category: 'Parsing & Formatting',
    difficulty: 'medium',
    companies: ['Amazon', 'Sber', 'Frontend'],
    successRate: 55,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Даны две версии вида "1.2.10" — числовые сегменты, разделённые точками. Сравните их по сегментам слева направо: верните -1, если первая меньше, 1 — если больше, 0 — если версии равны. Недостающие сегменты считаются нулями, ведущие нули игнорируются.',
    constraints: [
      'сегменты сравниваются как числа: "1.2.10" больше "1.2.9"',
      'недостающие сегменты равны 0: "1.0" равно "1.0.0"',
      'ведущие нули игнорируются: "1.01" равно "1.1"',
    ],
    examples: [
      {
        input: "solution('1.2.3', '1.2.10')",
        output: '-1',
      },
    ],
    starterCode: {
      javascript: jsStarter('a, b', '  // ваш код\n  return 0'),
      typescript: jsStarter('a, b', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'числовое сравнение сегментов',
        input: "'1.2.3', '1.2.10'",
        expected: '-1',
        assertion: "assertDeepEqual(candidate('1.2.3', '1.2.10'), -1)",
      },
      {
        title: 'недостающие сегменты — нули',
        input: "'1.0', '1.0.0'",
        expected: '0',
        assertion: "assertDeepEqual(candidate('1.0', '1.0.0'), 0)",
      },
      {
        title: 'первая версия больше',
        input: "'2.0', '1.9.9'",
        expected: '1',
        assertion: "assertDeepEqual(candidate('2.0', '1.9.9'), 1)",
      },
      {
        title: 'ведущие нули',
        input: "'1.01', '1.1'",
        expected: '0',
        assertion: "assertDeepEqual(candidate('1.01', '1.1'), 0)",
      },
    ],
    solutionNotes: [
      'Разбейте обе строки по точке и идите по максимальной длине.',
      'Недостающий сегмент замените нулём.',
      'Преобразуйте сегменты в числа перед сравнением — строковое сравнение даст неверный результат для "10" и "9".',
    ],
  },
  {
    id: 'lc-palindrome-number',
    slug: 'palindrome-number',
    title: 'Число-палиндром',
    category: 'Math',
    difficulty: 'easy',
    companies: ['Neetcode', 'VK'],
    successRate: 74,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дано целое число. Верните true, если оно читается одинаково слева направо и справа налево. Отрицательные числа палиндромами не считаются.',
    constraints: [
      'отрицательные числа — не палиндромы',
      'попробуйте решить без преобразования числа в строку',
      'числа, оканчивающиеся на 0 (кроме самого 0), — не палиндромы',
    ],
    examples: [
      {
        input: 'solution(121)',
        output: 'true',
      },
      {
        input: 'solution(-121)',
        output: 'false',
      },
    ],
    starterCode: {
      javascript: jsStarter('x', '  // ваш код\n  return false'),
      typescript: jsStarter('x', '  // ваш код\n  return false'),
    },
    tests: [
      {
        title: 'палиндром нечётной длины',
        input: '121',
        expected: 'true',
        assertion: 'assertDeepEqual(candidate(121), true)',
      },
      {
        title: 'отрицательное число',
        input: '-121',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate(-121), false)',
      },
      {
        title: 'оканчивается на ноль',
        input: '10',
        expected: 'false',
        assertion: 'assertDeepEqual(candidate(10), false)',
      },
      {
        title: 'ноль и чётная длина',
        input: '0 и 1221',
        expected: 'true и true',
        assertion:
          'assertDeepEqual(candidate(0), true); assertDeepEqual(candidate(1221), true)',
      },
    ],
    solutionNotes: [
      'Разворачивайте число математически: digit = x % 10, reversed = reversed * 10 + digit.',
      'Достаточно развернуть половину числа и сравнить половины.',
      'Строковое решение тоже принимается, но числовое — интереснее.',
    ],
  },
  {
    id: 'lc-reverse-integer',
    slug: 'reverse-integer',
    title: 'Развернуть целое число',
    category: 'Math',
    difficulty: 'easy',
    companies: ['Amazon', 'Tinkoff'],
    successRate: 62,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дано 32-битное целое число со знаком. Разверните его цифры. Если результат выходит за пределы 32-битного диапазона [-2³¹, 2³¹ - 1], верните 0.',
    constraints: [
      'знак числа сохраняется',
      'хвостовые нули исчезают: 120 превращается в 21',
      'при переполнении 32-битного диапазона верните 0',
    ],
    examples: [
      {
        input: 'solution(123)',
        output: '321',
      },
      {
        input: 'solution(-123)',
        output: '-321',
      },
    ],
    starterCode: {
      javascript: jsStarter('x', '  // ваш код\n  return 0'),
      typescript: jsStarter('x', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'положительное число',
        input: '123',
        expected: '321',
        assertion: 'assertDeepEqual(candidate(123), 321)',
      },
      {
        title: 'отрицательное число',
        input: '-123',
        expected: '-321',
        assertion: 'assertDeepEqual(candidate(-123), -321)',
      },
      {
        title: 'хвостовой ноль',
        input: '120',
        expected: '21',
        assertion: 'assertDeepEqual(candidate(120), 21)',
      },
      {
        title: 'переполнение даёт 0',
        input: '1534236469',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(1534236469), 0)',
      },
    ],
    solutionNotes: [
      'Снимайте последнюю цифру через x % 10 и наращивайте результат.',
      'Граница: 2³¹ - 1 = 2147483647; проверяйте результат до или после умножения.',
      'Знак можно отделить в начале и вернуть в конце.',
    ],
  },
  {
    id: 'lc-roman-to-integer',
    slug: 'roman-to-integer',
    title: 'Римские цифры в число',
    category: 'Math',
    difficulty: 'easy',
    companies: ['Neetcode', 'Yandex'],
    successRate: 68,
    estimatedMinutes: 15,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка с римским числом (I, V, X, L, C, D, M). Преобразуйте её в целое число. Если меньший символ стоит перед большим, он вычитается: IV = 4, IX = 9, XL = 40.',
    constraints: [
      'строка — корректное римское число от 1 до 3999',
      'значения: I=1, V=5, X=10, L=50, C=100, D=500, M=1000',
      'вычитание: меньший символ перед большим вычитается',
    ],
    examples: [
      {
        input: "solution('MCMXCIV')",
        output: '1994',
        explanation: 'M = 1000, CM = 900, XC = 90, IV = 4.',
      },
    ],
    starterCode: {
      javascript: jsStarter('s', '  // ваш код\n  return 0'),
      typescript: jsStarter('s', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'простое сложение',
        input: "'III'",
        expected: '3',
        assertion: "assertDeepEqual(candidate('III'), 3)",
      },
      {
        title: 'без вычитаний',
        input: "'LVIII'",
        expected: '58',
        assertion: "assertDeepEqual(candidate('LVIII'), 58)",
      },
      {
        title: 'одно вычитание',
        input: "'IX'",
        expected: '9',
        assertion: "assertDeepEqual(candidate('IX'), 9)",
      },
      {
        title: 'несколько вычитаний',
        input: "'MCMXCIV'",
        expected: '1994',
        assertion: "assertDeepEqual(candidate('MCMXCIV'), 1994)",
      },
    ],
    solutionNotes: [
      'Идите по строке и сравнивайте текущий символ со следующим.',
      'Если текущее значение меньше следующего — вычитайте его, иначе прибавляйте.',
      'Таблицу значений удобно держать в словаре.',
    ],
  },
  {
    id: 'lc-plus-one',
    slug: 'plus-one',
    title: 'Плюс один',
    category: 'Math',
    difficulty: 'easy',
    companies: ['Google', 'VK'],
    successRate: 70,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дано большое число в виде массива цифр (старшие разряды слева). Прибавьте к нему единицу и верните массив цифр результата. Число может быть длиннее, чем умещается в стандартный целочисленный тип, поэтому собирать его в число нельзя.',
    constraints: [
      'нельзя преобразовывать массив в число целиком — оно может не поместиться в числовой тип',
      'в массиве нет ведущих нулей (кроме числа 0)',
      'результат тоже массив цифр',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3])',
        output: '[1, 2, 4]',
      },
      {
        input: 'solution([9, 9])',
        output: '[1, 0, 0]',
      },
    ],
    starterCode: {
      javascript: jsStarter('digits', '  // ваш код\n  return []'),
      typescript: jsStarter('digits', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'без переноса',
        input: '[1, 2, 3]',
        expected: '[1, 2, 4]',
        assertion: 'assertDeepEqual(candidate([1, 2, 3]), [1, 2, 4])',
      },
      {
        title: 'перенос через все разряды',
        input: '[9, 9]',
        expected: '[1, 0, 0]',
        assertion: 'assertDeepEqual(candidate([9, 9]), [1, 0, 0])',
      },
      {
        title: 'ноль',
        input: '[0]',
        expected: '[1]',
        assertion: 'assertDeepEqual(candidate([0]), [1])',
      },
      {
        title: 'перенос в середине',
        input: '[8, 9, 9]',
        expected: '[9, 0, 0]',
        assertion: 'assertDeepEqual(candidate([8, 9, 9]), [9, 0, 0])',
      },
    ],
    solutionNotes: [
      'Идите с конца массива: прибавьте 1, цифра 10 превращается в 0 с переносом.',
      'Если перенос дошёл до начала — добавьте 1 в начало массива.',
      'Как только переноса нет — можно выходить из цикла.',
    ],
  },
  {
    id: 'lc-pow-x-n',
    slug: 'pow-x-n',
    title: 'Быстрое возведение в степень',
    category: 'Math',
    difficulty: 'medium',
    companies: ['Facebook', 'Yandex'],
    successRate: 50,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Реализуйте возведение числа x в целую степень n без встроенных функций возведения в степень. Степень может быть отрицательной. Ожидаемая сложность — O(log n) (бинарное возведение в степень).',
    constraints: [
      'нельзя использовать встроенное возведение в степень',
      'n может быть отрицательным: x^(-n) = 1 / x^n',
      'ожидаемая сложность O(log n) — линейный цикл или глубокая рекурсия не подойдут для больших n',
    ],
    examples: [
      {
        input: 'solution(2, 10)',
        output: '1024',
      },
      {
        input: 'solution(2, -2)',
        output: '0.25',
      },
    ],
    starterCode: {
      javascript: jsStarter('x, n', '  // ваш код\n  return 1'),
      typescript: jsStarter('x, n', '  // ваш код\n  return 1'),
    },
    tests: [
      {
        title: 'положительная степень',
        input: '2, 10',
        expected: '1024',
        assertion: 'assertDeepEqual(candidate(2, 10), 1024)',
      },
      {
        title: 'отрицательная степень',
        input: '2, -2',
        expected: '0.25',
        assertion: 'assertDeepEqual(candidate(2, -2), 0.25)',
      },
      {
        title: 'отрицательное основание',
        input: '-2, 3',
        expected: '-8',
        assertion: 'assertDeepEqual(candidate(-2, 3), -8)',
      },
      {
        title: 'нечётная степень побольше',
        input: '3, 13',
        expected: '1594323',
        assertion: 'assertDeepEqual(candidate(3, 13), 1594323)',
      },
      {
        title: 'огромная степень единицы',
        input: '1, 1000000',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(1, 1000000), 1)',
      },
    ],
    solutionNotes: [
      'Бинарное возведение: x^n = (x^(n/2))² для чётных n, и x * x^(n-1) для нечётных.',
      'Итеративно: пока n > 0 — если младший бит 1, домножайте результат; затем возводите x в квадрат и сдвигайте n.',
      'Отрицательную степень сведите к положительной: x = 1 / x, n = -n.',
    ],
  },
  {
    id: 'lc-excel-column-title',
    slug: 'excel-column-title',
    title: 'Имя колонки Excel',
    category: 'Math',
    difficulty: 'medium',
    companies: ['Microsoft', 'Sber'],
    successRate: 48,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дан номер колонки таблицы (начиная с 1). Верните её буквенное имя, как в Excel: 1 → A, 26 → Z, 27 → AA, 28 → AB. Это «биективная» 26-ричная система — в ней нет нуля.',
    constraints: [
      'номер колонки — положительное целое число',
      'обычный перевод в 26-ричную систему не сработает из-за отсутствия нуля',
      'подсказка: вычитайте единицу перед взятием остатка',
    ],
    examples: [
      {
        input: 'solution(28)',
        output: "'AB'",
      },
      {
        input: 'solution(701)',
        output: "'ZY'",
      },
    ],
    starterCode: {
      javascript: jsStarter('columnNumber', "  // ваш код\n  return ''"),
      typescript: jsStarter('columnNumber', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'одна буква',
        input: '1 и 26',
        expected: "'A' и 'Z'",
        assertion:
          "assertDeepEqual(candidate(1), 'A'); assertDeepEqual(candidate(26), 'Z')",
      },
      {
        title: 'две буквы',
        input: '28',
        expected: "'AB'",
        assertion: "assertDeepEqual(candidate(28), 'AB')",
      },
      {
        title: 'граница диапазона',
        input: '52 и 701',
        expected: "'AZ' и 'ZY'",
        assertion:
          "assertDeepEqual(candidate(52), 'AZ'); assertDeepEqual(candidate(701), 'ZY')",
      },
    ],
    solutionNotes: [
      'На каждом шаге: n -= 1, остаток n % 26 даёт букву, затем n = floor(n / 26).',
      'Буквы появляются с конца — собирайте строку в обратном порядке.',
      'Вычитание единицы и есть трюк биективной системы счисления.',
    ],
  },
  {
    id: 'lc-trailing-zeroes',
    slug: 'trailing-zeroes',
    title: 'Нули в конце факториала',
    category: 'Math',
    difficulty: 'medium',
    companies: ['Bloomberg', 'Tinkoff'],
    successRate: 47,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дано число n. Посчитайте, сколькими нулями заканчивается n! (факториал). Вычислять сам факториал нельзя — он переполнит любой числовой тип уже при небольших n.',
    constraints: [
      'нельзя вычислять факториал напрямую',
      'ожидаемая сложность O(log n)',
      'подсказка: ноль в конце даёт каждая пара множителей 2 × 5',
    ],
    examples: [
      {
        input: 'solution(5)',
        output: '1',
        explanation: '5! = 120 — один ноль в конце.',
      },
      {
        input: 'solution(25)',
        output: '6',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'маленькие числа',
        input: '3 и 5',
        expected: '0 и 1',
        assertion:
          'assertDeepEqual(candidate(3), 0); assertDeepEqual(candidate(5), 1)',
      },
      {
        title: 'кратные 25 дают дополнительные пятёрки',
        input: '25',
        expected: '6',
        assertion: 'assertDeepEqual(candidate(25), 6)',
      },
      {
        title: 'сто',
        input: '100',
        expected: '24',
        assertion: 'assertDeepEqual(candidate(100), 24)',
      },
      {
        title: 'ноль',
        input: '0',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(0), 0)',
      },
    ],
    solutionNotes: [
      'Двоек в разложении факториала всегда больше, чем пятёрок, — считайте пятёрки.',
      'Количество пятёрок: floor(n/5) + floor(n/25) + floor(n/125) + …',
      'Цикл: пока n > 0 — n = floor(n / 5), прибавляйте n к ответу.',
    ],
  },
  {
    id: 'lc-integer-to-roman',
    slug: 'integer-to-roman',
    title: 'Число в римские цифры',
    category: 'Math',
    difficulty: 'medium',
    companies: ['Amazon', 'Ozon'],
    successRate: 52,
    estimatedMinutes: 20,
    languages: ['javascript', 'typescript'],
    description:
      'Дано целое число от 1 до 3999. Преобразуйте его в римскую запись. Используются вычитающие пары: 4 = IV, 9 = IX, 40 = XL, 90 = XC, 400 = CD, 900 = CM.',
    constraints: [
      'число в диапазоне от 1 до 3999',
      'жадный подход: всегда берите наибольшее доступное значение',
      'не забудьте вычитающие пары (IV, IX, XL, XC, CD, CM)',
    ],
    examples: [
      {
        input: 'solution(3749)',
        output: "'MMMDCCXLIX'",
      },
    ],
    starterCode: {
      javascript: jsStarter('num', "  // ваш код\n  return ''"),
      typescript: jsStarter('num', "  // ваш код\n  return ''"),
    },
    tests: [
      {
        title: 'без вычитающих пар',
        input: '58',
        expected: "'LVIII'",
        assertion: "assertDeepEqual(candidate(58), 'LVIII')",
      },
      {
        title: 'девятка',
        input: '9',
        expected: "'IX'",
        assertion: "assertDeepEqual(candidate(9), 'IX')",
      },
      {
        title: 'несколько вычитающих пар',
        input: '1994',
        expected: "'MCMXCIV'",
        assertion: "assertDeepEqual(candidate(1994), 'MCMXCIV')",
      },
      {
        title: 'большое число',
        input: '3749',
        expected: "'MMMDCCXLIX'",
        assertion: "assertDeepEqual(candidate(3749), 'MMMDCCXLIX')",
      },
    ],
    solutionNotes: [
      'Заведите таблицу значений от больших к меньшим, включая пары: 1000-M, 900-CM, 500-D, 400-CD, …',
      'Жадно вычитайте наибольшее доступное значение, добавляя символы к результату.',
      'Цикл по таблице с while внутри — самое короткое решение.',
    ],
  },
  {
    id: 'lc-fibonacci',
    slug: 'fibonacci',
    title: 'Числа Фибоначчи',
    category: 'Recursion & Backtracking',
    difficulty: 'easy',
    companies: ['Codewars', 'VK'],
    successRate: 76,
    estimatedMinutes: 10,
    languages: ['javascript', 'typescript'],
    description:
      'Дано n. Верните n-е число Фибоначчи: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2). Наивная рекурсия растёт экспоненциально — для больших n понадобится мемоизация или итерация.',
    constraints: [
      'F(0) = 0, F(1) = 1',
      'n может быть до 35–40 — наивная рекурсия без кеша будет слишком медленной',
      'ожидаемая сложность O(n)',
    ],
    examples: [
      {
        input: 'solution(10)',
        output: '55',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'база рекурсии',
        input: '0 и 1',
        expected: '0 и 1',
        assertion:
          'assertDeepEqual(candidate(0), 0); assertDeepEqual(candidate(1), 1)',
      },
      {
        title: 'десятое число',
        input: '10',
        expected: '55',
        assertion: 'assertDeepEqual(candidate(10), 55)',
      },
      {
        title: 'большое n (нужна эффективность)',
        input: '35',
        expected: '9227465',
        assertion: 'assertDeepEqual(candidate(35), 9227465)',
      },
    ],
    solutionNotes: [
      'Итерация с двумя переменными — самое простое O(n) решение.',
      'Рекурсия с мемоизацией (кеш по n) тоже подходит.',
      'Наивная рекурсия делает ~2^n вызовов — на n = 35 это уже десятки миллионов.',
    ],
  },
  {
    id: 'lc-hanoi-moves',
    slug: 'hanoi-moves',
    title: 'Ханойская башня: число ходов',
    category: 'Recursion & Backtracking',
    difficulty: 'easy',
    companies: ['Codewars', 'Sber'],
    successRate: 70,
    estimatedMinutes: 12,
    languages: ['javascript', 'typescript'],
    description:
      'В головоломке «Ханойская башня» нужно перенести n дисков с одного стержня на другой, используя третий как вспомогательный; класть больший диск на меньший нельзя. Верните минимальное количество ходов для n дисков.',
    constraints: [
      'n — неотрицательное целое число',
      'для нуля дисков ответ 0',
      'выведите рекуррентную формулу: чтобы перенести n дисков, сначала перенесите n-1',
    ],
    examples: [
      {
        input: 'solution(3)',
        output: '7',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'один диск',
        input: '1',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(1), 1)',
      },
      {
        title: 'три диска',
        input: '3',
        expected: '7',
        assertion: 'assertDeepEqual(candidate(3), 7)',
      },
      {
        title: 'десять дисков',
        input: '10',
        expected: '1023',
        assertion: 'assertDeepEqual(candidate(10), 1023)',
      },
      {
        title: 'ноль дисков',
        input: '0',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(0), 0)',
      },
    ],
    solutionNotes: [
      'Рекуррентность: h(n) = 2 · h(n-1) + 1 — перенести n-1 наверх, переложить нижний, вернуть n-1.',
      'Замкнутая формула: 2^n - 1.',
      'Обе версии принимаются — рекурсивная иллюстрирует ход мысли.',
    ],
  },
  {
    id: 'lc-subsets',
    slug: 'subsets',
    title: 'Все подмножества',
    category: 'Recursion & Backtracking',
    difficulty: 'medium',
    companies: ['Neetcode', 'Facebook'],
    successRate: 52,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив уникальных чисел. Верните все его подмножества (включая пустое и сам массив). Порядок подмножеств в ответе не важен — тесты нормализуют его перед сравнением.',
    constraints: [
      'элементы уникальны',
      'всего подмножеств 2^n',
      'порядок подмножеств и элементов внутри не важен',
    ],
    examples: [
      {
        input: 'solution([1, 2, 3])',
        output: '[[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return [[]]'),
      typescript: jsStarter('nums', '  // ваш код\n  return [[]]'),
    },
    tests: [
      {
        title: 'три элемента',
        input: '[1, 2, 3]',
        expected: '8 подмножеств',
        assertion:
          "const norm = (list) => list.map((s) => [...s].sort((a, b) => a - b)).sort((a, b) => a.length - b.length || a.join(',').localeCompare(b.join(','))); assertDeepEqual(norm(candidate([1, 2, 3])), [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]])",
      },
      {
        title: 'один элемент',
        input: '[0]',
        expected: '[[], [0]]',
        assertion:
          'const norm = (list) => list.map((s) => [...s]).sort((a, b) => a.length - b.length); assertDeepEqual(norm(candidate([0])), [[], [0]])',
      },
      {
        title: 'количество для четырёх элементов',
        input: '[1, 2, 3, 4]',
        expected: '16',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4]).length, 16)',
      },
    ],
    solutionNotes: [
      'Бэктрекинг: на каждом шаге либо берёте текущий элемент, либо нет.',
      'Итеративно: начните с [[]] и для каждого числа добавляйте его копии ко всем существующим подмножествам.',
      'Битовые маски: каждое число от 0 до 2^n - 1 кодирует одно подмножество.',
    ],
  },
  {
    id: 'lc-permutations',
    slug: 'permutations',
    title: 'Все перестановки',
    category: 'Recursion & Backtracking',
    difficulty: 'medium',
    companies: ['Neetcode', 'Yandex'],
    successRate: 50,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дан массив уникальных чисел. Верните все его перестановки. Порядок перестановок в ответе не важен — тесты нормализуют его перед сравнением.',
    constraints: [
      'элементы уникальны',
      'всего перестановок n!',
      'порядок перестановок в ответе не важен',
    ],
    examples: [
      {
        input: 'solution([1, 2])',
        output: '[[1, 2], [2, 1]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('nums', '  // ваш код\n  return []'),
      typescript: jsStarter('nums', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'три элемента',
        input: '[1, 2, 3]',
        expected: '6 перестановок',
        assertion:
          "const norm = (list) => list.map((p) => p.join(',')).sort(); assertDeepEqual(norm(candidate([1, 2, 3])), ['1,2,3', '1,3,2', '2,1,3', '2,3,1', '3,1,2', '3,2,1'])",
      },
      {
        title: 'один элемент',
        input: '[1]',
        expected: '[[1]]',
        assertion: 'assertDeepEqual(candidate([1]), [[1]])',
      },
      {
        title: 'количество для четырёх элементов',
        input: '[1, 2, 3, 4]',
        expected: '24',
        assertion: 'assertDeepEqual(candidate([1, 2, 3, 4]).length, 24)',
      },
    ],
    solutionNotes: [
      'Бэктрекинг: ведите текущий префикс и множество использованных элементов.',
      'На каждом уровне пробуйте каждый неиспользованный элемент, затем откатывайтесь.',
      'Рекурсия через «вставку» нового элемента во все позиции — альтернативный подход.',
    ],
  },
  {
    id: 'lc-combination-sum',
    slug: 'combination-sum',
    title: 'Комбинации с суммой',
    category: 'Recursion & Backtracking',
    difficulty: 'medium',
    companies: ['Neetcode', 'Amazon'],
    successRate: 46,
    estimatedMinutes: 30,
    languages: ['javascript', 'typescript'],
    description:
      'Даны уникальные положительные числа candidates и цель target. Найдите все уникальные комбинации, сумма которых равна target. Каждое число можно использовать неограниченное число раз. Порядок комбинаций не важен — тесты нормализуют его.',
    constraints: [
      'каждое число можно брать многократно',
      'комбинации не должны повторяться (с точностью до порядка элементов)',
      'если комбинаций нет — верните пустой массив',
    ],
    examples: [
      {
        input: 'solution([2, 3, 6, 7], 7)',
        output: '[[7], [2, 2, 3]]',
      },
    ],
    starterCode: {
      javascript: jsStarter('candidates, target', '  // ваш код\n  return []'),
      typescript: jsStarter('candidates, target', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'классический пример',
        input: '[2, 3, 6, 7], 7',
        expected: '[[7], [2, 2, 3]]',
        assertion:
          "const norm = (list) => list.map((c) => [...c].sort((a, b) => a - b)).sort((a, b) => a.length - b.length || a.join(',').localeCompare(b.join(','))); assertDeepEqual(norm(candidate([2, 3, 6, 7], 7)), [[7], [2, 2, 3]])",
      },
      {
        title: 'несколько комбинаций',
        input: '[2, 3, 5], 8',
        expected: '[[3, 5], [2, 3, 3], [2, 2, 2, 2]]',
        assertion:
          "const norm = (list) => list.map((c) => [...c].sort((a, b) => a - b)).sort((a, b) => a.length - b.length || a.join(',').localeCompare(b.join(','))); assertDeepEqual(norm(candidate([2, 3, 5], 8)), [[3, 5], [2, 3, 3], [2, 2, 2, 2]])",
      },
      {
        title: 'решений нет',
        input: '[2], 1',
        expected: '[]',
        assertion: 'assertDeepEqual(candidate([2], 1), [])',
      },
    ],
    solutionNotes: [
      'Бэктрекинг с параметром «с какого индекса можно брать» — так исключаются дубликаты-перестановки.',
      'Беря элемент повторно, не сдвигайте индекс; переходя к следующему — сдвигайте.',
      'Отсекайте ветки, где остаток стал отрицательным.',
    ],
  },
  {
    id: 'lc-generate-parentheses',
    slug: 'generate-parentheses',
    title: 'Генерация скобочных последовательностей',
    category: 'Recursion & Backtracking',
    difficulty: 'medium',
    companies: ['Neetcode', 'Google'],
    successRate: 48,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дано число n. Сгенерируйте все корректные скобочные последовательности из n пар круглых скобок. Порядок строк в ответе не важен — тесты сортируют его.',
    constraints: [
      'каждая последовательность содержит ровно n открывающих и n закрывающих скобок',
      'последовательность корректна: каждая закрывающая скобка имеет пару',
      'количество последовательностей — числа Каталана',
    ],
    examples: [
      {
        input: 'solution(3)',
        output: "['((()))', '(()())', '(())()', '()(())', '()()()']",
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return []'),
      typescript: jsStarter('n', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'три пары',
        input: '3',
        expected: '5 последовательностей',
        assertion:
          "assertDeepEqual([...candidate(3)].sort(), ['((()))', '(()())', '(())()', '()(())', '()()()'])",
      },
      {
        title: 'одна пара',
        input: '1',
        expected: "['()']",
        assertion: "assertDeepEqual(candidate(1), ['()'])",
      },
      {
        title: 'количество для четырёх пар',
        input: '4',
        expected: '14',
        assertion: 'assertDeepEqual(candidate(4).length, 14)',
      },
    ],
    solutionNotes: [
      'Рекурсия с двумя счётчиками: open и close.',
      'Открывающую можно ставить, пока open < n; закрывающую — пока close < open.',
      'Когда длина строки достигла 2n — добавьте её в ответ.',
    ],
  },
  {
    id: 'lc-letter-combinations',
    slug: 'letter-combinations',
    title: 'Буквенные комбинации номера',
    category: 'Recursion & Backtracking',
    difficulty: 'medium',
    companies: ['Facebook', 'Tinkoff'],
    successRate: 50,
    estimatedMinutes: 25,
    languages: ['javascript', 'typescript'],
    description:
      'Дана строка из цифр 2–9. На кнопочном телефоне каждой цифре соответствуют буквы: 2 — abc, 3 — def, 4 — ghi, 5 — jkl, 6 — mno, 7 — pqrs, 8 — tuv, 9 — wxyz. Верните все возможные буквенные комбинации. Порядок не важен — тесты сортируют ответ.',
    constraints: [
      'строка содержит только цифры от 2 до 9',
      'пустая строка даёт пустой массив',
      'количество комбинаций — произведение количеств букв',
    ],
    examples: [
      {
        input: "solution('23')",
        output: "['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']",
      },
    ],
    starterCode: {
      javascript: jsStarter('digits', '  // ваш код\n  return []'),
      typescript: jsStarter('digits', '  // ваш код\n  return []'),
    },
    tests: [
      {
        title: 'две цифры',
        input: "'23'",
        expected: '9 комбинаций',
        assertion:
          "assertDeepEqual([...candidate('23')].sort(), ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'])",
      },
      {
        title: 'пустая строка',
        input: "''",
        expected: '[]',
        assertion: "assertDeepEqual(candidate(''), [])",
      },
      {
        title: 'цифра с четырьмя буквами',
        input: "'7'",
        expected: "['p', 'q', 'r', 's']",
        assertion: "assertDeepEqual([...candidate('7')].sort(), ['p', 'q', 'r', 's'])",
      },
    ],
    solutionNotes: [
      'Держите таблицу цифра → буквы.',
      'Рекурсия по позиции в строке: для каждой буквы текущей цифры спускайтесь дальше.',
      'Итеративно: начинайте с [""] и на каждую цифру «перемножайте» список на её буквы.',
    ],
  },
  {
    id: 'lc-n-queens-count',
    slug: 'n-queens-count',
    title: 'Сколько расстановок N ферзей',
    category: 'Recursion & Backtracking',
    difficulty: 'hard',
    companies: ['Google', 'Yandex'],
    successRate: 32,
    estimatedMinutes: 40,
    languages: ['javascript', 'typescript'],
    description:
      'Дано число n. Посчитайте, сколькими способами можно расставить n ферзей на доске n × n так, чтобы никакие два не били друг друга (ферзь бьёт по горизонтали, вертикали и диагоналям).',
    constraints: [
      'в каждой строке стоит ровно один ферзь',
      'ожидаемое решение — бэктрекинг по строкам',
      'для n = 8 ответ должен считаться за доли секунды',
    ],
    examples: [
      {
        input: 'solution(4)',
        output: '2',
      },
      {
        input: 'solution(8)',
        output: '92',
      },
    ],
    starterCode: {
      javascript: jsStarter('n', '  // ваш код\n  return 0'),
      typescript: jsStarter('n', '  // ваш код\n  return 0'),
    },
    tests: [
      {
        title: 'тривиальный случай',
        input: '1',
        expected: '1',
        assertion: 'assertDeepEqual(candidate(1), 1)',
      },
      {
        title: 'решений нет',
        input: '2',
        expected: '0',
        assertion: 'assertDeepEqual(candidate(2), 0)',
      },
      {
        title: 'классическая доска 4×4',
        input: '4',
        expected: '2',
        assertion: 'assertDeepEqual(candidate(4), 2)',
      },
      {
        title: 'шахматная доска 8×8',
        input: '8',
        expected: '92',
        assertion: 'assertDeepEqual(candidate(8), 92)',
      },
    ],
    solutionNotes: [
      'Ставьте ферзей по строкам: в строке row перебирайте столбцы.',
      'Конфликты отслеживайте тремя множествами: столбцы, диагонали row+col и row-col.',
      'Поставили — добавили в множества, спустились на строку ниже, затем откатились.',
    ],
  },
]
