import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentEntryType, ContentOrigin, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentEntryDto } from './dto/create-content-entry.dto';
import { QueryContentEntriesDto } from './dto/query-content-entries.dto';
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
      take: 200, // defensive cap against unbounded public responses
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
    const slug = dto.slug.trim();

    // The DB unique constraint @@unique([type, slug]) ignores deletedAt, so a
    // soft-deleted row would otherwise block re-creation with a raw P2002/500.
    const existing = await this.prisma.contentEntry.findUnique({
      where: { type_slug: { type: dto.type, slug } },
    });

    if (existing && !existing.deletedAt) {
      throw new ConflictException(
        'Content entry with this type and slug already exists',
      );
    }

    const data = {
      type: dto.type,
      slug,
      title: dto.title.trim(),
      payload: dto.payload as Prisma.InputJsonValue,
      origin: dto.origin ?? ContentOrigin.manual,
      sourceUrl: dto.sourceUrl?.trim() || null,
      isPublished: dto.isPublished ?? true,
    };

    // Reuse a previously soft-deleted row instead of failing on the unique key.
    if (existing) {
      return this.prisma.contentEntry.update({
        where: { id: existing.id },
        data: { ...data, deletedAt: null },
      });
    }

    return this.prisma.contentEntry.create({ data });
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
}
