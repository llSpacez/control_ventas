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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("../entities/inventory.entity");
const product_entity_1 = require("../entities/product.entity");
const warehouse_entity_1 = require("../entities/warehouse.entity");
let InventoryService = class InventoryService {
    constructor(inventoryRepository, productRepository, warehouseRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }
    async findAll(paginationDto) {
        const { page, limit, search, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.product', 'product')
            .leftJoinAndSelect('inventory.warehouse', 'warehouse');
        if (search) {
            queryBuilder.where('product.name LIKE :search', { search: `%${search}%` })
                .orWhere('product.code LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.orderBy(`inventory.${sortBy}`, sortOrder)
            .skip(skip)
            .take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            success: true,
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const inventory = await this.inventoryRepository.findOne({
            where: { id },
            relations: { product: true, warehouse: true },
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventario con ID ${id} no encontrado`);
        }
        return inventory;
    }
    async findByProduct(productId) {
        const inventory = await this.inventoryRepository.find({
            where: { productId },
            relations: { product: true, warehouse: true },
        });
        return {
            success: true,
            data: inventory,
        };
    }
    async findByWarehouse(warehouseId) {
        const inventory = await this.inventoryRepository.find({
            where: { warehouseId },
            relations: { product: true, warehouse: true },
        });
        const totalValue = inventory.reduce((sum, item) => {
            return sum + (item.quantity * Number(item.product.price));
        }, 0);
        return {
            success: true,
            data: inventory,
            totalValue,
        };
    }
    async updateStock(productId, warehouseId, quantity, type) {
        let inventory = await this.inventoryRepository.findOne({
            where: { productId, warehouseId },
        });
        if (!inventory) {
            inventory = this.inventoryRepository.create({
                productId,
                warehouseId,
                quantity: 0,
                minStock: 5,
                maxStock: 100,
            });
        }
        if (type === 'increase') {
            inventory.quantity += quantity;
        }
        else {
            if (inventory.quantity < quantity) {
                throw new Error('Stock insuficiente');
            }
            inventory.quantity -= quantity;
        }
        return this.inventoryRepository.save(inventory);
    }
    async getLowStock(threshold = 10) {
        const inventory = await this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.product', 'product')
            .leftJoinAndSelect('inventory.warehouse', 'warehouse')
            .where('inventory.quantity <= :threshold', { threshold })
            .orderBy('inventory.quantity', 'ASC')
            .getMany();
        return {
            success: true,
            data: inventory,
            count: inventory.length,
        };
    }
    async transferStock(productId, fromWarehouseId, toWarehouseId, quantity) {
        await this.updateStock(productId, fromWarehouseId, quantity, 'decrease');
        await this.updateStock(productId, toWarehouseId, quantity, 'increase');
        return {
            success: true,
            message: 'Transferencia realizada exitosamente',
        };
    }
    async getWarehouses() {
        const warehouses = await this.warehouseRepository.find();
        return {
            success: true,
            data: warehouses,
        };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map