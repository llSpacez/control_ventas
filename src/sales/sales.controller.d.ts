import { SalesService } from './sales.service';
import { PaginationDto } from '../dto/pagination.dto';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getByDateRange(startDate: string, endDate: string): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale[];
        total: number;
        count: number;
    }>;
    getDaily(date: string): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale[];
        total: number;
        count: number;
    }>;
    findByInvoice(invoiceNumber: string): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../entities/sale.entity").Sale;
    }>;
    create(createSaleDto: any): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/sale.entity").Sale;
    }>;
    updateStatus(id: string, status: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/sale.entity").Sale;
    }>;
    cancel(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/sale.entity").Sale;
    }>;
}
