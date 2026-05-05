import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryMaterialsDto } from './dto/query-materials.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { KnowledgeLevel } from '@prisma/client';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: QueryMaterialsDto) {
    const { search, level, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    if (level) {
      where.level = level as KnowledgeLevel;
    }

    const [items, total] = await Promise.all([
      this.prisma.material.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          favoritedBy: {
            where: { userId },
            select: { userId: true },
          },
        },
      }),
      this.prisma.material.count({ where }),
    ]);

    const materialsWithFavorite = items.map((m) => ({
      id: m.id,
      title: m.title,
      shortDescription: m.shortDescription,
      tags: m.tags,
      level: m.level,
      createdAt: m.createdAt,
      isFavorite: m.favoritedBy.length > 0,
    }));

    return {
      items: materialsWithFavorite,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const material = await this.prisma.material.findFirst({
      where: { id, deletedAt: null, isPublished: true },
      include: {
        favoritedBy: {
          where: { userId },
          select: { userId: true },
        },
      },
    });

    if (!material) {
      throw new NotFoundException('Материал не найден');
    }

    return {
      ...material,
      isFavorite: material.favoritedBy.length > 0,
      favoritedBy: undefined,
    };
  }

  async getFavorites(userId: string) {
    const favorites = await this.prisma.userFavorite.findMany({
      where: {
        userId,
        material: { deletedAt: null, isPublished: true },
      },
      include: {
        material: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => ({
      ...f.material,
      isFavorite: true,
      favoritedAt: f.createdAt,
    }));
  }

  async addFavorite(userId: string, materialId: string) {
    const material = await this.prisma.material.findFirst({
      where: { id: materialId, deletedAt: null },
    });
    if (!material) {
      throw new NotFoundException('Материал не найден');
    }

    await this.prisma.userFavorite.upsert({
      where: { userId_materialId: { userId, materialId } },
      create: { userId, materialId },
      update: {},
    });

    return { message: 'Добавлено в избранное' };
  }

  async removeFavorite(userId: string, materialId: string) {
    const favorite = await this.prisma.userFavorite.findUnique({
      where: { userId_materialId: { userId, materialId } },
    });

    if (!favorite) {
      throw new NotFoundException('Материал не найден в избранном');
    }

    await this.prisma.userFavorite.delete({
      where: { userId_materialId: { userId, materialId } },
    });

    return { message: 'Удалено из избранного' };
  }

  // ============================================================
  // Admin methods
  // ============================================================

  async adminFindAll(query: QueryMaterialsDto) {
    const { search, level, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (level) {
      where.level = level as KnowledgeLevel;
    }

    const [items, total] = await Promise.all([
      this.prisma.material.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.material.count({ where }),
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
    const material = await this.prisma.material.findFirst({
      where: { id, deletedAt: null },
    });
    if (!material) {
      throw new NotFoundException('Материал не найден');
    }
    return material;
  }

  async create(dto: CreateMaterialDto) {
    return this.prisma.material.create({
      data: {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        tags: dto.tags,
        level: dto.level as KnowledgeLevel,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateMaterialDto) {
    await this.adminFindOne(id);

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.shortDescription !== undefined) data.shortDescription = dto.shortDescription;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.tags !== undefined) data.tags = dto.tags;
    if (dto.level !== undefined) data.level = dto.level as KnowledgeLevel;
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;

    return this.prisma.material.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    await this.adminFindOne(id);

    await this.prisma.material.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    return { message: 'Материал удалён' };
  }
}
