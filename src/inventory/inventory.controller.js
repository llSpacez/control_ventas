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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const pagination_dto_1 = require("../dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async findAll(paginationDto) {
        return this.inventoryService.findAll(paginationDto);
    }
    async getLowStock(threshold) {
        return this.inventoryService.getLowStock(threshold || 10);
    }
    async getWarehouses() {
        return this.inventoryService.getWarehouses();
    }
    async findByProduct(productId) {
        return this.inventoryService.findByProduct(+productId);
    }
    async findByWarehouse(warehouseId) {
        return this.inventoryService.findByWarehouse(+warehouseId);
    }
    async findOne(id) {
        const inventory = await this.inventoryService.findOne(+id);
        return {
            success: true,
            data: inventory,
        };
    }
    async updateStock(productId, warehouseId, quantity, type) {
        const inventory = await this.inventoryService.updateStock(productId, warehouseId, quantity, type);
        return {
            success: true,
            message: 'Stock actualizado exitosamente',
            data: inventory,
        };
    }
    async transferStock(productId, fromWarehouseId, toWarehouseId, quantity) {
        return this.inventoryService.transferStock(productId, fromWarehouseId, toWarehouseId, quantity);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)('warehouses'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getWarehouses", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'seller'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.Get)('warehouse/:warehouseId'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findByWarehouse", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('stock'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Body)('productId')),
    __param(1, (0, common_1.Body)('warehouseId')),
    __param(2, (0, common_1.Body)('quantity')),
    __param(3, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    __param(0, (0, common_1.Body)('productId')),
    __param(1, (0, common_1.Body)('fromWarehouseId')),
    __param(2, (0, common_1.Body)('toWarehouseId')),
    __param(3, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "transferStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map