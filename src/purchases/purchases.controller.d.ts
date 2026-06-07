import { PurchasesService } from './purchases.service';
import { PaginationDto } from '../dto/pagination.dto';
export declare class PurchasesController {
    private purchasesService;
    constructor(purchasesService: PurchasesService);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: import("../entities/purchase.entity").Purchase[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getByDateRange(startDate: string, endDate: string): Promise<{
        success: boolean;
        data: import("../entities/purchase.entity").Purchase[];
        total: number;
        count: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../entities/purchase.entity").Purchase;
    }>;
    create(createPurchaseDto: any): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/purchase.entity").Purchase;
    }>;
    updateStatus(id: string, status: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/purchase.entity").Purchase;
    }>;
}
