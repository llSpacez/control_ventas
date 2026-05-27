import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Purchase } from '../entities/purchase.entity';
import { Expense } from '../entities/expense.entity';
import { Inventory } from '../entities/inventory.entity';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleDetail, Product, Customer, Purchase, Expense, Inventory, Payment]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}