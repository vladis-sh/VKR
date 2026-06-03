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

export class CreateContentCandidateDto {
  @IsEnum(ContentEntryType)
  type: ContentEntryType;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  slug?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  title: string;

  @IsObject()
  payload: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sourceUrl?: string;

  @IsOptional()
  @IsObject()
  raw?: Record<string, unknown>;
}

export class CreateContentSourceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  url: string;

  @IsEnum(ContentEntryType)
  type: ContentEntryType;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  adapter: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}
