"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
const sale_entity_1 = require("../entities/sale.entity");
const sale_detail_entity_1 = require("../entities/sale-detail.entity");
const product_entity_1 = require("../entities/product.entity");
const customer_entity_1 = require("../entities/customer.entity");
const purchase_entity_1 = require("../entities/purchase.entity");
const expense_entity_1 = require("../entities/expense.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
const payment_entity_1 = require("../entities/payment.entity");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sale_entity_1.Sale, sale_detail_entity_1.SaleDetail, product_entity_1.Product, customer_entity_1.Customer, purchase_entity_1.Purchase, expense_entity_1.Expense, inventory_entity_1.Inventory, payment_entity_1.Payment]),
        ],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map