import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentEntryType } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ContentService } from './content.service';
import {
  CreateContentCandidateDto,
  CreateContentEntryDto,
  CreateContentSourceDto,
} from './dto/create-content-entry.dto';
import {
  QueryContentCandidatesDto,
  QueryContentEntriesDto,
  QueryContentSourcesDto,
} from './dto/query-content-entries.dto';
import {
  UpdateContentEntryDto,
  UpdateContentSourceDto,
} from './dto/update-content-entry.dto';

@ApiTags('Roadmaps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('roadmaps')
export class RoadmapsController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'List published roadmaps' })
  async findAll() {
    return this.contentService.findPublishedPayloads(ContentEntryType.roadmap);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get published roadmap by slug' })
  async findOne(@Param('slug') slug: string) {
    return this.contentService.findPublishedPayloadBySlug(ContentEntryType.roadmap, slug);
  }
}

@ApiTags('Live Coding')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('live-coding')
export class LiveCodingController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'List published live coding tasks' })
  async findAll() {
    return this.contentService.findPublishedPayloads(ContentEntryType.live_coding_task);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get published live coding task by slug' })
  async findOne(@Param('slug') slug: string) {
    return this.contentService.findPublishedPayloadBySlug(
      ContentEntryType.live_coding_task,
      slug,
    );
  }
}

@ApiTags('Test Catalog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('test-catalog')
export class TestCatalogController {
  constructor(private readonly contentService: ContentService) {}

  @Get('themes')
  @ApiOperation({ summary: 'List published test catalog themes' })
  async findThemes() {
    return this.contentService.findPublishedPayloads(ContentEntryType.test_catalog_theme);
  }

  @Get('themes/:slug')
  @ApiOperation({ summary: 'Get published test catalog theme by slug' })
  async findTheme(@Param('slug') slug: string) {
    return this.contentService.findPublishedPayloadBySlug(
      ContentEntryType.test_catalog_theme,
      slug,
    );
  }
}

@ApiTags('Content Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth('access_token')
@Controller('content/admin')
export class ContentAdminController {
  constructor(private readonly contentService: ContentService) {}

  @Get('entries')
  @ApiOperation({ summary: 'Admin: list content entries' })
  async listEntries(@Query() query: QueryContentEntriesDto) {
    return this.contentService.adminFindAll(query);
  }

  @Get('entries/:id')
  @ApiOperation({ summary: 'Admin: get content entry' })
  async getEntry(@Param('id') id: string) {
    return this.contentService.adminFindOne(id);
  }

  @Post('entries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin: create content entry' })
  async createEntry(@Body() dto: CreateContentEntryDto) {
    return this.contentService.createEntry(dto);
  }

  @Patch('entries/:id')
  @ApiOperation({ summary: 'Admin: update content entry' })
  async updateEntry(@Param('id') id: string, @Body() dto: UpdateContentEntryDto) {
    return this.contentService.updateEntry(id, dto);
  }

  @Delete('entries/:id')
  @ApiOperation({ summary: 'Admin: soft delete content entry' })
  async deleteEntry(@Param('id') id: string) {
    return this.contentService.softDeleteEntry(id);
  }

  @Get('sources')
  @ApiOperation({ summary: 'Admin: list import sources' })
  async listSources(@Query() query: QueryContentSourcesDto) {
    return this.contentService.adminFindSources(query);
  }

  @Get('sources/:id')
  @ApiOperation({ summary: 'Admin: get import source' })
  async getSource(@Param('id') id: string) {
    return this.contentService.adminFindSource(id);
  }

  @Post('sources')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin: create import source' })
  async createSource(@Body() dto: CreateContentSourceDto) {
    return this.contentService.createSource(dto);
  }

  @Patch('sources/:id')
  @ApiOperation({ summary: 'Admin: update import source' })
  async updateSource(@Param('id') id: string, @Body() dto: UpdateContentSourceDto) {
    return this.contentService.updateSource(id, dto);
  }

  @Delete('sources/:id')
  @ApiOperation({ summary: 'Admin: delete import source' })
  async deleteSource(@Param('id') id: string) {
    return this.contentService.deleteSource(id);
  }

  @Post('sources/:id/run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin: collect configured source candidates' })
  async runSource(@Param('id') id: string) {
    return this.contentService.runSource(id);
  }

  @Get('candidates')
  @ApiOperation({ summary: 'Admin: list parser/import candidates' })
  async listCandidates(@Query() query: QueryContentCandidatesDto) {
    return this.contentService.adminFindCandidates(query);
  }

  @Post('candidates')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin: create parser/import candidate' })
  async createCandidate(@Body() dto: CreateContentCandidateDto) {
    return this.contentService.createCandidate(dto);
  }

  @Post('candidates/:id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin: publish parser/import candidate' })
  async publishCandidate(@Param('id') id: string) {
    return this.contentService.publishCandidate(id);
  }

  @Post('candidates/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin: reject parser/import candidate' })
  async rejectCandidate(@Param('id') id: string) {
    return this.contentService.rejectCandidate(id);
  }
}
