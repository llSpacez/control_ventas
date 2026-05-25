import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
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

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: {sales: true},
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return customer;
  }

  async findByDocument(documentNumber: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { documentNumber },
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con documento ${documentNumber} no encontrado`);
    }
    
    return customer;
  }

  async create(customerData: Partial<Customer>): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { documentNumber: customerData.documentNumber },
    });

    if (existingCustomer) {
      throw new ConflictException('Ya existe un cliente con ese número de documento');
    }

    const customer = this.customerRepository.create(customerData);
    return this.customerRepository.save(customer);
  }

  async update(id: number, customerData: Partial<Customer>): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, customerData);
    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  async getSalesHistory(id: number) {
    const customer = await this.findOne(id);
    return {
      success: true,
      data: customer.sales,
    };
  }
}