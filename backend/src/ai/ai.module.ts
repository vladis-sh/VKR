import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { DeepseekProvider } from './providers/deepseek.provider';

@Module({
  providers: [AiService, DeepseekProvider],
  exports: [AiService],
})
export class AiModule {}
