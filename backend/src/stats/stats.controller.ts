import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { IsOptional, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class LeaderboardQueryDto {
  @ApiPropertyOptional({ enum: ['correctAnswers', 'studyTime'], default: 'correctAnswers' })
  @IsOptional()
  @IsIn(['correctAnswers', 'studyTime'])
  sort?: 'correctAnswers' | 'studyTime' = 'correctAnswers';

  @ApiPropertyOptional({ default: 10, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

@ApiTags('Stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: "Get current user's aggregate statistics" })
  async getStats(@CurrentUser('id') userId: string) {
    return this.statsService.getUserStats(userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiQuery({ name: 'sort', enum: ['correctAnswers', 'studyTime'], required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLeaderboard(@CurrentUser('id') userId: string, @Query() query: LeaderboardQueryDto) {
    return this.statsService.getLeaderboard(userId, query.sort, query.limit);
  }
}
