import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildQuizPrompt, QUIZ_SYSTEM_PROMPT } from '../prompts/quiz.prompts';
import { ChatCompletionOptions, GeneratedQuestion, IAiProvider } from './ai-provider.interface';

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
    const messages = options.messages.map((message) => ({
      role: message.role,
      content: message.content,
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

      const data = (await response.json()) as { message?: { content?: string } };
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
    const prompt = `${QUIZ_SYSTEM_PROMPT}\n\n${buildQuizPrompt(topic, count, difficulty)}`;

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

      const data = (await response.json()) as { response?: string };
      const text = data.response || '';

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
