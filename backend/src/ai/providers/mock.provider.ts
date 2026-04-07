import { Injectable } from '@nestjs/common';
import { IAiProvider, ChatCompletionOptions, GeneratedQuestion } from './ai-provider.interface';

const mockChatResponses = {
  hr: [
    'Расскажите мне о себе. Как вы пришли в профессию разработчика и что вас в ней привлекает больше всего?',
    'Опишите ситуацию, когда вам пришлось работать в условиях жёстких дедлайнов. Как вы справились?',
    'Расскажите о вашем опыте работы в команде. Какую роль вы обычно берёте на себя?',
    'Почему вы хотите работать именно в нашей компании? Что вы знаете о нас?',
    'Как вы относитесь к критике своего кода? Приведите пример получения и применения фидбека.',
    'Где вы видите себя через 3-5 лет в профессиональном плане?',
    'Расскажите о самом сложном проекте в вашей карьере. Какие уроки вы извлекли?',
    'Как вы поддерживаете актуальность своих знаний? Какие ресурсы используете для обучения?',
  ],
  technical: [
    'Объясните разницу между REST и GraphQL. В каких случаях вы бы выбрали каждый из них?',
    'Расскажите о вашем опыте с React. Как вы оптимизируете производительность компонентов?',
    'Что такое замыкания в JavaScript и как они используются на практике? Приведите реальный пример.',
    'Объясните принцип работы event loop в Node.js. Как это влияет на написание асинхронного кода?',
    'Что такое индексы в базах данных? Когда они помогают и когда могут навредить?',
    'Расскажите о паттернах проектирования, которые вы используете. Приведите конкретные примеры из практики.',
    'Как вы обеспечиваете безопасность веб-приложений? Какие угрозы OWASP Top 10 вам известны?',
    'Объясните разницу между микросервисной и монолитной архитектурой. Как выбрать подходящую?',
  ],
  algorithms: [
    'Реализуйте функцию поиска двух чисел в массиве, сумма которых равна target. Какова сложность вашего решения?',
    'Объясните алгоритм быстрой сортировки. Напишите его реализацию на JavaScript.',
    'Что такое Dynamic Programming? Решите задачу вычисления n-го числа Фибоначчи с мемоизацией.',
    'Реализуйте обход бинарного дерева в ширину (BFS). Объясните использование очереди.',
    'Задача: дан массив целых чисел, найдите максимальную сумму непрерывного подмассива. Алгоритм Кадане.',
    'Объясните разницу между хеш-таблицей и бинарным деревом поиска. Когда использовать каждое?',
    'Реализуйте функцию проверки, является ли строка палиндромом. Оптимизируйте до O(1) памяти.',
    'Что такое граф? Реализуйте DFS для поиска пути между двумя вершинами.',
  ],
  default: [
    'Это хороший вопрос! Давайте разберём его детально. Можете уточнить, какой аспект вас интересует больше всего?',
    'Интересная тема! Я готов помочь с подготовкой к собеседованию. Что именно вы хотите отработать?',
    'Давайте подойдём к этому систематически. Начнём с базовых концепций и перейдём к более сложным.',
    'Отличный вопрос для подготовки! На реальных собеседованиях это спрашивают часто. Разберём подробно.',
  ],
};

const mockFollowUpResponses = [
  'Хороший ответ! Давайте углубимся в детали. Можете привести конкретный пример из вашего опыта?',
  'Интересно. Теперь расскажите, как бы вы применили это в реальном проекте?',
  'Правильно мыслите! Дополнительный вопрос: как это работает в контексте производительности?',
  'Неплохо! Однако на собеседовании стоит упомянуть также... Как вы думаете, что я имею в виду?',
  'Хорошо! Теперь более сложный вопрос по этой же теме: как обработать граничные случаи?',
  'Верно! Ещё один аспект, который часто спрашивают: как это влияет на тестируемость кода?',
];

@Injectable()
export class MockAiProvider implements IAiProvider {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async chat(options: ChatCompletionOptions): Promise<string> {
    await this.delay(500);

    const lastMessage = options.messages[options.messages.length - 1];
    const isFirstMessage = options.messages.filter((m) => m.role === 'user').length === 1;

