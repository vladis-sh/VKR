import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { IsRussianEmail } from '../russian-email';

export class RegisterDto {
  @ApiProperty({ example: 'user@yandex.ru' })
  @IsRussianEmail()
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(100)
  @Matches(/[A-Z]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
  @Matches(/[a-z]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
  @Matches(/\d/, { message: 'Пароль должен содержать хотя бы одну цифру' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Пароль должен содержать хотя бы один специальный символ' })
  password: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
