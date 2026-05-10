import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAiProvider,
  ChatCompletionOptions,
  GeneratedQuestion,
} from './providers/ai-provider.interface';
import { MockAiProvider } from './providers/mock.provider';
import { OllamaProvider } from './providers/ollama.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { getChatSystemPrompt } from './prompts/chat.prompts';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private provider: IAiProvider;

  constructor(
    private configService: ConfigService,
    private mockProvider: MockAiProvider,
    private ollamaProvider: OllamaProvider,
    private geminiProvider: GeminiProvider,
  ) {
    const aiProviderType = (configService.get<string>('ai.provider') || 'mock').toLowerCase();
    this.logger.log(`Using AI provider: ${aiProviderType}`);

    if (aiProviderType === 'gemini') {
      this.provider = geminiProvider;
    } else if (aiProviderType === 'ollama') {
      this.provider = ollamaProvider;
    } else {
      if (aiProviderType !== 'mock') {
        this.logger.warn(`Unknown AI provider "${aiProviderType}", falling back to mock`);
      }
      this.provider = mockProvider;
    }
  }

  async chat(options: ChatCompletionOptions): Promise<string> {
    return this.provider.chat(options);
  }

  async chatWithRole(
    role: string,
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  ): Promise<string> {
    const systemPrompt = getChatSystemPrompt(role);
    return this.provider.chat({ messages, systemPrompt });
  }

  async generateQuizQuestions(
    topic: string,
    count: number,
    difficulty?: string,
  ): Promise<GeneratedQuestion[]> {
    return this.provider.generateQuizQuestions(topic, count, difficulty);
  }
}
