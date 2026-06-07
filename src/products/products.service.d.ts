import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Product>;
    findByCode(code: string): Promise<Product>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: number, productData: Partial<Product>): Promise<Product>;
    remove(id: number): Promise<void>;
    updateStock(id: number, quantity: number, type: 'increase' | 'decrease'): Promise<Product>;
    getLowStock(threshold?: number): Promise<{
        success: boolean;
        data: Product[];
        count: number;
    }>;
}
