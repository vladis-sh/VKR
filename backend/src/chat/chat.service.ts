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
        'Привет! Я твой ассистент по подготовке к собеседованиям. Помогу разобрать тему по ' +
        'программированию, frontend, backend, алгоритмам, базам данных или архитектуре. С чего начнём?',
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
          // Take the most recent 20 messages (newest-first), then restore
          // chronological order below. Ordering ascending with `take` would
          // freeze the context at the first 20 messages of a long conversation.
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('No access');

    const history = [...session.messages].reverse();

    const topicCheck = checkAssistantTopic(dto.content);
    if (!topicCheck.allowed) {
      return this.persistExchange(sessionId, dto.content, OFF_TOPIC_REPLY);
    }

    const messages = history
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

    // Persist the user message and the reply together, so a failed AI call never
    // leaves an orphaned user message (which a retry would then duplicate).
    return this.persistExchange(sessionId, dto.content, aiResponse);
  }

  /**
   * Atomically store the user message and the assistant reply, then return the
   * reply. Timestamps are set explicitly (1 ms apart) because a single
   * transaction shares one now(), which would make message ordering ambiguous.
   */
  private async persistExchange(sessionId: string, userContent: string, assistantContent: string) {
    const userCreatedAt = new Date();
    const assistantCreatedAt = new Date(userCreatedAt.getTime() + 1);

    const [, assistantMessage] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          sessionId,
          role: MessageRole.user,
          content: userContent,
          createdAt: userCreatedAt,
        },
      }),
      this.prisma.chatMessage.create({
        data: {
          sessionId,
          role: MessageRole.assistant,
          content: assistantContent,
          createdAt: assistantCreatedAt,
        },
      }),
      this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: assistantCreatedAt },
      }),
    ]);

    return assistantMessage;
  }
}
