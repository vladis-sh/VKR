import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryQuestionsDto {
  @ApiPropertyOptional({ description: 'Filter by topic' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ default: 10, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: ['junior', 'middle', 'senior'] })
  @IsOptional()
  @IsIn(['junior', 'middle', 'senior'])
  difficulty?: string;
}

export class CreateTestSessionDto {
  @ApiProperty({ enum: ['topic', 'time_attack', 'one_mistake', 'ai_generated'] })
  @IsIn(['topic', 'time_attack', 'one_mistake', 'ai_generated'])
  mode: string;

  @ApiPropertyOptional({ example: 'JavaScript' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ description: 'Time limit in seconds' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  timeLimit?: number;
}

export class AnswerDto {
  @ApiProperty()
  @IsString()
  questionId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(3)
  selectedAnswerIndex: number;
}

export class CompleteTestSessionDto {
  @ApiProperty({ type: [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @ApiProperty({ description: 'Duration in seconds' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  durationSeconds: number;
}

export class QueryAiQuestionsDto {
  @ApiPropertyOptional({ description: 'Topic for AI-generated questions' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ default: 5, maximum: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  count?: number = 5;

  @ApiPropertyOptional({ enum: ['junior', 'middle', 'senior'] })
  @IsOptional()
  @IsIn(['junior', 'middle', 'senior'])
  difficulty?: string;
}
