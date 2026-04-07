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
    const totalTimeSeconds = sessions.reduce((sum, session) => sum + session.durationSeconds, 0);
    const completedTests = sessions.length;
    const totalAnswered = totalCorrect + totalIncorrect;
    const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

    const recentSessions = sessions.slice(0, 7).map((session) => ({
      sessionId: session.id,
      date: session.createdAt,
      accuracy: session.accuracyPercent,
      correctAnswers: session.correctCount,
      totalQuestions: session.totalQuestions,
      durationSeconds: session.durationSeconds,
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
    const users = await this.prisma.user.findMany({
      where: { isProfileComplete: true },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        knowledgeLevel: true,
        testSessions: {
          where: {
            totalQuestions: { gt: 0 },
          },
          select: {
            correctCount: true,
            incorrectCount: true,
            durationSeconds: true,
          },
        },
      },
    });

    const leaderboard = users.map((user) => {
      const correctAnswers = user.testSessions.reduce(
        (sum, session) => sum + session.correctCount,
        0,
      );
      const totalIncorrect = user.testSessions.reduce(
        (sum, session) => sum + session.incorrectCount,
        0,
      );
      const studyTimeSeconds = user.testSessions.reduce(
        (sum, session) => sum + session.durationSeconds,
        0,
      );
      const totalAnswered = correctAnswers + totalIncorrect;

      return {
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

    const sorted = leaderboard.sort((left, right) => {
      if (sort === 'studyTime') {
        return right.studyTimeSeconds - left.studyTimeSeconds;
      }

      return right.correctAnswers - left.correctAnswers;
    });

    return sorted.slice(0, limit).map((user, index) => ({
      rank: index + 1,
      ...user,
    }));
  }
}
