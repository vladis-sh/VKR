/**
 * Lightweight pre-LLM topic check.
 *
 * Strategy: low-false-positive blacklist. The system prompt on the model side
 * is the primary gate; this filter only short-circuits obviously non-IT
 * questions so we do not spend API quota on them.
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
  'выбор',
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
  'секс ',
  'нарко',
  'алког',
  'крипт',
  'инвести',
  'трейд',
  'акци ',
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
];

export interface TopicCheckOptions {
  /** Whether the session already has prior messages. */
  hasHistory: boolean;
}

export interface TopicCheckResult {
  allowed: boolean;
  /** Why the message was blocked. Free-form, used for logs only. */
  reason?: string;
}

export function checkAssistantTopic(
  message: string,
  options: TopicCheckOptions = { hasHistory: false },
): TopicCheckResult {
  const trimmed = message.trim().toLowerCase();
  if (!trimmed) return { allowed: false, reason: 'empty' };

  // Short follow-ups in an existing conversation rely on prior context.
  if (options.hasHistory && trimmed.length <= 40) {
    return { allowed: true };
  }

  const isOffTopic = OFF_TOPIC_KEYWORDS.some((keyword) => trimmed.includes(keyword));
  if (!isOffTopic) {
    return { allowed: true };
  }

  const hasTechSignal = TECH_HINTS.some((keyword) => trimmed.includes(keyword));
  if (hasTechSignal) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'off_topic' };
}

export const OFF_TOPIC_REPLY =
  'Я могу помочь только с вопросами по подготовке к техническим собеседованиям. ' +
  'Задайте вопрос по программированию, алгоритмам, frontend, backend или архитектуре.';
