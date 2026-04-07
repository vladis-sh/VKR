import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MaterialsService } from './materials.service';
import { QueryMaterialsDto } from './dto/query-materials.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Materials')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of materials' })
  @ApiResponse({ status: 200, description: 'List of materials with pagination' })
  async findAll(@CurrentUser('id') userId: string, @Query() query: QueryMaterialsDto) {
    return this.materialsService.findAll(userId, query);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user favorites' })
  async getFavorites(@CurrentUser('id') userId: string) {
    return this.materialsService.getFavorites(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.materialsService.findOne(id, userId);
  }

  @Post(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add material to favorites' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  async addFavorite(@Param('id') materialId: string, @CurrentUser('id') userId: string) {
    return this.materialsService.addFavorite(userId, materialId);
  }

  @Delete(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove material from favorites' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  async removeFavorite(@Param('id') materialId: string, @CurrentUser('id') userId: string) {
    return this.materialsService.removeFavorite(userId, materialId);
  }
}
