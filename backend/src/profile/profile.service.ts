import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, TestHistoryQueryDto } from './dto/update-profile.dto';
import { KnowledgeLevel } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        knowledgeLevel: true,
        isProfileComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: any = {};

    if (dto.fullName !== undefined) data.fullName = dto.fullName;
    if (dto.knowledgeLevel !== undefined) {
      data.knowledgeLevel = dto.knowledgeLevel as KnowledgeLevel;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        knowledgeLevel: true,
        isProfileComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updateAvatar(userId: string, filename: string) {
    const avatarUrl = `/uploads/avatars/${filename}`;

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return { avatarUrl };
  }

  async getTestHistory(userId: string, query: TestHistoryQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      this.prisma.testSession.findMany({
        where: {
          userId,
          totalQuestions: { gt: 0 },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.testSession.count({
        where: {
          userId,
          totalQuestions: { gt: 0 },
        },
      }),
    ]);

    const data = sessions.map((session) => ({
      id: session.id,
      mode: session.mode,
      topic: session.topic,
      correctAnswers: session.correctCount,
      totalQuestions: session.totalQuestions,
      percentage: session.accuracyPercent,
      durationSeconds: session.durationSeconds,
      completedAt: session.createdAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
