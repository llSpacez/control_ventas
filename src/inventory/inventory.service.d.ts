import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class InventoryService {
    private inventoryRepository;
    private productRepository;
    private warehouseRepository;
    constructor(inventoryRepository: Repository<Inventory>, productRepository: Repository<Product>, warehouseRepository: Repository<Warehouse>);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Inventory[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Inventory>;
    findByProduct(productId: number): Promise<{
        success: boolean;
        data: Inventory[];
    }>;
    findByWarehouse(warehouseId: number): Promise<{
        success: boolean;
        data: Inventory[];
        totalValue: number;
    }>;
    updateStock(productId: number, warehouseId: number, quantity: number, type: 'increase' | 'decrease'): Promise<Inventory>;
    getLowStock(threshold?: number): Promise<{
        success: boolean;
        data: Inventory[];
        count: number;
    }>;
    transferStock(productId: number, fromWarehouseId: number, toWarehouseId: number, quantity: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getWarehouses(): Promise<{
        success: boolean;
        data: Warehouse[];
    }>;
}
