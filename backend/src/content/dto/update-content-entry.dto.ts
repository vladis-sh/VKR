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

export class UpdateContentEntryDto {
  @IsOptional()
  @IsEnum(ContentEntryType)
  type?: ContentEntryType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(240)
  title?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

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

export class UpdateContentSourceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsEnum(ContentEntryType)
  type?: ContentEntryType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  adapter?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}
