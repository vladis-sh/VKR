import { BadRequestException, Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

const ALLOWED_NAMESPACES = ['test-catalog', 'roadmap', 'live-coding'] as const;
type ProgressNamespace = (typeof ALLOWED_NAMESPACES)[number];

@ApiTags('Progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':namespace')
  @ApiOperation({ summary: "Get the current user's progress blob for a namespace" })
  @ApiParam({ name: 'namespace', enum: ALLOWED_NAMESPACES })
  async get(@CurrentUser('id') userId: string, @Param('namespace') namespace: string) {
    return this.progressService.get(userId, this.assertNamespace(namespace));
  }

  @Put(':namespace')
  @ApiOperation({ summary: "Replace the current user's progress blob for a namespace" })
  @ApiParam({ name: 'namespace', enum: ALLOWED_NAMESPACES })
  async put(
    @CurrentUser('id') userId: string,
    @Param('namespace') namespace: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.put(userId, this.assertNamespace(namespace), dto.data);
  }

  private assertNamespace(namespace: string): ProgressNamespace {
    if (!ALLOWED_NAMESPACES.includes(namespace as ProgressNamespace)) {
      throw new BadRequestException('Unknown progress namespace');
    }
    return namespace as ProgressNamespace;
  }
}
