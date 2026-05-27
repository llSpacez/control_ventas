import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Purchase } from '../entities/purchase.entity';
import { Expense } from '../entities/expense.entity';
import { Inventory } from '../entities/inventory.entity';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saleDetailRepository: Repository<SaleDetail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  // Reporte 1: Factura detallada
  async getInvoice(id: number) {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: {customer: true, user: true, details: {product: true}},
    });
    return {
      success: true,
      data: sale,
    };
  }

  // Reporte 2: Maestro-Detalle de Ventas
  async getSalesMasterDetail() {
    const sales = await this.saleRepository.find({
      relations: {customer: true, details: {product: true}, user: true},
      order: { saleDate: 'DESC' },
    });
    
    const details = await this.saleDetailRepository.find({
      relations: {sale: true, product: true},
    });
    
    return {
      success: true,
      sales,
      details,
    };
  }

  // Reporte 3: Ventas por rango de fechas (con parámetros)
  async getSalesByDateRange(startDate: Date, endDate: Date) {
    const sales = await this.saleRepository.find({
      where: { saleDate: Between(startDate, endDate), status: 'completed' },
      relations: {customer: true, user: true},
      order: { saleDate: 'DESC' },
    });
    
    const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    const average = total / sales.length || 0;
    
    return {
      success: true,
      data: sales,
      total,
      average,
      count: sales.length,
      startDate,
      endDate,
    };
  }

  // Reporte 4: Ventas por cliente
  async getSalesByCustomer(customerId: number) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    
    const sales = await this.saleRepository.find({
      where: { customerId, status: 'completed' },
      relations: {details: {product: true}, user: true},
      order: { saleDate: 'DESC' },
    });
    
    const totalSpent = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    
    return {
      success: true,
      customer,
      sales,
      totalSpent,
      totalSales: sales.length,
    };
  }

  // Reporte 5: Productos más vendidos
  async getTopProducts(limit: number = 10) {
    const results = await this.saleDetailRepository
      .createQueryBuilder('detail')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.code', 'productCode')
      .addSelect('SUM(detail.quantity)', 'totalQuantity')
      .addSelect('SUM(detail.subtotal)', 'totalAmount')
      .addSelect('AVG(detail.unitPrice)', 'averagePrice')
      .leftJoin('detail.product', 'product')
      .groupBy('product.id')
      .orderBy('totalQuantity', 'DESC')
      .limit(limit)
      .getRawMany();
    
    return {
      success: true,
      data: results,
    };
  }

  // Reporte 6: Productos con bajo stock
  async getLowStockProducts(threshold: number = 10) {
    const products = await this.productRepository.find({
      where: { stock: LessThan(threshold), isActive: true },
      relations: {category: true, supplier: true},
      order: { stock: 'ASC' },
    });
    
    return {
      success: true,
      data: products,
      count: products.length,
      threshold,
    };
  }

  // Reporte 7: Ventas por usuario/vendedor
  async getSalesByUser(userId: number, startDate?: Date, endDate?: Date) {
    const whereCondition: any = { userId, status: 'completed' };
    if (startDate && endDate) {
      whereCondition.saleDate = Between(startDate, endDate);
    }
    
    const sales = await this.saleRepository.find({
      where: whereCondition,
      relations: {customer: true},
      order: { saleDate: 'DESC' },
    });
    
    const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    
    return {
      success: true,
      sales,
      total,
      count: sales.length,
    };
  }

  // Reporte 8: Resumen de ventas diarias
  async getDailySalesSummary(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await this.saleRepository.find({
      where: { saleDate: Between(startOfDay, endOfDay), status: 'completed' },
      relations: {customer: true},
    });

    const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    const count = sales.length;
    const average = total / count || 0;

    // Ventas por método de pago
    const paymentsByMethod = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.paymentMethod', 'method')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.paymentDate BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
      .groupBy('payment.paymentMethod')
      .getRawMany();

    return { 
      date, 
      total, 
      count, 
      average,
      paymentsByMethod,
      sales 
    };
  }

  // Reporte 9: Compras por proveedor
  async getPurchasesBySupplier(supplierId: number, startDate?: Date, endDate?: Date) {
    const whereCondition: any = { supplierId };
    if (startDate && endDate) {
      whereCondition.purchaseDate = Between(startDate, endDate);
    }
    
    const purchases = await this.purchaseRepository.find({
      where: whereCondition,
      relations: {details: {product: true}, user: true},
      order: { purchaseDate: 'DESC' },
    });
    
    const total = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
    
    return {
      success: true,
      purchases,
      total,
      count: purchases.length,
    };
  }

  // Reporte 10: Gastos por categoría
  async getExpensesByCategory(startDate: Date, endDate: Date) {
    const expenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .addSelect('COUNT(expense.id)', 'count')
      .where('expense.expenseDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('expense.category')
      .orderBy('total', 'DESC')
      .getRawMany();
    
    const grandTotal = expenses.reduce((sum, cat) => sum + Number(cat.total), 0);
    
    return {
      success: true,
      data: expenses,
      grandTotal,
      startDate,
      endDate,
    };
  }

  // Reporte 11: Rentabilidad por producto
  async getProductProfitability() {
    const products = await this.productRepository.find({
      where: { isActive: true },
      relations: {category: true},
    });
    
    const profitability = products.map(product => ({
      ...product,
      profit: Number(product.price) - Number(product.cost),
      margin: ((Number(product.price) - Number(product.cost)) / Number(product.price)) * 100,
    }));
    
    const sorted = profitability.sort((a, b) => b.margin - a.margin);
    const totalProfit = sorted.reduce((sum, p) => sum + p.profit * p.stock, 0);
    
    return {
      success: true,
      data: sorted,
      totalProfit,
    };
  }

  // Reporte 12: Clientes frecuentes
  async getFrequentCustomers(minPurchases: number = 5) {
    const customers = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.sales', 'sale')
      .select('customer.id', 'id')
      .addSelect('customer.fullName', 'fullName')
      .addSelect('customer.documentNumber', 'documentNumber')
      .addSelect('customer.email', 'email')
      .addSelect('customer.phone', 'phone')
      .addSelect('COUNT(sale.id)', 'purchaseCount')
      .addSelect('SUM(sale.total)', 'totalSpent')
      .addSelect('AVG(sale.total)', 'averagePurchase')
      .where('sale.status = :status', { status: 'completed' })
      .groupBy('customer.id')
      .having('COUNT(sale.id) >= :minPurchases', { minPurchases })
      .orderBy('totalSpent', 'DESC')
      .getRawMany();
    
    return {
      success: true,
      data: customers,
      minPurchases,
    };
  }

  // Reporte 13: Inventario por almacén
  async getInventoryByWarehouse() {
    const inventory = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .orderBy('warehouse.name', 'ASC')
      .addOrderBy('product.name', 'ASC')
      .getMany();
    
    // Agrupar por almacén
    const grouped = inventory.reduce((acc, item) => {
      const warehouseName = item.warehouse?.name || 'Sin almacén';
      if (!acc[warehouseName]) {
        acc[warehouseName] = [];
      }
      acc[warehouseName].push(item);
      return acc;
    }, {});
    
    return {
      success: true,
      data: grouped,
    };
  }

  // Reporte 14: Facturación mensual
  async getMonthlyBilling(year: number) {
    const results = await this.saleRepository
      .createQueryBuilder('sale')
      .select('MONTH(sale.saleDate)', 'month')
      .addSelect('YEAR(sale.saleDate)', 'year')
      .addSelect('SUM(sale.total)', 'total')
      .addSelect('COUNT(sale.id)', 'count')
      .where('YEAR(sale.saleDate) = :year', { year })
      .andWhere('sale.status = :status', { status: 'completed' })
      .groupBy('MONTH(sale.saleDate)')
      .orderBy('month', 'ASC')
      .getRawMany();
    
    const yearlyTotal = results.reduce((sum, month) => sum + Number(month.total), 0);
    
    return {
      success: true,
      data: results,
      year,
      yearlyTotal,
    };
  }

  // Reporte 15: Resumen general del negocio (Dashboard)
  async getBusinessSummary() {
    // Ventas totales
    const totalSales = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.total)', 'total')
      .where('sale.status = :status', { status: 'completed' })
      .getRawOne();

    // Ventas hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySales = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.total)', 'total')
      .where('sale.saleDate BETWEEN :today AND :tomorrow', { today, tomorrow })
      .andWhere('sale.status = :status', { status: 'completed' })
      .getRawOne();

    // Clientes
    const totalCustomers = await this.customerRepository.count();
    const activeCustomers = await this.customerRepository.count({ where: { isActive: true } });

    // Productos
    const totalProducts = await this.productRepository.count();
    const lowStockProducts = await this.productRepository.count({ where: { stock: LessThan(10) } });

    // Gastos
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthlyExpenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.expenseDate BETWEEN :start AND :end', { start: startOfMonth, end: endOfMonth })
      .getRawOne();

    // Inventario valorizado
    const inventoryValue = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoin('inventory.product', 'product')
      .select('SUM(inventory.quantity * product.cost)', 'total')
      .getRawOne();

    // Ventas por método de pago
    const paymentsByMethod = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.paymentMethod', 'method')
      .addSelect('SUM(payment.amount)', 'total')
      .groupBy('payment.paymentMethod')
      .getRawMany();

    return {
      success: true,
      data: {
        sales: {
          total: Number(totalSales?.total || 0),
          today: Number(todaySales?.total || 0),
        },
        customers: {
          total: totalCustomers,
          active: activeCustomers,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
        },
        expenses: {
          monthly: Number(monthlyExpenses?.total || 0),
        },
        inventory: {
          value: Number(inventoryValue?.total || 0),
        },
        payments: paymentsByMethod,
      },
    };
  }
}