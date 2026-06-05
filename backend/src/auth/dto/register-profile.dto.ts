import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsIn } from 'class-validator';

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

// export class RegisterLevelDto {
//   @ApiProperty({ enum: ['junior', 'middle', 'senior'] })
//   @IsIn(['junior', 'middle', 'senior'], {
//     message: 'Уровень знаний должен быть junior, middle или senior',
//   })
//   knowledgeLevel: 'junior' | 'middle' | 'senior';
// }
