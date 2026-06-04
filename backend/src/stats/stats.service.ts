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
        mode: true,
        topic: true,
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
      mode: session.mode,
      topic: session.topic,
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
}
