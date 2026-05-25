import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
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

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {category: true, supplier: true},
    });
    
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    
    return product;
  }

  async findByCode(code: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { code },
      relations: {category: true, supplier: true},
    });
    
    if (!product) {
      throw new NotFoundException(`Producto con código ${code} no encontrado`);
    }
    
    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: [{ code: productData.code }, { barcode: productData.barcode }],
    });

    if (existingProduct) {
      throw new ConflictException('El código o código de barras ya existe');
    }

    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: number, quantity: number, type: 'increase' | 'decrease'): Promise<Product> {
    const product = await this.findOne(id);
    
    if (type === 'increase') {
      product.stock += quantity;
    } else {
      if (product.stock < quantity) {
        throw new ConflictException('Stock insuficiente');
      }
      product.stock -= quantity;
    }
    
    return this.productRepository.save(product);
  }

  async getLowStock(threshold: number = 10) {
    const products = await this.productRepository.find({
      where: { stock: threshold },
      relations: {category: true, supplier: true},
      order: { stock: 'ASC' },
    });
    
    return {
      success: true,
      data: products,
      count: products.length,
    };
  }
}