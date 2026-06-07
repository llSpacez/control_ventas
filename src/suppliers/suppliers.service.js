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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("../entities/supplier.entity");
let SuppliersService = class SuppliersService {
    constructor(supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    async findAll(paginationDto) {
        const { page, limit, search, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');
        if (search) {
            queryBuilder.where('supplier.businessName LIKE :search', { search: `%${search}%` })
                .orWhere('supplier.ruc LIKE :search', { search: `%${search}%` })
                .orWhere('supplier.email LIKE :search', { search: `%${search}%` })
                .orWhere('supplier.contactName LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.orderBy(`supplier.${sortBy}`, sortOrder)
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
        const supplier = await this.supplierRepository.findOne({
            where: { id },
            relations: { products: true, purchases: true },
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Proveedor con ID ${id} no encontrado`);
        }
        return supplier;
    }
    async findByRuc(ruc) {
        const supplier = await this.supplierRepository.findOne({
            where: { ruc },
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Proveedor con RUC ${ruc} no encontrado`);
        }
        return supplier;
    }
    async create(supplierData) {
        const existingSupplier = await this.supplierRepository.findOne({
            where: { ruc: supplierData.ruc },
        });
        if (existingSupplier) {
            throw new common_1.ConflictException('Ya existe un proveedor con ese RUC');
        }
        const supplier = this.supplierRepository.create(supplierData);
        return this.supplierRepository.save(supplier);
    }
    async update(id, supplierData) {
        const supplier = await this.findOne(id);
        Object.assign(supplier, supplierData);
        return this.supplierRepository.save(supplier);
    }
    async remove(id) {
        const supplier = await this.findOne(id);
        await this.supplierRepository.remove(supplier);
    }
    async getProducts(id) {
        const supplier = await this.findOne(id);
        return {
            success: true,
            data: supplier.products,
        };
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map