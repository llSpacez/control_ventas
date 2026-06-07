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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async findAll(paginationDto) {
        const { page, limit, search, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.supplier', 'supplier');
        if (search) {
            queryBuilder.where('product.name LIKE :search', { search: `%${search}%` })
                .orWhere('product.code LIKE :search', { search: `%${search}%` })
                .orWhere('product.barcode LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.orderBy(`product.${sortBy}`, sortOrder)
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
        const product = await this.productRepository.findOne({
            where: { id },
            relations: { category: true, supplier: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return product;
    }
    async findByCode(code) {
        const product = await this.productRepository.findOne({
            where: { code },
            relations: { category: true, supplier: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con código ${code} no encontrado`);
        }
        return product;
    }
    async create(productData) {
        const existingProduct = await this.productRepository.findOne({
            where: [{ code: productData.code }, { barcode: productData.barcode }],
        });
        if (existingProduct) {
            throw new common_1.ConflictException('El código o código de barras ya existe');
        }
        const product = this.productRepository.create(productData);
        return this.productRepository.save(product);
    }
    async update(id, productData) {
        const product = await this.findOne(id);
        Object.assign(product, productData);
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
    async updateStock(id, quantity, type) {
        const product = await this.findOne(id);
        if (type === 'increase') {
            product.stock += quantity;
        }
        else {
            if (product.stock < quantity) {
                throw new common_1.ConflictException('Stock insuficiente');
            }
            product.stock -= quantity;
        }
        return this.productRepository.save(product);
    }
    async getLowStock(threshold = 10) {
        const products = await this.productRepository.find({
            where: { stock: threshold },
            relations: { category: true, supplier: true },
            order: { stock: 'ASC' },
        });
        return {
            success: true,
            data: products,
            count: products.length,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map