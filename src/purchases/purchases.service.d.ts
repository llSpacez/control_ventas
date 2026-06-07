import { Repository } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { PurchaseDetail } from '../entities/purchase-detail.entity';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { Inventory } from '../entities/inventory.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class PurchasesService {
    private purchaseRepository;
    private purchaseDetailRepository;
    private productRepository;
    private supplierRepository;
    private inventoryRepository;
    constructor(purchaseRepository: Repository<Purchase>, purchaseDetailRepository: Repository<PurchaseDetail>, productRepository: Repository<Product>, supplierRepository: Repository<Supplier>, inventoryRepository: Repository<Inventory>);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Purchase[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Purchase>;
    create(purchaseData: any): Promise<Purchase>;
    updateStatus(id: number, status: string): Promise<Purchase>;
    getPurchasesByDateRange(startDate: Date, endDate: Date): Promise<{
        success: boolean;
        data: Purchase[];
        total: number;
        count: number;
    }>;
}
