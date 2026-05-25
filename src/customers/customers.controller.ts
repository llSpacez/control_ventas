import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '../entities/customer.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(paginationDto);
  }

  @Get('document/:documentNumber')
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findByDocument(@Param('documentNumber') documentNumber: string) {
    const customer = await this.customersService.findByDocument(documentNumber);
    return {
      success: true,
      data: customer,
    };
  }

  @Get(':id/sales')
  @Roles('admin', 'manager', 'seller')
  async getSalesHistory(@Param('id') id: string) {
    return this.customersService.getSalesHistory(+id);
  }

  @Get(':id')
  @Roles('admin', 'manager', 'seller', 'cashier')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOne(+id);
    return {
      success: true,
      data: customer,
    };
  }

  @Post()
  @Roles('admin', 'manager', 'seller')
  async create(@Body() createCustomerDto: Partial<Customer>) {
    const customer = await this.customersService.create(createCustomerDto);
    return {
      success: true,
      message: 'Cliente creado exitosamente',
      data: customer,
    };
  }

  @Put(':id')
  @Roles('admin', 'manager', 'seller')
  async update(@Param('id') id: string, @Body() updateCustomerDto: Partial<Customer>) {
    const customer = await this.customersService.update(+id, updateCustomerDto);
    return {
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: customer,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.customersService.remove(+id);
    return {
      success: true,
      message: 'Cliente eliminado exitosamente',
    };
  }
}