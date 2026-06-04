import { Injectable } from '@nestjs/common';
import { ChatCompletionOptions, GeneratedQuestion } from './providers/ai-provider.interface';
import { DeepseekProvider } from './providers/deepseek.provider';
import { getChatSystemPrompt } from './prompts/chat.prompts';

@Injectable()
export class AiService {
  constructor(private readonly provider: DeepseekProvider) {}

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
