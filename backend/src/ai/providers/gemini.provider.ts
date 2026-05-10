import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildQuizPrompt, QUIZ_SYSTEM_PROMPT } from '../prompts/quiz.prompts';
import {
  ChatCompletionOptions,
  ChatMessage,
  GeneratedQuestion,
  IAiProvider,
} from './ai-provider.interface';

/**
 * Gemini provider for the assistant.
 * The API key must live only on the backend.
 */
@Injectable()
export class GeminiProvider implements IAiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private readonly requestTimeoutMs = 30_000;

  constructor(private configService: ConfigService) {
    this.apiKey = (this.configService.get<string>('ai.geminiApiKey') ?? '').trim();
    this.model = this.configService.get<string>('ai.geminiModel') ?? 'gemini-2.5-flash-lite';
  }

  async chat(options: ChatCompletionOptions): Promise<string> {
    const contents = this.toGeminiContents(options.messages);
    if (contents.length === 0) {
      throw new BadGatewayException('Не удалось подготовить запрос к ассистенту.');
    }

    const body: GeminiRequest = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 1024,
      },
    };

    if (options.systemPrompt) {
      body.systemInstruction = {
        parts: [{ text: options.systemPrompt }],
      };
    }

    const data = await this.generateContent(body);
    return this.extractText(data);
  }

  async generateQuizQuestions(
    topic: string,
    count: number,
    difficulty: string = 'junior',
  ): Promise<GeneratedQuestion[]> {
    const prompt = `${QUIZ_SYSTEM_PROMPT}\n\n${buildQuizPrompt(topic, count, difficulty)}`;
    const data = await this.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });

    const text = this.extractText(data);
    return this.normalizeQuestions(this.parseQuestionJson(text), count);
  }

  private toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
    const contents = messages
      .filter((message) => message.role !== 'system')
      .filter((message) => message.content.trim().length > 0)
      .map(
        (message): GeminiContent => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        }),
      );

    while (contents[0]?.role === 'model') {
      contents.shift();
    }

    return contents;
  }

  private async generateContent(body: GeminiRequest): Promise<GeminiResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        'Ассистент временно недоступен: не настроен GEMINI_API_KEY.',
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/${this.getModelPath()}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      const error = err as Error;
      this.logger.error('Gemini network error', error);
      if (error.name === 'AbortError') {
        throw new BadGatewayException('Ассистент не успел ответить. Попробуйте ещё раз.');
      }
      throw new BadGatewayException('Не удалось получить ответ ассистента. Попробуйте ещё раз.');
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 429) {
      throw new HttpException(
        'Сейчас превышен лимит запросов к ассистенту. Попробуйте позже.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (response.status === 401 || response.status === 403) {
      const errorText = await response.text().catch(() => '');
      this.logger.error(`Gemini auth error ${response.status}: ${errorText}`);
      throw new ServiceUnavailableException(
        'Ассистент временно недоступен: проверьте GEMINI_API_KEY.',
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      this.logger.error(`Gemini API ${response.status}: ${errorText}`);
      throw new BadGatewayException('Не удалось получить ответ ассистента. Попробуйте ещё раз.');
    }

    return (await response.json()) as GeminiResponse;
  }

  private extractText(data: GeminiResponse): string {
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter((part): part is string => Boolean(part?.trim()))
      .join('\n')
      .trim();

    if (!text) {
      const reason =
        data.promptFeedback?.blockReason || data.candidates?.[0]?.finishReason || 'empty';
      this.logger.warn(`Gemini returned no text: ${reason}`);
      throw new BadGatewayException(
        'Ассистент вернул пустой ответ. Попробуйте переформулировать вопрос.',
      );
    }

    return text;
  }

  private parseQuestionJson(text: string): unknown {
    const withoutFence = text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '');

    try {
      const parsed = JSON.parse(withoutFence);
      return Array.isArray(parsed) ? parsed : parsed.questions;
    } catch {
      const match = withoutFence.match(/\[[\s\S]*\]/);
      if (!match) {
        throw new BadGatewayException('Не удалось распарсить ответ ассистента с вопросами.');
      }
      try {
        return JSON.parse(match[0]);
      } catch {
        throw new BadGatewayException('Не удалось распарсить ответ ассистента с вопросами.');
      }
    }
  }

  private normalizeQuestions(value: unknown, count: number): GeneratedQuestion[] {
    if (!Array.isArray(value)) {
      throw new BadGatewayException('Ассистент вернул вопросы в неверном формате.');
    }

    return value.slice(0, count).map((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new BadGatewayException(`Ассистент вернул некорректный вопрос №${index + 1}.`);
      }

      const question = item as Partial<GeneratedQuestion>;
      const options = Array.isArray(question.options)
        ? question.options.map((option) => String(option).trim())
        : [];
      const correctAnswerIndex = Number(question.correctAnswerIndex);

      if (
        typeof question.text !== 'string' ||
        !question.text.trim() ||
        options.length !== 4 ||
        options.some((option) => !option) ||
        !Number.isInteger(correctAnswerIndex) ||
        correctAnswerIndex < 0 ||
        correctAnswerIndex >= options.length ||
        typeof question.explanation !== 'string' ||
        !question.explanation.trim()
      ) {
        throw new BadGatewayException(`Ассистент вернул некорректный вопрос №${index + 1}.`);
      }

      return {
        text: question.text.trim(),
        options,
        correctAnswerIndex,
        explanation: question.explanation.trim(),
      };
    });
  }

  private getModelPath(): string {
    const normalizedModel = this.model.trim() || 'gemini-2.5-flash-lite';
    return normalizedModel.startsWith('models/') ? normalizedModel : `models/${normalizedModel}`;
  }
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: { text: string }[];
  };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}
