import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';
import { Inventory } from '../entities/inventory.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class SalesService {
    private saleRepository;
    private saleDetailRepository;
    private productRepository;
    private customerRepository;
    private paymentRepository;
    private inventoryRepository;
    constructor(saleRepository: Repository<Sale>, saleDetailRepository: Repository<SaleDetail>, productRepository: Repository<Product>, customerRepository: Repository<Customer>, paymentRepository: Repository<Payment>, inventoryRepository: Repository<Inventory>);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Sale[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Sale>;
    findByInvoice(invoiceNumber: string): Promise<Sale>;
    create(saleData: any): Promise<Sale>;
    updateStatus(id: number, status: string): Promise<Sale>;
    cancel(id: number): Promise<Sale>;
    getSalesByDateRange(startDate: Date, endDate: Date): Promise<{
        success: boolean;
        data: Sale[];
        total: number;
        count: number;
    }>;
    getDailySales(date: Date): Promise<{
        success: boolean;
        data: Sale[];
        total: number;
        count: number;
    }>;
}
