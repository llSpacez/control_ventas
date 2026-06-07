import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class SuppliersService {
    private supplierRepository;
    constructor(supplierRepository: Repository<Supplier>);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Supplier[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Supplier>;
    findByRuc(ruc: string): Promise<Supplier>;
    create(supplierData: Partial<Supplier>): Promise<Supplier>;
    update(id: number, supplierData: Partial<Supplier>): Promise<Supplier>;
    remove(id: number): Promise<void>;
    getProducts(id: number): Promise<{
        success: boolean;
        data: import("../entities/product.entity").Product[];
    }>;
}
