import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    const sessions = await this.prisma.testSession.findMany({
      where: {
        userId,
        totalQuestions: { gt: 0 },
        durationSeconds: { gt: 0 },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        correctCount: true,
        incorrectCount: true,
        totalQuestions: true,
        durationSeconds: true,
        accuracyPercent: true,
        createdAt: true,
      },
    });

    const totalCorrect = sessions.reduce((sum, session) => sum + session.correctCount, 0);
    const totalIncorrect = sessions.reduce((sum, session) => sum + session.incorrectCount, 0);
    const totalTimeSeconds = sessions.reduce(
      (sum, session) => sum + Math.max(session.durationSeconds, 0),
      0,
    );
    const completedTests = sessions.length;
    const totalAnswered = totalCorrect + totalIncorrect;
    const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

    const recentSessions = sessions.slice(0, 7).map((session) => ({
      sessionId: session.id,
      date: session.createdAt,
      accuracy: session.accuracyPercent,
      correctAnswers: session.correctCount,
      totalQuestions: session.totalQuestions,
      durationSeconds: Math.max(session.durationSeconds, 0),
    }));

    return {
      totalCorrect,
      totalIncorrect,
      completedTests,
      totalTimeSeconds,
      accuracy,
      recentSessions,
    };
  }

  async getLeaderboard(
    currentUserId: string,
    sort: 'correctAnswers' | 'studyTime' = 'correctAnswers',
    limit: number = 10,
  ) {
    const aggregates = await this.prisma.testSession.groupBy({
      by: ['userId'],
      where: { totalQuestions: { gt: 0 }, durationSeconds: { gt: 0 } },
      _sum: {
        correctCount: true,
        incorrectCount: true,
        durationSeconds: true,
      },
    });

    if (aggregates.length === 0) {
      return [];
    }

    const sorted = aggregates.sort((left, right) => {
      if (sort === 'studyTime') {
        return (right._sum.durationSeconds ?? 0) - (left._sum.durationSeconds ?? 0);
      }
      return (right._sum.correctCount ?? 0) - (left._sum.correctCount ?? 0);
    });

    const topUserIds = sorted.slice(0, limit).map((row) => row.userId);

    const users = await this.prisma.user.findMany({
      where: {
        id: { in: topUserIds },
        isProfileComplete: true,
      },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        knowledgeLevel: true,
      },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));

    return sorted
      .slice(0, limit)
      .filter((row) => userMap.has(row.userId))
      .map((row, index) => {
        const user = userMap.get(row.userId)!;
        const correctAnswers = row._sum.correctCount ?? 0;
        const incorrectAnswers = row._sum.incorrectCount ?? 0;
        const studyTimeSeconds = row._sum.durationSeconds ?? 0;
        const totalAnswered = correctAnswers + incorrectAnswers;

        return {
          rank: index + 1,
          userId: user.id,
          fullName: user.fullName || 'Аноним',
          avatarUrl: user.avatarUrl,
          knowledgeLevel: user.knowledgeLevel,
          correctAnswers,
          studyTimeSeconds,
          accuracy: totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0,
          isCurrentUser: user.id === currentUserId,
        };
      });
  }
}
