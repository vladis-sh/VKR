import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateSessionDto, SendMessageDto } from './dto/create-session.dto';
import { AssistantRole, MessageRole } from '@prisma/client';

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
    const roleGreetings: Record<string, string> = {
      hr: 'Привет! Я твой HR-интервьюер. Давай начнём с небольшого знакомства: расскажи мне о себе и своём опыте в разработке.',
      technical:
        'Привет! Я твой технический интервьюер. Готов проверить твои знания по фронтенд-разработке. Начнём с JavaScript: расскажи, что ты знаешь о замыканиях?',
      algorithms:
        'Привет! Я специализируюсь на алгоритмах и структурах данных. Готов к задачам? Начнём с классики: расскажи, что такое Big O нотация.',
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
    const session = await this.prisma.chatSession.findUnique({ where: { id: sessionId } });
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

    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.user,
        content: dto.content,
      },
    });

    const messages = session.messages.map((message) => ({
      role: message.role as 'user' | 'assistant' | 'system',
      content: message.content,
    }));

    messages.push({ role: 'user', content: dto.content });

    const aiResponse = await this.aiService.chatWithRole(session.assistantRole, messages);

    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.assistant,
        content: aiResponse,
      },
    });

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return assistantMessage;
  }
}
