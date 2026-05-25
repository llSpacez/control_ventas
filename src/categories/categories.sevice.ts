import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../entities/category.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
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

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {parentCategory : true, children : true},
    });
    
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    
    return category;
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: categoryData.name },
    });

    if (existingCategory) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async update(id: number, categoryData: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, categoryData);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async getTree(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      relations: {children: true},
      where: { parentCategoryId: null },
    });
    return categories;
  }
}