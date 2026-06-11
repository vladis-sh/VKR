import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class RegisterProfileDto {
  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @MaxLength(100, { message: 'Имя слишком длинное' })
  fullName: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
