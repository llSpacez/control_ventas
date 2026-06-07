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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_entity_1 = require("../entities/purchase.entity");
const purchase_detail_entity_1 = require("../entities/purchase-detail.entity");
const product_entity_1 = require("../entities/product.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
let PurchasesService = class PurchasesService {
    constructor(purchaseRepository, purchaseDetailRepository, productRepository, supplierRepository, inventoryRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseDetailRepository = purchaseDetailRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
    }
    async findAll(paginationDto) {
        const { page, limit, search, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.purchaseRepository.createQueryBuilder('purchase')
            .leftJoinAndSelect('purchase.supplier', 'supplier')
            .leftJoinAndSelect('purchase.user', 'user');
        if (search) {
            queryBuilder.where('purchase.purchaseNumber LIKE :search', { search: `%${search}%` })
                .orWhere('supplier.businessName LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.orderBy(`purchase.${sortBy}`, sortOrder)
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
        const purchase = await this.purchaseRepository.findOne({
            where: { id },
            relations: { supplier: true, user: true, details: { product: true } },
        });
        if (!purchase) {
            throw new common_1.NotFoundException(`Compra con ID ${id} no encontrada`);
        }
        return purchase;
    }
    async create(purchaseData) {
        const { details, ...purchaseInfo } = purchaseData;
        const supplier = await this.supplierRepository.findOne({
            where: { id: purchaseInfo.supplierId },
        });
        if (!supplier) {
            throw new common_1.NotFoundException('Proveedor no encontrado');
        }
        const lastPurchase = await this.purchaseRepository.find({
            order: { id: 'DESC' },
            take: 1,
        });
        const purchaseNumber = `PUR-${String((lastPurchase[0]?.id || 0) + 1).padStart(6, '0')}`;
        let subtotal = 0;
        for (const item of details) {
            const product = await this.productRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Producto ${item.productId} no encontrado`);
            }
            item.unitCost = item.cost || product.cost;
            item.subtotal = item.quantity * item.unitCost;
            subtotal += item.subtotal;
        }
        const tax = subtotal * 0.18;
        const total = subtotal + tax;
        const purchase = this.purchaseRepository.create({
            ...purchaseInfo,
            purchaseNumber,
            subtotal,
            tax,
            total,
            status: 'received',
        });
        const savedPurchase = (await this.purchaseRepository.save(purchase));
        for (const item of details) {
            const detail = this.purchaseDetailRepository.create({
                purchaseId: savedPurchase.id,
                productId: item.productId,
                quantity: item.quantity,
                unitCost: item.unitCost,
                subtotal: item.subtotal,
            });
            await this.purchaseDetailRepository.save(detail);
            await this.productRepository.increment({ id: item.productId }, 'stock', item.quantity);
            const product = await this.productRepository.findOne({
                where: { id: item.productId },
            });
            const newCost = ((product.cost * product.stock) + (item.unitCost * item.quantity)) / (product.stock + item.quantity);
            await this.productRepository.update(item.productId, { cost: newCost });
            const inventory = await this.inventoryRepository.findOne({
                where: { productId: item.productId },
            });
            if (inventory) {
                await this.inventoryRepository.increment({ productId: item.productId }, 'quantity', item.quantity);
            }
        }
        return this.findOne(savedPurchase.id);
    }
    async updateStatus(id, status) {
        const purchase = await this.findOne(id);
        purchase.status = status;
        return this.purchaseRepository.save(purchase);
    }
    async getPurchasesByDateRange(startDate, endDate) {
        const purchases = await this.purchaseRepository.find({
            where: { purchaseDate: (0, typeorm_2.Between)(startDate, endDate) },
            relations: { supplier: true, user: true },
            order: { purchaseDate: 'DESC' },
        });
        const total = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
        return {
            success: true,
            data: purchases,
            total,
            count: purchases.length,
        };
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_detail_entity_1.PurchaseDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(4, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map