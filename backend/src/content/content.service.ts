import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContentEntryType, ContentImportStatus, ContentOrigin, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentCandidateDto, CreateContentEntryDto } from './dto/create-content-entry.dto';
import {
  QueryContentCandidatesDto,
  QueryContentEntriesDto,
} from './dto/query-content-entries.dto';
import { UpdateContentEntryDto } from './dto/update-content-entry.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublishedPayloads(type: ContentEntryType) {
    const entries = await this.prisma.contentEntry.findMany({
      where: {
        type,
        deletedAt: null,
        isPublished: true,
      },
      orderBy: { createdAt: 'asc' },
      select: { payload: true },
    });

    return entries.map((entry) => entry.payload);
  }

  async findPublishedPayloadBySlug(type: ContentEntryType, slug: string) {
    const entry = await this.prisma.contentEntry.findFirst({
      where: {
        type,
        slug,
        deletedAt: null,
        isPublished: true,
      },
      select: { payload: true },
    });

    if (!entry) {
      throw new NotFoundException('Content entry not found');
    }

    return entry.payload;
  }

  async adminFindAll(query: QueryContentEntriesDto) {
    const { type, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContentEntryWhereInput = {
      deletedAt: null,
    };

    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.contentEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.contentEntry.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adminFindOne(id: string) {
    const entry = await this.prisma.contentEntry.findFirst({
      where: { id, deletedAt: null },
    });

    if (!entry) {
      throw new NotFoundException('Content entry not found');
    }

    return entry;
  }

  async createEntry(dto: CreateContentEntryDto) {
    return this.prisma.contentEntry.create({
      data: {
        type: dto.type,
        slug: dto.slug.trim(),
        title: dto.title.trim(),
        payload: dto.payload as Prisma.InputJsonValue,
        origin: dto.origin ?? ContentOrigin.manual,
        sourceUrl: dto.sourceUrl?.trim() || null,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async updateEntry(id: string, dto: UpdateContentEntryDto) {
    await this.adminFindOne(id);

    const data: Prisma.ContentEntryUpdateInput = {};
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.slug !== undefined) data.slug = dto.slug.trim();
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.payload !== undefined) data.payload = dto.payload as Prisma.InputJsonValue;
    if (dto.origin !== undefined) data.origin = dto.origin;
    if (dto.sourceUrl !== undefined) data.sourceUrl = dto.sourceUrl.trim() || null;
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;

    return this.prisma.contentEntry.update({
      where: { id },
      data,
    });
  }

  async softDeleteEntry(id: string) {
    await this.adminFindOne(id);

    await this.prisma.contentEntry.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isPublished: false,
      },
    });

    return { message: 'Content entry deleted' };
  }

  async adminFindCandidates(query: QueryContentCandidatesDto) {
    const { type, status, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContentImportCandidateWhereInput = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { sourceUrl: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.contentImportCandidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contentImportCandidate.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createCandidate(dto: CreateContentCandidateDto) {
    return this.prisma.contentImportCandidate.create({
      data: {
        type: dto.type,
        slug: dto.slug?.trim() || null,
        title: dto.title.trim(),
        payload: dto.payload as Prisma.InputJsonValue,
        sourceUrl: dto.sourceUrl?.trim() || null,
        raw: dto.raw ? (dto.raw as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  async publishCandidate(id: string) {
    const candidate = await this.prisma.contentImportCandidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException('Content candidate not found');
    }

    if (candidate.status === ContentImportStatus.rejected) {
      throw new BadRequestException('Rejected candidate cannot be published');
    }

    const payload = candidate.payload as Record<string, unknown>;
    const slug = (candidate.slug || payload.slug) as string | undefined;

    if (!slug) {
      throw new BadRequestException('Candidate must have slug or payload.slug');
    }

    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.contentEntry.upsert({
        where: {
          type_slug: {
            type: candidate.type,
            slug,
          },
        },
        update: {
          title: candidate.title,
          payload: candidate.payload as Prisma.InputJsonValue,
          origin: ContentOrigin.parser,
          sourceUrl: candidate.sourceUrl,
          isPublished: true,
          deletedAt: null,
        },
        create: {
          type: candidate.type,
          slug,
          title: candidate.title,
          payload: candidate.payload as Prisma.InputJsonValue,
          origin: ContentOrigin.parser,
          sourceUrl: candidate.sourceUrl,
          isPublished: true,
        },
      });

      await tx.contentImportCandidate.update({
        where: { id },
        data: { status: ContentImportStatus.approved },
      });

      return entry;
    });
  }

  async rejectCandidate(id: string) {
    const candidate = await this.prisma.contentImportCandidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException('Content candidate not found');
    }

    return this.prisma.contentImportCandidate.update({
      where: { id },
      data: { status: ContentImportStatus.rejected },
    });
  }
}
