import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ContentEntryType, ContentOrigin } from '@prisma/client';

export class CreateContentEntryDto {
  @IsEnum(ContentEntryType)
  type: ContentEntryType;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  slug: string;

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  title: string;

  @IsObject()
  payload: Record<string, unknown>;

  @IsOptional()
  @IsEnum(ContentOrigin)
  origin?: ContentOrigin;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sourceUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
