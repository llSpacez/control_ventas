import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.sevice';
import { Category } from '../entities/category.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @Roles('admin', 'manager', 'seller')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Get('tree')
  @Roles('admin', 'manager', 'seller')
  async getTree() {
    const data = await this.categoriesService.getTree();
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @Roles('admin', 'manager', 'seller')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(+id);
    return {
      success: true,
      data: category,
    };
  }

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createCategoryDto: Partial<Category>) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      message: 'Categoría creada exitosamente',
      data: category,
    };
  }

  @Put(':id')
  @Roles('admin', 'manager')
  async update(@Param('id') id: string, @Body() updateCategoryDto: Partial<Category>) {
    const category = await this.categoriesService.update(+id, updateCategoryDto);
    return {
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);
    return {
      success: true,
      message: 'Categoría eliminada exitosamente',
    };
  }
}