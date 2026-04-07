export const QUIZ_SYSTEM_PROMPT = `Ты генератор вопросов для технических собеседований.
Создавай качественные, технически корректные вопросы с 4 вариантами ответов.
Всегда отвечай только валидным JSON без дополнительного текста.`;

export function buildQuizPrompt(topic: string, count: number, difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    junior: 'начального (junior) — базовые концепции',
    middle: 'среднего (middle) — практическое применение',
    senior: 'продвинутого (senior) — глубокое понимание и edge cases',
  };

  return `Создай ${count} вопросов для собеседования по теме "${topic}" уровня ${difficultyMap[difficulty] || difficultyMap.junior}.

Верни JSON массив:
[
  {
    "text": "Текст вопроса",
    "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
    "correctAnswerIndex": 0,
    "explanation": "Детальное объяснение"
  }
]`;
}
