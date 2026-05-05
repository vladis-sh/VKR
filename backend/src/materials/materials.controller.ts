import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MaterialsService } from './materials.service';
import { QueryMaterialsDto } from './dto/query-materials.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Materials')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  // ----- Admin endpoints -----

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: list all materials including drafts' })
  async adminFindAll(@Query() query: QueryMaterialsDto) {
    return this.materialsService.adminFindAll(query);
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: get material by ID (any state)' })
  @ApiParam({ name: 'id' })
  async adminFindOne(@Param('id') id: string) {
    return this.materialsService.adminFindOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin: create new material' })
  async create(@Body() dto: CreateMaterialDto) {
    return this.materialsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: update material' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return this.materialsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: soft delete material' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string) {
    return this.materialsService.softDelete(id);
  }

  // ----- User endpoints -----

  @Get()
  @ApiOperation({ summary: 'Get paginated list of published materials' })
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
  @ApiOperation({ summary: 'Get published material by ID' })
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
