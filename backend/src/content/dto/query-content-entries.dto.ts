import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ContentEntryType, ContentImportStatus } from '@prisma/client';

export class QueryContentEntriesDto {
  @IsOptional()
  @IsEnum(ContentEntryType)
  type?: ContentEntryType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class QueryContentCandidatesDto {
  @IsOptional()
  @IsEnum(ContentEntryType)
  type?: ContentEntryType;

  @IsOptional()
  @IsEnum(ContentImportStatus)
  status?: ContentImportStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class QueryContentSourcesDto {
  @IsOptional()
  @IsEnum(ContentEntryType)
  type?: ContentEntryType;

  @IsOptional()
  @IsString()
  adapter?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
