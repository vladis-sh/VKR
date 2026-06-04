/**
 * Lightweight pre-LLM topic check.
 *
 * Strategy: low-false-positive blacklist. The system prompt on the model side
 * is the primary gate; this filter only short-circuits obviously non-IT
 * questions so we do not spend API quota on them.
 *
 * Off-topic keywords are matched at a word boundary (the start of a word), so
 * "спорт" does not fire on "транспорт"/"паспорт" and "акци" does not fire on
 * "транзакция". Tech hints stay plain substring checks because a generous
 * rescue (fewer false blocks) is the safer direction.
 */
const OFF_TOPIC_KEYWORDS: string[] = [
  // Daily life / non-tech
  'рецепт',
  'погод',
  'гороскоп',
  'знакомств',
  'свидан',
  'любов',
  'президент',
  'политик',
  'голосован',
  'санкци',
  'война',
  'новост',
  'футбол',
  'хоккей',
  'баскетбол',
  'теннис',
  'спорт',
  'стих',
  'песн',
  'кино',
  'фильм',
  'сериал',
  'актёр',
  'актер',
  'похуд',
  'диет',
  'тренировк',
  'порн',
  'эрот',
  'секс',
  'нарко',
  'алког',
  // Finance / trading (note: cryptography is a valid topic, so block the
  // currency stem specifically rather than the broad "крипт").
  'криптовалют',
  'биткоин',
  'инвести',
  'трейд',
  'акци',
  // Medicine
  'медиц',
  'болезн',
  'лечен',
  'врач',
];

const TECH_HINTS: string[] = [
  // English tech
  'javascript',
  'typescript',
  ' js',
  ' ts',
  'react',
  'vue',
  'angular',
  'redux',
  'next.js',
  'nuxt',
  'svelte',
  'html',
  'css',
  'tailwind',
  'node',
  'nest',
  'express',
  'fastify',
  'java',
  'python',
  'kotlin',
  'docker',
  'kubernet',
  'nginx',
  'postgres',
  'mysql',
  'mongo',
  'redis',
  'rest',
  'graphql',
  'http',
  'tcp',
  'websocket',
  'oauth',
  'jwt',
  'git ',
  'github',
  'gitlab',
  'ci',
  'cd',
  'jenkins',
  'jest',
  'mocha',
  'cypress',
  'playwright',
  'solid',
  'sql',
  'orm',
  'api',
  'serializ',

  // Russian tech
  'код',
  'программ',
  'разработ',
  'фронт',
  'бэк',
  'бек',
  'сервер',
  'клиент',
  'браузер',
  'апи',
  'эндпоинт',
  'функц',
  'класс',
  'объект',
  'массив',
  'строк',
  'число',
  'тип',
  'перемен',
  'конста',
  'замык',
  'промис',
  'асинхрон',
  'синхрон',
  'поток',
  'процесс',
  'алгоритм',
  'структур',
  'сортиров',
  'поиск',
  'граф',
  'дерев',
  'хеш',
  'хэш',
  'стек',
  'очеред',
  'связн',
  'список',
  'битов',
  'паттерн',
  'архитектур',
  'микросервис',
  'монолит',
  'ооп',
  'наследов',
  'инкапс',
  'полиморф',
  'абстракц',
  'база данных',
  'бд',
  'индекс',
  'транзакц',
  'тест',
  'юнит',
  'интеграц',
  'собеседован',
  'интервью',
  'задач',
  'сериализ',
  'криптограф',
  'шифр',
];

export interface TopicCheckResult {
  allowed: boolean;
  /** Why the message was blocked. Free-form, used for logs only. */
  reason?: string;
}

const WORD_CHAR = /[\p{L}\p{N}_]/u;

/** A keyword matches only when it begins a word (start of string or after a non-letter). */
function includesAtWordStart(text: string, keyword: string): boolean {
  let from = 0;
  for (;;) {
    const index = text.indexOf(keyword, from);
    if (index === -1) return false;
    const prev = index > 0 ? text[index - 1] : undefined;
    if (!prev || !WORD_CHAR.test(prev)) return true;
    from = index + 1;
  }
}

export function checkAssistantTopic(message: string): TopicCheckResult {
  const trimmed = message.trim().toLowerCase();
  if (!trimmed) return { allowed: false, reason: 'empty' };

  const isOffTopic = OFF_TOPIC_KEYWORDS.some((keyword) => includesAtWordStart(trimmed, keyword));
  if (!isOffTopic) {
    return { allowed: true };
  }

  // An off-topic word may still belong to a technical question
  // (e.g. "сортировка спортивных результатов"), so rescue on any tech signal.
  const hasTechSignal = TECH_HINTS.some((keyword) => trimmed.includes(keyword));
  if (hasTechSignal) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'off_topic' };
}

export const OFF_TOPIC_REPLY =
  'Я могу помочь только с вопросами по подготовке к техническим собеседованиям. ' +
  'Задайте вопрос по программированию, алгоритмам, frontend, backend или архитектуре.';
