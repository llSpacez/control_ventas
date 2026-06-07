"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getInvoice(id) {
        return this.reportsService.getInvoice(+id);
    }
    async getSalesMasterDetail() {
        return this.reportsService.getSalesMasterDetail();
    }
    async getSalesByDateRange(startDate, endDate) {
        return this.reportsService.getSalesByDateRange(new Date(startDate), new Date(endDate));
    }
    async getSalesByCustomer(customerId) {
        return this.reportsService.getSalesByCustomer(+customerId);
    }
    async getTopProducts(limit) {
        return this.reportsService.getTopProducts(limit ? +limit : 10);
    }
    async getLowStockProducts(threshold) {
        return this.reportsService.getLowStockProducts(threshold ? +threshold : 10);
    }
    async getSalesByUser(userId, startDate, endDate) {
        return this.reportsService.getSalesByUser(+userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getDailySalesSummary(date) {
        return this.reportsService.getDailySalesSummary(date ? new Date(date) : new Date());
    }
    async getPurchasesBySupplier(supplierId, startDate, endDate) {
        return this.reportsService.getPurchasesBySupplier(+supplierId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getExpensesByCategory(startDate, endDate) {
        return this.reportsService.getExpensesByCategory(new Date(startDate), new Date(endDate));
    }
    async getProductProfitability() {
        return this.reportsService.getProductProfitability();
    }
    async getFrequentCustomers(minPurchases) {
        return this.reportsService.getFrequentCustomers(minPurchases ? +minPurchases : 5);
    }
    async getInventoryByWarehouse() {
        return this.reportsService.getInventoryByWarehouse();
    }
    async getMonthlyBilling(year) {
        return this.reportsService.getMonthlyBilling(year ? +year : new Date().getFullYear());
    }
    async getBusinessSummary() {
        return this.reportsService.getBusinessSummary();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('invoice/:id'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInvoice", null);
__decorate([
    (0, common_1.Get)('sales-master-detail'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesMasterDetail", null);
__decorate([
    (0, common_1.Get)('sales-by-date'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesByDateRange", null);
__decorate([
    (0, common_1.Get)('sales-by-customer/:customerId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller'),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesByCustomer", null);
__decorate([
    (0, common_1.Get)('top-products'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTopProducts", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLowStockProducts", null);
__decorate([
    (0, common_1.Get)('sales-by-user/:userId'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesByUser", null);
__decorate([
    (0, common_1.Get)('daily-sales'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'cashier'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailySalesSummary", null);
__decorate([
    (0, common_1.Get)('purchases-by-supplier/:supplierId'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('supplierId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPurchasesBySupplier", null);
__decorate([
    (0, common_1.Get)('expenses-by-category'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getExpensesByCategory", null);
__decorate([
    (0, common_1.Get)('profitability'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getProductProfitability", null);
__decorate([
    (0, common_1.Get)('frequent-customers'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('minPurchases')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getFrequentCustomers", null);
__decorate([
    (0, common_1.Get)('inventory-by-warehouse'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInventoryByWarehouse", null);
__decorate([
    (0, common_1.Get)('monthly-billing'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMonthlyBilling", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller', 'cashier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getBusinessSummary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map