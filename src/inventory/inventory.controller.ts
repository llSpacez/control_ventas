import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @Roles('admin', 'manager', 'seller')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.inventoryService.findAll(paginationDto);
  }

  @Get('low-stock')
  @Roles('admin', 'manager')
  async getLowStock(@Query('threshold') threshold?: number) {
    return this.inventoryService.getLowStock(threshold || 10);
  }

  @Get('warehouses')
  @Roles('admin', 'manager', 'seller')
  async getWarehouses() {
    return this.inventoryService.getWarehouses();
  }

  @Get('product/:productId')
  @Roles('admin', 'manager', 'seller')
  async findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(+productId);
  }

  @Get('warehouse/:warehouseId')
  @Roles('admin', 'manager')
  async findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.findByWarehouse(+warehouseId);
  }

  @Get(':id')
  @Roles('admin', 'manager')
  async findOne(@Param('id') id: string) {
    const inventory = await this.inventoryService.findOne(+id);
    return {
      success: true,
      data: inventory,
    };
  }

  @Put('stock')
  @Roles('admin', 'manager')
  async updateStock(
    @Body('productId') productId: number,
    @Body('warehouseId') warehouseId: number,
    @Body('quantity') quantity: number,
    @Body('type') type: 'increase' | 'decrease',
  ) {
    const inventory = await this.inventoryService.updateStock(productId, warehouseId, quantity, type);
    return {
      success: true,
      message: 'Stock actualizado exitosamente',
      data: inventory,
    };
  }

  @Post('transfer')
  @Roles('admin', 'manager')
  async transferStock(
    @Body('productId') productId: number,
    @Body('fromWarehouseId') fromWarehouseId: number,
    @Body('toWarehouseId') toWarehouseId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.transferStock(productId, fromWarehouseId, toWarehouseId, quantity);
  }
}