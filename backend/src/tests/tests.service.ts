import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KnowledgeLevel, QuestionSource, TestMode } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QueryAdminQuestionsDto } from './dto/query-admin-questions.dto';
import {
  CompleteTestSessionDto,
  CreateTestSessionDto,
  QueryAiQuestionsDto,
  QueryQuestionsDto,
  RecordCatalogResultDto,
} from './dto/tests.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

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
      where: {
        sourceType: QuestionSource.static,
        deletedAt: null,
        isPublished: true,
      },
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
      deletedAt: null,
      isPublished: true,
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
      throw new BadRequestException(`Unknown question ids: ${missingQuestionIds.join(', ')}`);
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

    return this.mapSessionResult({
      ...updatedSession,
      answerHistory: answerHistoryData.map((answer) => ({
        ...answer,
        question: questionMap.get(answer.questionId),
      })),
    });
  }

  /**
   * Records an aggregated result for a catalog (theme) test. Catalog questions
   * live in ContentEntry payloads, not the Question table, so they can't go
   * through completeTestSession — we persist the totals directly so the result
   * still feeds Stats.
   */
  async recordCatalogResult(userId: string, dto: RecordCatalogResultDto) {
    const totalQuestions = dto.totalQuestions;
    const correctCount = Math.min(Math.max(Math.trunc(dto.correctCount), 0), totalQuestions);
    const incorrectCount = totalQuestions - correctCount;
    const accuracyPercent = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const durationSeconds = Math.min(
      Math.max(Math.trunc(dto.durationSeconds || 0), 1),
      24 * 60 * 60,
    );

    const session = await this.prisma.testSession.create({
      data: {
        userId,
        mode: TestMode.topic,
        topic: dto.topic?.trim() || 'Тест по теме',
        correctCount,
        incorrectCount,
        totalQuestions,
        durationSeconds,
        accuracyPercent,
      },
    });

    return {
      id: session.id,
      correctAnswers: correctCount,
      totalQuestions,
      percentage: accuracyPercent,
    };
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
    // The answer key (correctIndex/explanation) is intentionally omitted so it
    // can't be read from the network before answering — it is revealed only via
    // POST /tests/questions/:id/check.
    return {
      id: question.id,
      topic: question.topic,
      text: question.text,
      options: question.options,
      difficulty: question.difficulty,
    };
  }

  async checkAnswer(questionId: string, selectedAnswerIndex: number) {
    const question = await this.prisma.question.findFirst({
      where: { id: questionId, deletedAt: null },
      select: { correctAnswerIndex: true, explanation: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return {
      isCorrect: question.correctAnswerIndex === selectedAnswerIndex,
      correctIndex: question.correctAnswerIndex,
      explanation: question.explanation,
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

  async adminFindAllQuestions(query: QueryAdminQuestionsDto) {
    const { topic, difficulty, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty as KnowledgeLevel;
    if (search) {
      where.text = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.question.count({ where }),
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

  async adminFindOneQuestion(id: string) {
    const question = await this.prisma.question.findFirst({
      where: { id, deletedAt: null },
    });
    if (!question) {
      throw new NotFoundException('Вопрос не найден');
    }
    return question;
  }

  async createQuestion(dto: CreateQuestionDto) {
    if (dto.correctAnswerIndex >= dto.options.length) {
      throw new BadRequestException('correctAnswerIndex outside of options range');
    }

    return this.prisma.question.create({
      data: {
        topic: dto.topic,
        text: dto.text,
        options: dto.options,
        correctAnswerIndex: dto.correctAnswerIndex,
        explanation: dto.explanation,
        difficulty: dto.difficulty as KnowledgeLevel,
        sourceType: QuestionSource.static,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    const existing = await this.adminFindOneQuestion(id);

    const data: any = {};
    if (dto.topic !== undefined) data.topic = dto.topic;
    if (dto.text !== undefined) data.text = dto.text;
    if (dto.options !== undefined) data.options = dto.options;
    if (dto.correctAnswerIndex !== undefined) {
      data.correctAnswerIndex = dto.correctAnswerIndex;
    }
    if (dto.explanation !== undefined) data.explanation = dto.explanation;
    if (dto.difficulty !== undefined) {
      data.difficulty = dto.difficulty as KnowledgeLevel;
    }
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;

    const finalOptions = data.options ?? existing.options;
    const finalCorrectIndex = data.correctAnswerIndex ?? existing.correctAnswerIndex;
    if (finalCorrectIndex >= finalOptions.length) {
      throw new BadRequestException('correctAnswerIndex outside of options range');
    }

    return this.prisma.question.update({ where: { id }, data });
  }

  async softDeleteQuestion(id: string) {
    await this.adminFindOneQuestion(id);

    await this.prisma.question.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });

    return { message: 'Вопрос удалён' };
  }
}
