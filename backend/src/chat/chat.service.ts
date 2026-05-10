import {
  BadGatewayException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssistantRole, MessageRole } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { checkAssistantTopic, OFF_TOPIC_REPLY } from '../ai/topic-guard';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, SendMessageDto } from './dto/create-session.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getSessions(userId: string) {
    const sessions = await this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true },
        },
      },
    });

    return sessions.map((session) => ({
      id: session.id,
      title: session.title,
      assistantRole: session.assistantRole,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session._count.messages,
      lastMessage: session.messages[0]?.content,
    }));
  }

  async createSession(userId: string, dto: CreateSessionDto) {
    // The DB enum value `hr` is reused as an interview simulator.
    const roleGreetings: Record<string, string> = {
      hr:
        'Привет! Я твой технический интервьюер. Начнём с вопроса по JavaScript: ' +
        'расскажи, что такое замыкание, и приведи короткий пример.',
      technical:
        'Привет! Я технический ассистент. Готов разобрать любую тему по программированию, ' +
        'frontend, backend, базам данных или архитектуре. С чего начнём?',
      algorithms:
        'Привет! Я ассистент по алгоритмам и структурам данных. Могу объяснить тему, дать ' +
        'задачу или проверить твоё решение. Что выберем?',
    };

    const session = await this.prisma.chatSession.create({
      data: {
        userId,
        title: dto.title || `Чат: ${dto.assistantRole}`,
        assistantRole: dto.assistantRole as AssistantRole,
        messages: {
          create: {
            role: MessageRole.assistant,
            content: roleGreetings[dto.assistantRole] || roleGreetings.technical,
          },
        },
      },
    });

    return session;
  }

  async deleteAllSessions(userId: string) {
    await this.prisma.chatSession.deleteMany({ where: { userId } });
    return { message: 'All sessions deleted' };
  }

  async getSession(userId: string, sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have access to this session');
    }

    return session;
  }

  async deleteSession(userId: string, sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('No access');

    await this.prisma.chatSession.delete({ where: { id: sessionId } });
    return { message: 'Session deleted' };
  }

  async sendMessage(userId: string, sessionId: string, dto: SendMessageDto) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20,
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('No access');

    // Persist the user's message first so it is visible even if the LLM call fails.
    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.user,
        content: dto.content,
      },
    });

    const topicCheck = checkAssistantTopic(dto.content, {
      hasHistory: session.messages.length > 1,
    });

    if (!topicCheck.allowed) {
      const refusal = await this.prisma.chatMessage.create({
        data: {
          sessionId,
          role: MessageRole.assistant,
          content: OFF_TOPIC_REPLY,
        },
      });
      await this.touchSession(sessionId);
      return refusal;
    }

    const messages = session.messages
      .filter((message) => message.role !== MessageRole.system)
      .map((message) => ({
        role: message.role as 'user' | 'assistant',
        content: message.content,
      }));
    messages.push({ role: 'user', content: dto.content });

    let aiResponse: string;
    try {
      aiResponse = await this.aiService.chatWithRole(session.assistantRole, messages);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadGatewayException('Не удалось получить ответ ассистента. Попробуйте ещё раз.');
    }

    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.assistant,
        content: aiResponse,
      },
    });

    await this.touchSession(sessionId);
    return assistantMessage;
  }

  private async touchSession(sessionId: string) {
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });
  }
}
