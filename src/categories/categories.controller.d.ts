import { CategoriesService } from './categories.sevice';
import { Category } from '../entities/category.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Category[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getTree(): Promise<{
        success: boolean;
        data: Category[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Category;
    }>;
    create(createCategoryDto: Partial<Category>): Promise<{
        success: boolean;
        message: string;
        data: Category;
    }>;
    update(id: string, updateCategoryDto: Partial<Category>): Promise<{
        success: boolean;
        message: string;
        data: Category;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
