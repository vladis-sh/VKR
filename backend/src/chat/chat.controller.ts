import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChatService } from './chat.service';
import { CreateSessionDto, SendMessageDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  @ApiOperation({ summary: 'Get all user chat sessions' })
  async getSessions(@CurrentUser('id') userId: string) {
    return this.chatService.getSessions(userId);
  }

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new chat session' })
  async createSession(@CurrentUser('id') userId: string, @Body() dto: CreateSessionDto) {
    return this.chatService.createSession(userId, dto);
  }

  @Delete('sessions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all user sessions' })
  async deleteAllSessions(@CurrentUser('id') userId: string) {
    return this.chatService.deleteAllSessions(userId);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get session with messages' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async getSession(@CurrentUser('id') userId: string, @Param('id') sessionId: string) {
    return this.chatService.getSession(userId, sessionId);
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete single session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async deleteSession(@CurrentUser('id') userId: string, @Param('id') sessionId: string) {
    return this.chatService.deleteSession(userId, sessionId);
  }

  @Post('sessions/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  // Stricter than the global 60/min: AI calls cost money, so cap chat sends.
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @ApiOperation({ summary: 'Send message and get AI response' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(userId, sessionId, dto);
  }
}
