import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsArray, IsInt, Min, Max, Matches } from 'class-validator';

export class UpdateNotificationsDto {
  @ApiProperty({ description: 'Whether notifications are enabled' })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ example: '09:00', description: 'Time in HH:MM format' })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format',
  })
  time: string;

  @ApiProperty({
    type: [Number],
    example: [1, 2, 3, 4, 5],
    description: 'Days of week (1=Monday, ... 7=Sunday)',
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  weekdays: number[];
}
