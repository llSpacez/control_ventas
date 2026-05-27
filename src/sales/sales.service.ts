import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';
import { Inventory } from '../entities/inventory.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saleDetailRepository: Repository<SaleDetail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.user', 'user');

    if (search) {
      queryBuilder.where('sale.invoiceNumber LIKE :search', { search: `%${search}%` })
        .orWhere('customer.fullName LIKE :search', { search: `%${search}%` });
    }

    queryBuilder.orderBy(`sale.${sortBy}`, sortOrder)
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

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        user: true,
        details: { product: true },
        payments: true,
      },
    });
    
    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    
    return sale;
  }

  async findByInvoice(invoiceNumber: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { invoiceNumber },
      relations: {
        customer: true,
        user: true,
        details: { product: true },
        payments: true,
      },
    });
    
    if (!sale) {
      throw new NotFoundException(`Factura ${invoiceNumber} no encontrada`);
    }
    
    return sale;
  }

  async create(saleData: any): Promise<Sale> {
    const { details, payment, ...saleInfo } = saleData;
    
    // Verificar cliente
    let customer = await this.customerRepository.findOne({
      where: { id: saleInfo.customerId },
    });
    
    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }
    
    // Verificar stock de productos
    for (const item of details) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      
      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no encontrado`);
      }
      
      if (product.stock < item.quantity) {
        throw new ConflictException(`Stock insuficiente para ${product.name}. Stock actual: ${product.stock}`);
      }
    }
    
    // Generar número de factura
    const lastSale = await this.saleRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    
    const invoiceNumber = `INV-${String((lastSale[0]?.id || 0) + 1).padStart(6, '0')}`;
    
    // Calcular totales
    let subtotal = 0;
    for (const item of details) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      item.unitPrice = product.price;
      item.subtotal = item.quantity * product.price;
      subtotal += item.subtotal;
    }
    
    const tax = subtotal * 0.18; // 18% IGV
    const total = subtotal + tax;
    
    // Crear venta
    const sale = this.saleRepository.create({
      ...saleInfo,
      invoiceNumber,
      subtotal,
      tax,
      total,
      status: 'completed',
      paymentStatus: payment ? 'paid' : 'pending',
    } as Sale) as Sale;
    
    const savedSale = (await this.saleRepository.save(sale)) as Sale;
    
    // Crear detalles de venta
    for (const item of details) {
      const detail = this.saleDetailRepository.create({
        saleId: savedSale.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      });
      await this.saleDetailRepository.save(detail);
      
      // Actualizar stock
      await this.productRepository.decrement(
        { id: item.productId },
        'stock',
        item.quantity
      );
      
      // Actualizar inventario
      await this.inventoryRepository.decrement(
        { productId: item.productId },
        'quantity',
        item.quantity
      );
    }
    
    // Crear pago si existe
    if (payment) {
      const newPayment = this.paymentRepository.create({
        saleId: savedSale.id,
        amount: payment.amount,
        paymentMethod: payment.method,
        status: 'completed',
        userId: saleInfo.userId,
      });
      await this.paymentRepository.save(newPayment);
    }
    
    return this.findOne(savedSale.id);
  }

  async updateStatus(id: number, status: string): Promise<Sale> {
    const sale = await this.findOne(id);
    sale.status = status;
    return this.saleRepository.save(sale);
  }

  async cancel(id: number): Promise<Sale> {
    const sale = await this.findOne(id);
    
    if (sale.status === 'cancelled') {
      throw new ConflictException('La venta ya está cancelada');
    }
    
    // Devolver stock
    for (const detail of sale.details) {
      await this.productRepository.increment(
        { id: detail.productId },
        'stock',
        detail.quantity
      );
      
      await this.inventoryRepository.increment(
        { productId: detail.productId },
        'quantity',
        detail.quantity
      );
    }
    
    sale.status = 'cancelled';
    return this.saleRepository.save(sale);
  }

  async getSalesByDateRange(startDate: Date, endDate: Date) {
    const sales = await this.saleRepository.find({
      where: { saleDate: Between(startDate, endDate) },
      relations: {
        customer: true,
        user: true,
      },
      order: { saleDate: 'DESC' },
    });
    
    const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    
    return {
      success: true,
      data: sales,
      total,
      count: sales.length,
    };
  }

  async getDailySales(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.getSalesByDateRange(startOfDay, endOfDay);
  }
}