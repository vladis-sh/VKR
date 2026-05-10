import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Сообщение не может быть пустым' })
  @MinLength(1)
  @MaxLength(4000)
  content: string;
}
