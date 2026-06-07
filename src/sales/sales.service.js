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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../entities/sale.entity");
const sale_detail_entity_1 = require("../entities/sale-detail.entity");
const product_entity_1 = require("../entities/product.entity");
const customer_entity_1 = require("../entities/customer.entity");
const payment_entity_1 = require("../entities/payment.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
let SalesService = class SalesService {
    constructor(saleRepository, saleDetailRepository, productRepository, customerRepository, paymentRepository, inventoryRepository) {
        this.saleRepository = saleRepository;
        this.saleDetailRepository = saleDetailRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.paymentRepository = paymentRepository;
        this.inventoryRepository = inventoryRepository;
    }
    async findAll(paginationDto) {
        const { page, limit, search, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.saleRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.user', 'user');
        if (search) {
            queryBuilder.where('sale.invoiceNumber LIKE :search', { search: `%${search}%` })
                .orWhere('customer.fullName LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.orderBy(`sale.${sortBy}`, sortOrder)
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
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: {
                customer: true,
                user: true,
                details: { product: true },
                payments: true,
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        return sale;
    }
    async findByInvoice(invoiceNumber) {
        const sale = await this.saleRepository.findOne({
            where: { invoiceNumber },
            relations: {
                customer: true,
                user: true,
                details: { product: true },
                payments: true,
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException(`Factura ${invoiceNumber} no encontrada`);
        }
        return sale;
    }
    async create(saleData) {
        const { details, payment, ...saleInfo } = saleData;
        let customer = await this.customerRepository.findOne({
            where: { id: saleInfo.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        for (const item of details) {
            const product = await this.productRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Producto ${item.productId} no encontrado`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.ConflictException(`Stock insuficiente para ${product.name}. Stock actual: ${product.stock}`);
            }
        }
        const lastSale = await this.saleRepository.find({
            order: { id: 'DESC' },
            take: 1,
        });
        const invoiceNumber = `INV-${String((lastSale[0]?.id || 0) + 1).padStart(6, '0')}`;
        let subtotal = 0;
        for (const item of details) {
            const product = await this.productRepository.findOne({
                where: { id: item.productId },
            });
            item.unitPrice = product.price;
            item.subtotal = item.quantity * product.price;
            subtotal += item.subtotal;
        }
        const tax = subtotal * 0.18;
        const total = subtotal + tax;
        const sale = this.saleRepository.create({
            ...saleInfo,
            invoiceNumber,
            subtotal,
            tax,
            total,
            status: 'completed',
            paymentStatus: payment ? 'paid' : 'pending',
        });
        const savedSale = (await this.saleRepository.save(sale));
        for (const item of details) {
            const detail = this.saleDetailRepository.create({
                saleId: savedSale.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal,
            });
            await this.saleDetailRepository.save(detail);
            await this.productRepository.decrement({ id: item.productId }, 'stock', item.quantity);
            await this.inventoryRepository.decrement({ productId: item.productId }, 'quantity', item.quantity);
        }
        if (payment) {
            const newPayment = this.paymentRepository.create({
                saleId: savedSale.id,
                amount: payment.amount,
                paymentMethod: payment.method,
                status: 'completed',
                userId: saleInfo.userId,
            });
            await this.paymentRepository.save(newPayment);
        }
        return this.findOne(savedSale.id);
    }
    async updateStatus(id, status) {
        const sale = await this.findOne(id);
        sale.status = status;
        return this.saleRepository.save(sale);
    }
    async cancel(id) {
        const sale = await this.findOne(id);
        if (sale.status === 'cancelled') {
            throw new common_1.ConflictException('La venta ya está cancelada');
        }
        for (const detail of sale.details) {
            await this.productRepository.increment({ id: detail.productId }, 'stock', detail.quantity);
            await this.inventoryRepository.increment({ productId: detail.productId }, 'quantity', detail.quantity);
        }
        sale.status = 'cancelled';
        return this.saleRepository.save(sale);
    }
    async getSalesByDateRange(startDate, endDate) {
        const sales = await this.saleRepository.find({
            where: { saleDate: (0, typeorm_2.Between)(startDate, endDate) },
            relations: {
                customer: true,
                user: true,
            },
            order: { saleDate: 'DESC' },
        });
        const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        return {
            success: true,
            data: sales,
            total,
            count: sales.length,
        };
    }
    async getDailySales(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.getSalesByDateRange(startOfDay, endOfDay);
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_detail_entity_1.SaleDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(5, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SalesService);
//# sourceMappingURL=sales.service.js.map