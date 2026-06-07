import { InventoryService } from './inventory.service';
import { PaginationDto } from '../dto/pagination.dto';
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: import("../entities/inventory.entity").Inventory[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getLowStock(threshold?: number): Promise<{
        success: boolean;
        data: import("../entities/inventory.entity").Inventory[];
        count: number;
    }>;
    getWarehouses(): Promise<{
        success: boolean;
        data: import("../entities/warehouse.entity").Warehouse[];
    }>;
    findByProduct(productId: string): Promise<{
        success: boolean;
        data: import("../entities/inventory.entity").Inventory[];
    }>;
    findByWarehouse(warehouseId: string): Promise<{
        success: boolean;
        data: import("../entities/inventory.entity").Inventory[];
        totalValue: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../entities/inventory.entity").Inventory;
    }>;
    updateStock(productId: number, warehouseId: number, quantity: number, type: 'increase' | 'decrease'): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/inventory.entity").Inventory;
    }>;
    transferStock(productId: number, fromWarehouseId: number, toWarehouseId: number, quantity: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
