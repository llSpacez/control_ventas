import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // Reporte 1: Factura
  @Get('invoice/:id')
  @Roles('admin', 'manager', 'seller')
  async getInvoice(@Param('id') id: string) {
    return this.reportsService.getInvoice(+id);
  }

  // Reporte 2: Maestro-Detalle de Ventas
  @Get('sales-master-detail')
  @Roles('admin', 'manager')
  async getSalesMasterDetail() {
    return this.reportsService.getSalesMasterDetail();
  }

  // Reporte 3: Ventas por rango de fechas
  @Get('sales-by-date')
  @Roles('admin', 'manager', 'seller')
  async getSalesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getSalesByDateRange(new Date(startDate), new Date(endDate));
  }

  // Reporte 4: Ventas por cliente
  @Get('sales-by-customer/:customerId')
  @Roles('admin', 'manager', 'seller')
  async getSalesByCustomer(@Param('customerId') customerId: string) {
    return this.reportsService.getSalesByCustomer(+customerId);
  }

  // Reporte 5: Productos más vendidos
  @Get('top-products')
  @Roles('admin', 'manager', 'seller')
  async getTopProducts(@Query('limit') limit?: string) {
    return this.reportsService.getTopProducts(limit ? +limit : 10);
  }

  // Reporte 6: Productos con bajo stock
  @Get('low-stock')
  @Roles('admin', 'manager')
  async getLowStockProducts(@Query('threshold') threshold?: string) {
    return this.reportsService.getLowStockProducts(threshold ? +threshold : 10);
  }

  // Reporte 7: Ventas por usuario
  @Get('sales-by-user/:userId')
  @Roles('admin', 'manager')
  async getSalesByUser(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getSalesByUser(
      +userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  // Reporte 8: Resumen de ventas diarias
  @Get('daily-sales')
  @Roles('admin', 'manager', 'cashier')
  async getDailySalesSummary(@Query('date') date?: string) {
    return this.reportsService.getDailySalesSummary(date ? new Date(date) : new Date());
  }

  // Reporte 9: Compras por proveedor
  @Get('purchases-by-supplier/:supplierId')
  @Roles('admin', 'manager')
  async getPurchasesBySupplier(
    @Param('supplierId') supplierId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getPurchasesBySupplier(
      +supplierId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  // Reporte 10: Gastos por categoría
  @Get('expenses-by-category')
  @Roles('admin', 'manager')
  async getExpensesByCategory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getExpensesByCategory(new Date(startDate), new Date(endDate));
  }

  // Reporte 11: Rentabilidad por producto
  @Get('profitability')
  @Roles('admin', 'manager')
  async getProductProfitability() {
    return this.reportsService.getProductProfitability();
  }

  // Reporte 12: Clientes frecuentes
  @Get('frequent-customers')
  @Roles('admin', 'manager')
  async getFrequentCustomers(@Query('minPurchases') minPurchases?: string) {
    return this.reportsService.getFrequentCustomers(minPurchases ? +minPurchases : 5);
  }

  // Reporte 13: Inventario por almacén
  @Get('inventory-by-warehouse')
  @Roles('admin', 'manager')
  async getInventoryByWarehouse() {
    return this.reportsService.getInventoryByWarehouse();
  }

  // Reporte 14: Facturación mensual
  @Get('monthly-billing')
  @Roles('admin', 'manager')
  async getMonthlyBilling(@Query('year') year?: string) {
    return this.reportsService.getMonthlyBilling(year ? +year : new Date().getFullYear());
  }

  // Reporte 15: Resumen general (Dashboard)
  @Get('summary')
  @Roles('admin', 'manager', 'seller', 'cashier')
  async getBusinessSummary() {
    return this.reportsService.getBusinessSummary();
  }
}