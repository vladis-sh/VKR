import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import {
  QueryQuestionsDto,
  CreateTestSessionDto,
  CompleteTestSessionDto,
  QueryAiQuestionsDto,
} from './dto/tests.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get('topics')
  @ApiOperation({ summary: 'Get list of all test topics' })
  async getTopics() {
    return this.testsService.getTopics();
  }

  @Get('questions/ai')
  @ApiOperation({ summary: 'Generate AI questions for a topic' })
  async generateAiQuestions(
    @CurrentUser('id') userId: string,
    @Query() query: QueryAiQuestionsDto,
  ) {
    return this.testsService.generateAiQuestions(userId, query);
  }

  @Get('questions')
  @ApiOperation({ summary: 'Get questions filtered by topic and difficulty' })
  async getQuestions(@CurrentUser('id') userId: string, @Query() query: QueryQuestionsDto) {
    return this.testsService.getQuestions(userId, query);
  }

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new test session' })
  async createSession(@CurrentUser('id') userId: string, @Body() dto: CreateTestSessionDto) {
    return this.testsService.createTestSession(userId, dto);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get test session with answer history' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async getSession(@CurrentUser('id') userId: string, @Param('id') sessionId: string) {
    return this.testsService.getTestSession(userId, sessionId);
  }

  @Post('sessions/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete test session and submit answers' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async completeSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: CompleteTestSessionDto,
  ) {
    return this.testsService.completeTestSession(userId, sessionId, dto);
  }
}
