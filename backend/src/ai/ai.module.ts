import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { MockAiProvider } from './providers/mock.provider';
import { OllamaProvider } from './providers/ollama.provider';

@Module({
  providers: [AiService, MockAiProvider, OllamaProvider],
  exports: [AiService],
})
export class AiModule {}
