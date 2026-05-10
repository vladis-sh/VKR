import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { MockAiProvider } from './providers/mock.provider';
import { OllamaProvider } from './providers/ollama.provider';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  providers: [AiService, MockAiProvider, OllamaProvider, GeminiProvider],
  exports: [AiService],
})
export class AiModule {}
