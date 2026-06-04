import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async get(userId: string, namespace: string) {
    const row = await this.prisma.userProgress.findUnique({
      where: { userId_namespace: { userId, namespace } },
      select: { data: true },
    });

    return { exists: !!row, data: row?.data ?? {} };
  }

  async put(userId: string, namespace: string, data: unknown) {
    const value = data as Prisma.InputJsonValue;

    const row = await this.prisma.userProgress.upsert({
      where: { userId_namespace: { userId, namespace } },
      create: { userId, namespace, data: value },
      update: { data: value },
      select: { data: true },
    });

    return { data: row.data };
  }
}
