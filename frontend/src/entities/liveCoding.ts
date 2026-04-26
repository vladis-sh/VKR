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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
    isNew: true,
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
]
