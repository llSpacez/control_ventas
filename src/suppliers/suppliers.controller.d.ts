import { SuppliersService } from './suppliers.service';
import { Supplier } from '../entities/supplier.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class SuppliersController {
    private suppliersService;
    constructor(suppliersService: SuppliersService);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Supplier[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByRuc(ruc: string): Promise<{
        success: boolean;
        data: Supplier;
    }>;
    getProducts(id: string): Promise<{
        success: boolean;
        data: import("../entities/product.entity").Product[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Supplier;
    }>;
    create(createSupplierDto: Partial<Supplier>): Promise<{
        success: boolean;
        message: string;
        data: Supplier;
    }>;
    update(id: string, updateSupplierDto: Partial<Supplier>): Promise<{
        success: boolean;
        message: string;
        data: Supplier;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
