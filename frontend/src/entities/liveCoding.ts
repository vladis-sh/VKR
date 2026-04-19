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
  isNew?: boolean
  isPremium?: boolean
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
      'Верните новую структуру, удалив из объектов и массивов значения null, undefined, false, пустую строку и NaN. Вложенность может быть произвольной.',
    constraints: [
      'исходный объект нельзя мутировать',
      '0 должен сохраняться',
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
        expected: '{ a: 1, c: { e: 0 } }',
        assertion:
          "assertDeepEqual(candidate({ a: 1, b: null, c: { d: '', e: 0, f: false } }), { a: 1, c: { e: 0 } })",
      },
      {
        title: 'чистит массивы',
        input: '[1, null, 0, false, [2, undefined, 3]]',
        expected: '[1, 0, [2, 3]]',
        assertion:
          'assertDeepEqual(candidate([1, null, 0, false, [2, undefined, 3]]), [1, 0, [2, 3]])',
      },
      {
        title: 'удаляет NaN',
        input: '{ a: NaN, b: "ok" }',
        expected: '{ b: "ok" }',
        assertion: "assertDeepEqual(candidate({ a: NaN, b: 'ok' }), { b: 'ok' })",
      },
    ],
    solutionNotes: [
      'Сначала определите предикат пустого значения.',
      'Для массивов удобно делать map рекурсивно, затем filter.',
      'Для объектов используйте Object.entries и собирайте новый объект.',
    ],
  },
  {
    id: 'lc-parse-query',
    slug: 'parse-query-string',
    title: 'Парсер query string',
    category: 'Browser',
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
    isPremium: true,
    description:
      'Преобразуйте ключи объекта из snake_case и kebab-case в camelCase во всей вложенной структуре.',
    constraints: [
      'массивы нужно обходить рекурсивно',
      'значения Date и null нужно вернуть как есть',
      'исходный объект нельзя мутировать',
    ],
    examples: [
      {
        input: 'solution({ user_id: 1, user_name: "Ada" })',
        output: '{ userId: 1, userName: "Ada" }',
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
    ],
    solutionNotes: [
      'Разделите строку ключа по _ и -.',
      'Первый сегмент оставьте как есть, остальные капитализируйте.',
      'Рекурсивно обрабатывайте массивы и plain objects.',
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
    id: 'lc-promise-pool',
    slug: 'promise-pool',
    title: 'Promise pool с лимитом',
    category: 'Async',
    difficulty: 'hard',
    companies: ['BFE', 'Yandex', 'Avito'],
    successRate: 27,
    estimatedMinutes: 45,
    languages: ['javascript', 'typescript'],
    isPremium: true,
    description:
      'Реализуйте выполнение асинхронных задач с ограничением параллелизма. Результаты должны идти в исходном порядке задач.',
    constraints: [
      'limit всегда больше 0',
      'если задача падает, итоговый Promise должен reject с этой ошибкой',
      'порядок результатов должен совпадать с порядком входных задач',
    ],
    examples: [
      {
        input: 'await solution([task1, task2, task3], 2)',
        output: '[result1, result2, result3]',
      },
    ],
    starterCode: {
      javascript: jsStarter('tasks, limit', '  // ваш код\n  return Promise.all(tasks.map((task) => task()))'),
      typescript: jsStarter('tasks, limit', '  // ваш код\n  return Promise.all(tasks.map((task) => task()))'),
    },
    tests: [
      {
        title: 'сохраняет порядок результатов',
        input: '3 async tasks, limit 2',
        expected: '[1, 2, 3]',
        assertion:
          "const tasks = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)]; const result = await candidate(tasks, 2); assertDeepEqual(result, [1, 2, 3])",
      },
      {
        title: 'не превышает лимит параллельности',
        input: '4 async tasks, limit 2',
        expected: 'max active = 2',
        assertion:
          "let active = 0; let maxActive = 0; const wait = () => new Promise((resolve) => setTimeout(resolve, 20)); const tasks = [0,1,2,3].map((value) => async () => { active += 1; maxActive = Math.max(maxActive, active); await wait(); active -= 1; return value; }); const result = await candidate(tasks, 2); assertDeepEqual(result, [0,1,2,3]); assertDeepEqual(maxActive <= 2, true)",
      },
    ],
    solutionNotes: [
      'Храните общий индекс следующей задачи.',
      'Запустите limit воркеров, каждый берёт следующую задачу и пишет результат по исходному индексу.',
      'Promise.all по воркерам даст завершение после всех задач.',
    ],
  },
]
