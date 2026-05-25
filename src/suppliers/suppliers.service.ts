import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
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

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: {products: true, purchases: true},
    });
    
    if (!supplier) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    
    return supplier;
  }

  async findByRuc(ruc: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { ruc },
    });
    
    if (!supplier) {
      throw new NotFoundException(`Proveedor con RUC ${ruc} no encontrado`);
    }
    
    return supplier;
  }

  async create(supplierData: Partial<Supplier>): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findOne({
      where: { ruc: supplierData.ruc },
    });

    if (existingSupplier) {
      throw new ConflictException('Ya existe un proveedor con ese RUC');
    }

    const supplier = this.supplierRepository.create(supplierData);
    return this.supplierRepository.save(supplier);
  }

  async update(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, supplierData);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: number): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }

  async getProducts(id: number) {
    const supplier = await this.findOne(id);
    return {
      success: true,
      data: supplier.products,
    };
  }
}