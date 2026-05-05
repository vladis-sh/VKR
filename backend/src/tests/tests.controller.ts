import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryAdminQuestionsDto } from './dto/query-admin-questions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // ----- Admin endpoints (must be declared before generic ':id' routes) -----

  @Get('questions/admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: list all questions including drafts' })
  async adminListQuestions(@Query() query: QueryAdminQuestionsDto) {
    return this.testsService.adminFindAllQuestions(query);
  }

  @Get('questions/admin/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: get question by ID' })
  @ApiParam({ name: 'id' })
  async adminGetQuestion(@Param('id') id: string) {
    return this.testsService.adminFindOneQuestion(id);
  }

  @Post('questions')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin: create new question' })
  async createQuestion(@Body() dto: CreateQuestionDto) {
    return this.testsService.createQuestion(dto);
  }

  @Patch('questions/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: update question' })
  @ApiParam({ name: 'id' })
  async updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.testsService.updateQuestion(id, dto);
  }

  @Delete('questions/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: soft delete question' })
  @ApiParam({ name: 'id' })
  async deleteQuestion(@Param('id') id: string) {
    return this.testsService.softDeleteQuestion(id);
  }

  // ----- User endpoints -----

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
