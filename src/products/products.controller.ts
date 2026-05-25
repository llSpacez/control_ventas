import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('low-stock')
  @Roles('admin', 'manager')
  async getLowStock(@Query('threshold') threshold?: number) {
    return this.productsService.getLowStock(threshold || 10);
  }

  @Get('code/:code')
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findByCode(@Param('code') code: string) {
    const product = await this.productsService.findByCode(code);
    return {
      success: true,
      data: product,
    };
  }

  @Get(':id')
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    return {
      success: true,
      data: product,
    };
  }

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createProductDto: Partial<Product>) {
    const product = await this.productsService.create(createProductDto);
    return {
      success: true,
      message: 'Producto creado exitosamente',
      data: product,
    };
  }

  @Put(':id')
  @Roles('admin', 'manager')
  async update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>) {
    const product = await this.productsService.update(+id, updateProductDto);
    return {
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return {
      success: true,
      message: 'Producto eliminado exitosamente',
    };
  }

  @Put(':id/stock')
  @Roles('admin', 'manager')
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @Body('type') type: 'increase' | 'decrease',
  ) {
    const product = await this.productsService.updateStock(+id, quantity, type);
    return {
      success: true,
      message: 'Stock actualizado exitosamente',
      data: product,
    };
  }
}