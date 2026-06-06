import { Controller, Get, Post, Body, Put, Param, Query, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('purchases')
@ApiBearerAuth('JWT-auth')
@Controller('purchases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get()
  @Roles('admin', 'manager')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.purchasesService.findAll(paginationDto);
  }

  @Get('date-range')
  @Roles('admin', 'manager')
  async getByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.purchasesService.getPurchasesByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @Roles('admin', 'manager')
  async findOne(@Param('id') id: string) {
    const purchase = await this.purchasesService.findOne(+id);
    return {
      success: true,
      data: purchase,
    };
  }

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createPurchaseDto: any) {
    const purchase = await this.purchasesService.create(createPurchaseDto);
    return {
      success: true,
      message: 'Compra registrada exitosamente',
      data: purchase,
    };
  }

  @Put(':id/status')
  @Roles('admin', 'manager')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const purchase = await this.purchasesService.updateStatus(+id, status);
    return {
      success: true,
      message: 'Estado actualizado exitosamente',
      data: purchase,
    };
  }
}