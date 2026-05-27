import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.salesService.findAll(paginationDto);
  }

  @Get('date-range')
  @Roles('admin', 'manager')
  async getByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.salesService.getSalesByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('daily')
  @Roles('admin', 'manager', 'cashier')
  async getDaily(@Query('date') date: string) {
    return this.salesService.getDailySales(date ? new Date(date) : new Date());
  }

  @Get('invoice/:invoiceNumber')
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findByInvoice(@Param('invoiceNumber') invoiceNumber: string) {
    const sale = await this.salesService.findByInvoice(invoiceNumber);
    return {
      success: true,
      data: sale,
    };
  }

  @Get(':id')
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findOne(@Param('id') id: string) {
    const sale = await this.salesService.findOne(+id);
    return {
      success: true,
      data: sale,
    };
  }

  @Post()
  @Roles('admin', 'manager', 'seller')
  async create(@Body() createSaleDto: any) {
    const sale = await this.salesService.create(createSaleDto);
    return {
      success: true,
      message: 'Venta registrada exitosamente',
      data: sale,
    };
  }

  @Put(':id/status')
  @Roles('admin', 'manager')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const sale = await this.salesService.updateStatus(+id, status);
    return {
      success: true,
      message: 'Estado actualizado exitosamente',
      data: sale,
    };
  }

  @Post(':id/cancel')
  @Roles('admin', 'manager')
  async cancel(@Param('id') id: string) {
    const sale = await this.salesService.cancel(+id);
    return {
      success: true,
      message: 'Venta cancelada exitosamente',
      data: sale,
    };
  }
}