import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from '../entities/supplier.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('suppliers')
@ApiBearerAuth('JWT-auth')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  @Roles('admin', 'manager')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.suppliersService.findAll(paginationDto);
  }

  @Get('ruc/:ruc')
  @Roles('admin', 'manager')
  async findByRuc(@Param('ruc') ruc: string) {
    const supplier = await this.suppliersService.findByRuc(ruc);
    return {
      success: true,
      data: supplier,
    };
  }

  @Get(':id/products')
  @Roles('admin', 'manager')
  async getProducts(@Param('id') id: string) {
    return this.suppliersService.getProducts(+id);
  }

  @Get(':id')
  @Roles('admin', 'manager')
  async findOne(@Param('id') id: string) {
    const supplier = await this.suppliersService.findOne(+id);
    return {
      success: true,
      data: supplier,
    };
  }

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createSupplierDto: Partial<Supplier>) {
    const supplier = await this.suppliersService.create(createSupplierDto);
    return {
      success: true,
      message: 'Proveedor creado exitosamente',
      data: supplier,
    };
  }

  @Put(':id')
  @Roles('admin', 'manager')
  async update(@Param('id') id: string, @Body() updateSupplierDto: Partial<Supplier>) {
    const supplier = await this.suppliersService.update(+id, updateSupplierDto);
    return {
      success: true,
      message: 'Proveedor actualizado exitosamente',
      data: supplier,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.suppliersService.remove(+id);
    return {
      success: true,
      message: 'Proveedor eliminado exitosamente',
    };
  }
}