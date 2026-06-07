import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getLowStock(threshold?: number): Promise<{
        success: boolean;
        data: Product[];
        count: number;
    }>;
    findByCode(code: string): Promise<{
        success: boolean;
        data: Product;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Product;
    }>;
    create(createProductDto: Partial<Product>): Promise<{
        success: boolean;
        message: string;
        data: Product;
    }>;
    update(id: string, updateProductDto: Partial<Product>): Promise<{
        success: boolean;
        message: string;
        data: Product;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStock(id: string, quantity: number, type: 'increase' | 'decrease'): Promise<{
        success: boolean;
        message: string;
        data: Product;
    }>;
}
