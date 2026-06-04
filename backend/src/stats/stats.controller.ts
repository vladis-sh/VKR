import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
}
