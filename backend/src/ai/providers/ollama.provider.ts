import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAiProvider, ChatCompletionOptions, GeneratedQuestion } from './ai-provider.interface';

@Injectable()
export class OllamaProvider implements IAiProvider {
  private readonly logger = new Logger(OllamaProvider.name);
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = configService.get<string>('ai.ollamaBaseUrl') || 'http://localhost:11434';
    this.model = configService.get<string>('ai.ollamaModel') || 'llama3';
  }

  async chat(options: ChatCompletionOptions): Promise<string> {
    const messages = options.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    if (options.systemPrompt) {
      messages.unshift({ role: 'system', content: options.systemPrompt });
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            num_predict: options.maxTokens || 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      return data.message?.content || '';
    } catch (error) {
      this.logger.error('Ollama chat error:', error);
      throw new Error('AI service unavailable. Please check Ollama is running.');
    }
  }

  async generateQuizQuestions(
    topic: string,
    count: number,
    difficulty: string = 'junior',
  ): Promise<GeneratedQuestion[]> {
    const difficultyMap = {
      junior: 'начального уровня (junior)',
      middle: 'среднего уровня (middle)',
      senior: 'продвинутого уровня (senior)',
    };

    const prompt = `Сгенерируй ${count} вопросов для технического собеседования по теме "${topic}" ${difficultyMap[difficulty] || difficultyMap.junior}.

Верни ответ ТОЛЬКО в виде JSON массива без дополнительного текста:
[
  {
    "text": "Текст вопроса",
    "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
    "correctAnswerIndex": 0,
    "explanation": "Подробное объяснение правильного ответа"
  }
]

Требования:
- Каждый вопрос должен иметь ровно 4 варианта ответа
- correctAnswerIndex — индекс правильного ответа (0-3)
- Вопросы должны быть технически корректными
- Объяснения должны быть информативными (2-4 предложения)
- Вопросы на русском языке`;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: { temperature: 0.3 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      const text = data.response || '';

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from Ollama response');
      }

      const questions = JSON.parse(jsonMatch[0]) as GeneratedQuestion[];
      return questions.slice(0, count);
    } catch (error) {
      this.logger.error('Ollama generate questions error:', error);
      throw new Error('Failed to generate questions. Please check Ollama is running.');
    }
  }
}
