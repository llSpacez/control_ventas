import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Purchase } from '../entities/purchase.entity';
import { PurchaseDetail } from '../entities/purchase-detail.entity';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { Inventory } from '../entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, PurchaseDetail, Product, Supplier, Inventory]),
  ],
  providers: [PurchasesService],
  controllers: [PurchasesController],
  exports: [PurchasesService],
})
export class PurchasesModule {}