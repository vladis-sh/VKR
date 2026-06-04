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
 * DeepSeek provider for the assistant.
 * DeepSeek exposes an OpenAI-compatible Chat Completions API.
 * The API key must live only on the backend.
 */
@Injectable()
export class DeepseekProvider implements IAiProvider {
  private readonly logger = new Logger(DeepseekProvider.name);
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly requestTimeoutMs = 60_000;

  constructor(private configService: ConfigService) {
    this.apiKey = (this.configService.get<string>('ai.deepseekApiKey') ?? '').trim();
    this.model = (this.configService.get<string>('ai.deepseekModel') ?? 'deepseek-chat').trim();
    this.baseUrl = (
      this.configService.get<string>('ai.deepseekBaseUrl') ?? 'https://api.deepseek.com'
    )
      .trim()
      .replace(/\/+$/, '');
  }

  async chat(options: ChatCompletionOptions): Promise<string> {
    const messages = this.toOpenAiMessages(options.messages, options.systemPrompt);
    if (messages.length === 0) {
      throw new BadGatewayException('Не удалось подготовить запрос к ассистенту.');
    }

    const data = await this.createCompletion({
      model: this.model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: false,
    });

    return this.extractText(data);
  }

  async generateQuizQuestions(
    topic: string,
    count: number,
    difficulty: string = 'junior',
  ): Promise<GeneratedQuestion[]> {
    const data = await this.createCompletion({
      model: this.model,
      messages: [
        { role: 'system', content: QUIZ_SYSTEM_PROMPT },
        { role: 'user', content: buildQuizPrompt(topic, count, difficulty) },
      ],
      temperature: 0.2,
      max_tokens: 2048,
      stream: false,
      // DeepSeek requires the word "json" to appear in the prompt for this mode;
      // both QUIZ_SYSTEM_PROMPT and buildQuizPrompt mention JSON explicitly.
      response_format: { type: 'json_object' },
    });

    const text = this.extractText(data);
    return this.normalizeQuestions(this.parseQuestionJson(text), count);
  }

  private toOpenAiMessages(messages: ChatMessage[], systemPrompt?: string): OpenAiMessage[] {
    const result: OpenAiMessage[] = [];

    if (systemPrompt) {
      result.push({ role: 'system', content: systemPrompt });
    }

    for (const message of messages) {
      if (message.role === 'system') continue;
      if (!message.content.trim()) continue;
      result.push({ role: message.role, content: message.content });
    }

    return result;
  }

  private async createCompletion(body: DeepseekRequest): Promise<DeepseekResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        'Ассистент временно недоступен: не настроен ключ API.',
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      const error = err as Error;
      this.logger.error('DeepSeek network error', error);
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
      this.logger.error(`DeepSeek auth error ${response.status}: ${errorText}`);
      throw new ServiceUnavailableException(
        'Ассистент временно недоступен: проверьте ключ API.',
      );
    }

    if (response.status === 402) {
      // DeepSeek returns 402 Payment Required when the account balance is exhausted.
      const errorText = await response.text().catch(() => '');
      this.logger.error(`DeepSeek insufficient balance: ${errorText}`);
      throw new ServiceUnavailableException(
        'Ассистент временно недоступен: закончился баланс API.',
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      this.logger.error(`DeepSeek API ${response.status}: ${errorText}`);
      throw new BadGatewayException('Не удалось получить ответ ассистента. Попробуйте ещё раз.');
    }

    return (await response.json()) as DeepseekResponse;
  }

  private extractText(data: DeepseekResponse): string {
    const choice = data.choices?.[0];
    const text = choice?.message?.content?.trim();

    if (!text) {
      const reason = choice?.finish_reason || 'empty';
      this.logger.warn(`DeepSeek returned no text: ${reason}`);
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
      return Array.isArray(parsed) ? parsed : (parsed as { questions?: unknown }).questions;
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
}

interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepseekRequest {
  model: string;
  messages: OpenAiMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: false;
  response_format?: { type: 'json_object' | 'text' };
}

interface DeepseekResponse {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
}
