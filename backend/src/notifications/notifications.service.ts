import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNotificationsDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(userId: string) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { userId },
    });

    if (!reminder) {
      // Return default settings if none exist
      return {
        enabled: false,
        time: '09:00',
        weekdays: [1, 2, 3, 4, 5],
      };
    }

    return reminder;
  }

  async updateSettings(userId: string, dto: UpdateNotificationsDto) {
    const reminder = await this.prisma.reminder.upsert({
      where: { userId },
      create: {
        userId,
        enabled: dto.enabled,
        time: dto.time,
        weekdays: dto.weekdays,
      },
      update: {
        enabled: dto.enabled,
        time: dto.time,
        weekdays: dto.weekdays,
      },
    });

    return reminder;
  }
}
