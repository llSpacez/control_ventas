import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse');

    if (search) {
      queryBuilder.where('product.name LIKE :search', { search: `%${search}%` })
        .orWhere('product.code LIKE :search', { search: `%${search}%` });
    }

    queryBuilder.orderBy(`inventory.${sortBy}`, sortOrder)
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

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: {product: true, warehouse: true},
    });
    
    if (!inventory) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }
    
    return inventory;
  }

  async findByProduct(productId: number) {
    const inventory = await this.inventoryRepository.find({
      where: { productId },
      relations: {product: true, warehouse: true},
    });
    
    return {
      success: true,
      data: inventory,
    };
  }

  async findByWarehouse(warehouseId: number) {
    const inventory = await this.inventoryRepository.find({
      where: { warehouseId },
      relations: {product: true, warehouse: true},
    });
    
    const totalValue = inventory.reduce((sum, item) => {
      return sum + (item.quantity * Number(item.product.price));
    }, 0);
    
    return {
      success: true,
      data: inventory,
      totalValue,
    };
  }

  async updateStock(productId: number, warehouseId: number, quantity: number, type: 'increase' | 'decrease') {
    let inventory = await this.inventoryRepository.findOne({
      where: { productId, warehouseId },
    });
    
    if (!inventory) {
      // Crear nuevo registro de inventario
      inventory = this.inventoryRepository.create({
        productId,
        warehouseId,
        quantity: 0,
        minStock: 5,
        maxStock: 100,
      });
    }
    
    if (type === 'increase') {
      inventory.quantity += quantity;
    } else {
      if (inventory.quantity < quantity) {
        throw new Error('Stock insuficiente');
      }
      inventory.quantity -= quantity;
    }
    
    return this.inventoryRepository.save(inventory);
  }

  async getLowStock(threshold: number = 10) {
    const inventory = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.quantity <= :threshold', { threshold })
      .orderBy('inventory.quantity', 'ASC')
      .getMany();
    
    return {
      success: true,
      data: inventory,
      count: inventory.length,
    };
  }

  async transferStock(productId: number, fromWarehouseId: number, toWarehouseId: number, quantity: number) {
    // Restar del origen
    await this.updateStock(productId, fromWarehouseId, quantity, 'decrease');
    
    // Sumar al destino
    await this.updateStock(productId, toWarehouseId, quantity, 'increase');
    
    return {
      success: true,
      message: 'Transferencia realizada exitosamente',
    };
  }

  async getWarehouses() {
    const warehouses = await this.warehouseRepository.find();
    return {
      success: true,
      data: warehouses,
    };
  }
}