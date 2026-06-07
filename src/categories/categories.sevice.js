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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async findAll(paginationDto) {
        const { page, limit, search, sortBy, sortOrder } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.categoryRepository.createQueryBuilder('category')
            .leftJoinAndSelect('category.parentCategory', 'parentCategory');
        if (search) {
            queryBuilder.where('category.name LIKE :search', { search: `%${search}%` })
                .orWhere('category.description LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.orderBy(`category.${sortBy}`, sortOrder)
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
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: { parentCategory: true, children: true },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return category;
    }
    async create(categoryData) {
        const existingCategory = await this.categoryRepository.findOne({
            where: { name: categoryData.name },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Ya existe una categoría con ese nombre');
        }
        const category = this.categoryRepository.create(categoryData);
        return this.categoryRepository.save(category);
    }
    async update(id, categoryData) {
        const category = await this.findOne(id);
        Object.assign(category, categoryData);
        return this.categoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }
    async getTree() {
        const categories = await this.categoryRepository.find({
            relations: { children: true },
            where: { parentCategoryId: null },
        });
        return categories;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.sevice.js.map