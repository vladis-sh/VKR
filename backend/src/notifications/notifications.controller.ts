import { Controller, Get, Put, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationsDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notification settings' })
  async getSettings(@CurrentUser('id') userId: string) {
    return this.notificationsService.getSettings(userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification settings' })
  async updateSettings(@CurrentUser('id') userId: string, @Body() dto: UpdateNotificationsDto) {
    return this.notificationsService.updateSettings(userId, dto);
  }
}