    // Determine role from system prompt
    let role = 'default';
    if (options.systemPrompt) {
      if (options.systemPrompt.includes('HR')) role = 'hr';
      else if (options.systemPrompt.includes('технический')) role = 'technical';
      else if (options.systemPrompt.includes('алгоритм')) role = 'algorithms';
    }

    if (isFirstMessage) {
      const responses = mockChatResponses[role] || mockChatResponses.default;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Check if the message contains a question to provide relevant follow-up
    const userContent = lastMessage.content.toLowerCase();
    if (
      userContent.includes('расскажи') ||
      userContent.includes('объясни') ||
      userContent.includes('что такое') ||
      userContent.includes('как работает')
    ) {
      const responses = mockChatResponses[role] || mockChatResponses.default;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return mockFollowUpResponses[Math.floor(Math.random() * mockFollowUpResponses.length)];
  }

  async generateQuizQuestions(
    topic: string,
    count: number,
    _difficulty: string = 'junior',
  ): Promise<GeneratedQuestion[]> {
    await this.delay(800);
    void _difficulty;

    const questionTemplates: Record<string, GeneratedQuestion[]> = {
      default: [
        {
          text: `Что является основным принципом объектно-ориентированного программирования применительно к теме "${topic}"?`,
          options: [
            'Инкапсуляция — скрытие внутренней реализации',
            'Процедурное программирование',
            'Использование только глобальных переменных',
            'Отсутствие классов и объектов',
          ],
          correctAnswerIndex: 0,
          explanation: `Инкапсуляция — один из ключевых принципов ООП, применяемый в ${topic}. Она позволяет скрыть детали реализации и предоставить чистый интерфейс для использования.`,
        },
        {
          text: `Какой паттерн проектирования наиболее подходит для решения задач в области "${topic}"?`,
          options: [
            'Observer (Наблюдатель)',
            'Singleton (Одиночка)',
            'Factory (Фабрика)',
            'Strategy (Стратегия)',
          ],
          correctAnswerIndex: 3,
          explanation: `Паттерн Strategy позволяет определять семейство алгоритмов, инкапсулировать каждый из них и делать их взаимозаменяемыми, что особенно полезно в контексте ${topic}.`,
        },
        {
          text: `Что из перечисленного НЕ является преимуществом использования TypeScript при работе с "${topic}"?`,
          options: [
            'Статическая типизация',
            'Более медленное выполнение в браузере',
            'Автодополнение в IDE',
            'Раннее обнаружение ошибок',
          ],
          correctAnswerIndex: 1,
          explanation: `TypeScript компилируется в обычный JavaScript, поэтому производительность в браузере практически не отличается. Основные преимущества TypeScript — это статическая типизация, лучший рефакторинг и обнаружение ошибок на этапе компиляции.`,
        },
        {
          text: `Какова временна́я сложность наиболее эффективного алгоритма для задач типа "${topic}"?`,
          options: ['O(n²)', 'O(n log n)', 'O(log n)', 'O(1)'],
          correctAnswerIndex: 1,
          explanation: `Для большинства задач этого типа оптимальная сложность составляет O(n log n). Это достигается использованием подхода "разделяй и властвуй" или сбалансированных структур данных.`,
        },
        {
          text: `Как правильно обработать ошибку в асинхронном коде при работе с "${topic}"?`,
          options: [
            'Игнорировать ошибки, они обрабатываются автоматически',
            'Использовать try/catch с async/await или .catch() для промисов',
            'Только callback-based обработка ошибок',
            'Использовать глобальный обработчик window.onerror',
          ],
          correctAnswerIndex: 1,
          explanation: `Правильная обработка ошибок в асинхронном коде требует использования try/catch блоков с async/await или метода .catch() для промисов. Необработанные ошибки могут привести к крашу приложения.`,
        },
      ],
    };

    const templates = questionTemplates[topic] || questionTemplates.default;

    const questions: GeneratedQuestion[] = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const template = templates[i % templates.length];
      questions.push({
        ...template,
        text: template.text,
      });
    }

    return questions;
  }
}
