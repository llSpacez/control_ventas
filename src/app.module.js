"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const customers_module_1 = require("./customers/customers.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const sales_module_1 = require("./sales/sales.module");
const purchases_module_1 = require("./purchases/purchases.module");
const inventory_module_1 = require("./inventory/inventory.module");
const reports_module_1 = require("./reports/reports.module");
const backup_module_1 = require("./backup/backup.module");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("./entities/role.entity");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
const customer_entity_1 = require("./entities/customer.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const sale_entity_1 = require("./entities/sale.entity");
const sale_detail_entity_1 = require("./entities/sale-detail.entity");
const purchase_entity_1 = require("./entities/purchase.entity");
const purchase_detail_entity_1 = require("./entities/purchase-detail.entity");
const payment_entity_1 = require("./entities/payment.entity");
const inventory_entity_1 = require("./entities/inventory.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const tax_entity_1 = require("./entities/tax.entity");
const discount_entity_1 = require("./entities/discount.entity");
const return_entity_1 = require("./entities/return.entity");
const return_detail_entity_1 = require("./entities/return-detail.entity");
const cash_register_entity_1 = require("./entities/cash-register.entity");
const expense_entity_1 = require("./entities/expense.entity");
const system_log_entity_1 = require("./entities/system-log.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: parseInt(configService.get('DB_PORT') ?? '3306', 10),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [
                        user_entity_1.User,
                        role_entity_1.Role,
                        category_entity_1.Category,
                        product_entity_1.Product,
                        customer_entity_1.Customer,
                        supplier_entity_1.Supplier,
                        sale_entity_1.Sale,
                        sale_detail_entity_1.SaleDetail,
                        purchase_entity_1.Purchase,
                        purchase_detail_entity_1.PurchaseDetail,
                        payment_entity_1.Payment,
                        inventory_entity_1.Inventory,
                        warehouse_entity_1.Warehouse,
                        tax_entity_1.Tax,
                        discount_entity_1.Discount,
                        return_entity_1.Return,
                        return_detail_entity_1.ReturnDetail,
                        cash_register_entity_1.CashRegister,
                        expense_entity_1.Expense,
                        system_log_entity_1.SystemLog,
                    ],
                    synchronize: false,
                    logging: true,
                    charset: 'utf8mb4',
                }),
                inject: [config_1.ConfigService],
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/public',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            customers_module_1.CustomersModule,
            suppliers_module_1.SuppliersModule,
            sales_module_1.SalesModule,
            purchases_module_1.PurchasesModule,
            inventory_module_1.InventoryModule,
            reports_module_1.ReportsModule,
            backup_module_1.BackupModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map