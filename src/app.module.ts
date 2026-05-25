import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Módulos
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SalesModule } from './sales/sales.module';
import { PurchasesModule } from './purchases/purchases.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReportsModule } from './reports/reports.module';
import { BackupModule } from './backup/backup.module';

// Entidades
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Customer } from './entities/customer.entity';
import { Supplier } from './entities/supplier.entity';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { Purchase } from './entities/purchase.entity';
import { PurchaseDetail } from './entities/purchase-detail.entity';
import { Payment } from './entities/payment.entity';
import { Inventory } from './entities/inventory.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Tax } from './entities/tax.entity';
import { Discount } from './entities/discount.entity';
import { Return } from './entities/return.entity';
import { ReturnDetail } from './entities/return-detail.entity';
import { CashRegister } from './entities/cash-register.entity';
import { Expense } from './entities/expense.entity';
import { SystemLog } from './entities/system-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') ?? '3306', 10),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Role,
          Category,
          Product,
          Customer,
          Supplier,
          Sale,
          SaleDetail,
          Purchase,
          PurchaseDetail,
          Payment,
          Inventory,
          Warehouse,
          Tax,
          Discount,
          Return,
          ReturnDetail,
          CashRegister,
          Expense,
          SystemLog,
        ],
        synchronize: false,
        logging: true,
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CustomersModule,
    SuppliersModule,
    SalesModule,
    PurchasesModule,
    InventoryModule,
    ReportsModule,
    BackupModule,
  ],
})
export class AppModule {}
