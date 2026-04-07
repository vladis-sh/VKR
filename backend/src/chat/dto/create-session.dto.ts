import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @ApiPropertyOptional({ example: 'JavaScript Interview' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiProperty({ enum: ['hr', 'technical', 'algorithms'], default: 'technical' })
  @IsIn(['hr', 'technical', 'algorithms'])
  assistantRole: 'hr' | 'technical' | 'algorithms';
}

export class SendMessageDto {
  @ApiProperty({ example: 'Расскажи о замыканиях в JavaScript' })
  @IsString()
  @MaxLength(4000)
  content: string;
}
