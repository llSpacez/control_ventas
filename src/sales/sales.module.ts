import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';
import { Inventory } from '../entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleDetail, Product, Customer, Payment, Inventory]),
  ],
  providers: [SalesService],
  controllers: [SalesController],
  exports: [SalesService],
})
export class SalesModule {}