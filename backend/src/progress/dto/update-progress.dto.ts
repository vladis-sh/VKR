import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({ description: 'Arbitrary JSON progress blob for the namespace' })
  @IsObject()
  data: Record<string, unknown>;
}
