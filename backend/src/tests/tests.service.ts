import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import {
  QueryQuestionsDto,
  CreateTestSessionDto,
  CompleteTestSessionDto,
  QueryAiQuestionsDto,
} from './dto/tests.dto';
import { TestMode, KnowledgeLevel, QuestionSource } from '@prisma/client';

const TOPIC_SLUGS: Record<string, string> = {
  'HTML/CSS': 'html-css',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  React: 'react',
  'Frontend архитектура': 'frontend-arch',
  'Браузер и HTTP': 'browser-http',
  'Node.js': 'nodejs',
  NestJS: 'nestjs',
  'Базы данных': 'databases',
  Алгоритмы: 'algorithms',
};

const DEFAULT_AI_TOPIC = 'Frontend';

@Injectable()
export class TestsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getTopics() {
    const topics = await this.prisma.question.groupBy({
      by: ['topic'],
      _count: { id: true },
    });

    return topics
      .map((topic) => ({
        id: TOPIC_SLUGS[topic.topic] || this.slugifyTopic(topic.topic),
        slug: TOPIC_SLUGS[topic.topic] || this.slugifyTopic(topic.topic),
        name: topic.topic,
        description: `${topic._count.id} вопросов`,
        questionCount: topic._count.id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }

  async getQuestions(userId: string, query: QueryQuestionsDto) {
    const { topic, limit = 10, difficulty } = query;

    const where: any = {
      sourceType: QuestionSource.static,
    };

    if (topic) {
      where.topic = topic;
    }

    if (difficulty) {
      where.difficulty = difficulty as KnowledgeLevel;
    }

    if (!difficulty) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { knowledgeLevel: true },
      });

      if (user) {
        where.difficulty = user.knowledgeLevel;
      }
    }

    const questions = await this.prisma.question.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    return questions.sort(() => Math.random() - 0.5).map((question) => this.mapQuestion(question));
  }

  async createTestSession(userId: string, dto: CreateTestSessionDto) {
    const topic = dto.topic || (dto.mode === 'ai_generated' ? DEFAULT_AI_TOPIC : null);

    const session = await this.prisma.testSession.create({
      data: {
        userId,
        mode: dto.mode as TestMode,
        topic,
      },
    });

    return {
      id: session.id,
      mode: session.mode,
      topic: session.topic,
      status: 'active',
      timeLimit: dto.timeLimit,
      createdAt: session.createdAt,
    };
  }

  async completeTestSession(userId: string, sessionId: string, dto: CompleteTestSessionDto) {
    await this.getOwnedSession(userId, sessionId);

    const questionIds = dto.answers.map((answer) => answer.questionId);
    const questions = await this.prisma.question.findMany({
      where: { id: { in: questionIds } },
    });
    const questionMap = new Map(questions.map((question) => [question.id, question]));

    const missingQuestionIds = questionIds.filter((id) => !questionMap.has(id));
    if (missingQuestionIds.length > 0) {
      throw new BadRequestException(
        `Unknown question ids: ${missingQuestionIds.join(', ')}`,
      );
    }

    let correctCount = 0;
    let incorrectCount = 0;

    const answerHistoryData = dto.answers.map((answer) => {
      const question = questionMap.get(answer.questionId)!;
      const isCorrect = question.correctAnswerIndex === answer.selectedAnswerIndex;

      if (isCorrect) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }

      return {
        testSessionId: sessionId,
        questionId: answer.questionId,
        selectedAnswerIndex: answer.selectedAnswerIndex,
        isCorrect,
      };
    });

    const totalQuestions = dto.answers.length;
    const accuracyPercent = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const durationSeconds = Math.min(
      Math.max(Math.trunc(dto.durationSeconds || 0), totalQuestions > 0 ? 1 : 0),
      24 * 60 * 60,
    );

    const updatedSession = await this.prisma.$transaction(async (tx) => {
      await tx.testAnswerHistory.deleteMany({ where: { testSessionId: sessionId } });
      await tx.testAnswerHistory.createMany({ data: answerHistoryData });

      return tx.testSession.update({
        where: { id: sessionId },
        data: {
          correctCount,
          incorrectCount,
          totalQuestions,
          durationSeconds,
          accuracyPercent,
        },
      });
    });

    const result = this.mapSessionResult({
      ...updatedSession,
      answerHistory: answerHistoryData.map((answer) => ({
        ...answer,
        question: questionMap.get(answer.questionId),
      })),
    });

    return result;
  }

  async getTestSession(userId: string, sessionId: string) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        answerHistory: {
          orderBy: { createdAt: 'asc' },
          include: {
            question: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have access to this session');
    }

    return this.mapSessionResult(session);
  }

  async generateAiQuestions(userId: string, query: QueryAiQuestionsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { knowledgeLevel: true },
    });

    const topic = query.topic?.trim() || DEFAULT_AI_TOPIC;
    const count = query.count ?? 5;
    const difficulty = (query.difficulty as KnowledgeLevel | undefined) || user?.knowledgeLevel;

    const questions = await this.aiService.generateQuizQuestions(topic, count, difficulty);

    const createdAt = new Date();
    const savedQuestions = await this.prisma.$transaction(
      questions.map((question) =>
        this.prisma.question.create({
          data: {
            topic,
            text: question.text,
            options: question.options,
            correctAnswerIndex: question.correctAnswerIndex,
            explanation: question.explanation,
            difficulty: difficulty || KnowledgeLevel.junior,
            sourceType: QuestionSource.ai,
            createdAt,
          },
        }),
      ),
    );

    return savedQuestions.map((question) => this.mapQuestion(question));
  }

  private async getOwnedSession(userId: string, sessionId: string) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have access to this session');
    }

    return session;
  }

  private mapQuestion(question: any) {
    return {
      id: question.id,
      topic: question.topic,
      text: question.text,
      options: question.options,
      difficulty: question.difficulty,
      explanation: question.explanation,
      correctIndex: question.correctAnswerIndex,
    };
  }

  private mapSessionResult(session: any) {
    const answers = (session.answerHistory || []).map((answer: any) => ({
      questionId: answer.questionId,
      questionText: answer.question?.text || '',
      options: answer.question?.options || [],
      selectedIndex: answer.selectedAnswerIndex,
      correctIndex: answer.question?.correctAnswerIndex ?? -1,
      isCorrect: answer.isCorrect,
      explanation: answer.question?.explanation,
    }));

    return {
      id: session.id,
      mode: session.mode,
      topic: session.topic,
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctCount,
      incorrectAnswers: session.incorrectCount,
      durationSeconds: session.durationSeconds,
      percentage: session.accuracyPercent,
      completedAt: session.createdAt,
      createdAt: session.createdAt,
      answers,
    };
  }

  private slugifyTopic(topic: string) {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-+|-+$/g, '');
  }
}
