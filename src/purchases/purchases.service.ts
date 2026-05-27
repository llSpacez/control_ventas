import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { PurchaseDetail } from '../entities/purchase-detail.entity';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { Inventory } from '../entities/inventory.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseDetail)
    private purchaseDetailRepository: Repository<PurchaseDetail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.purchaseRepository.createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.supplier', 'supplier')
      .leftJoinAndSelect('purchase.user', 'user');

    if (search) {
      queryBuilder.where('purchase.purchaseNumber LIKE :search', { search: `%${search}%` })
        .orWhere('supplier.businessName LIKE :search', { search: `%${search}%` });
    }

    queryBuilder.orderBy(`purchase.${sortBy}`, sortOrder)
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

  async findOne(id: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({
      where: { id },
      relations: {supplier: true, user: true, details: {product: true}},
    });
    
    if (!purchase) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }
    
    return purchase;
  }

  async create(purchaseData: any): Promise<Purchase> {
    const { details, ...purchaseInfo } = purchaseData;
    
    // Verificar proveedor
    const supplier = await this.supplierRepository.findOne({
      where: { id: purchaseInfo.supplierId },
    });
    
    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }
    
    // Generar número de compra
    const lastPurchase = await this.purchaseRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    
    const purchaseNumber = `PUR-${String((lastPurchase[0]?.id || 0) + 1).padStart(6, '0')}`;
    
    // Calcular totales
    let subtotal = 0;
    for (const item of details) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      
      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no encontrado`);
      }
      
      item.unitCost = item.cost || product.cost;
      item.subtotal = item.quantity * item.unitCost;
      subtotal += item.subtotal;
    }
    
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    
    // Crear compra
    const purchase = this.purchaseRepository.create({
      ...purchaseInfo,
      purchaseNumber,
      subtotal,
      tax,
      total,
      status: 'received',
    } as Purchase) as Purchase;
    
    const savedPurchase = (await this.purchaseRepository.save(purchase)) as Purchase;
    
    // Crear detalles y actualizar stock
    for (const item of details) {
      const detail = this.purchaseDetailRepository.create({
        purchaseId: savedPurchase.id,
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal: item.subtotal,
      });
      await this.purchaseDetailRepository.save(detail);
      
      // Actualizar stock del producto
      await this.productRepository.increment(
        { id: item.productId },
        'stock',
        item.quantity
      );
      
      // Actualizar costo promedio
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      
      const newCost = ((product.cost * product.stock) + (item.unitCost * item.quantity)) / (product.stock + item.quantity);
      await this.productRepository.update(item.productId, { cost: newCost });
      
      // Actualizar inventario
      const inventory = await this.inventoryRepository.findOne({
        where: { productId: item.productId },
      });
      
      if (inventory) {
        await this.inventoryRepository.increment(
          { productId: item.productId },
          'quantity',
          item.quantity
        );
      }
    }
    
    return this.findOne(savedPurchase.id);
  }

  async updateStatus(id: number, status: string): Promise<Purchase> {
    const purchase = await this.findOne(id);
    purchase.status = status;
    return this.purchaseRepository.save(purchase);
  }

  async getPurchasesByDateRange(startDate: Date, endDate: Date) {
    const purchases = await this.purchaseRepository.find({
      where: { purchaseDate: Between(startDate, endDate) },
      relations: {supplier: true, user: true},
      order: { purchaseDate: 'DESC' },
    });
    
    const total = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
    
    return {
      success: true,
      data: purchases,
      total,
      count: purchases.length,
    };
  }
}