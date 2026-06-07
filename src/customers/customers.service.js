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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../entities/customer.entity");
let CustomersService = class CustomersService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async findAll(paginationDto) {
        const { page, limit, search, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.customerRepository.createQueryBuilder('customer');
        if (search) {
            queryBuilder.where('customer.fullName LIKE :search', { search: `%${search}%` })
                .orWhere('customer.documentNumber LIKE :search', { search: `%${search}%` })
                .orWhere('customer.email LIKE :search', { search: `%${search}%` })
                .orWhere('customer.phone LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.orderBy(`customer.${sortBy}`, sortOrder)
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
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: { sales: true },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return customer;
    }
    async findByDocument(documentNumber) {
        const customer = await this.customerRepository.findOne({
            where: { documentNumber },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente con documento ${documentNumber} no encontrado`);
        }
        return customer;
    }
    async create(customerData) {
        const existingCustomer = await this.customerRepository.findOne({
            where: { documentNumber: customerData.documentNumber },
        });
        if (existingCustomer) {
            throw new common_1.ConflictException('Ya existe un cliente con ese número de documento');
        }
        const customer = this.customerRepository.create(customerData);
        return this.customerRepository.save(customer);
    }
    async update(id, customerData) {
        const customer = await this.findOne(id);
        Object.assign(customer, customerData);
        return this.customerRepository.save(customer);
    }
    async remove(id) {
        const customer = await this.findOne(id);
        await this.customerRepository.remove(customer);
    }
    async getSalesHistory(id) {
        const customer = await this.findOne(id);
        return {
            success: true,
            data: customer.sales,
        };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map