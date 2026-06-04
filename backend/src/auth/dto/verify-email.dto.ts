import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'b3f1c2a4...' })
  @IsString()
  @IsNotEmpty({ message: 'Токен обязателен' })
  token: string;
}
