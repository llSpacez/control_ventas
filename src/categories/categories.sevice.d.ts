import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { PaginationDto } from '../dto/pagination.dto';
export declare class CategoriesService {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    findAll(paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: Category[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Category>;
    create(categoryData: Partial<Category>): Promise<Category>;
    update(id: number, categoryData: Partial<Category>): Promise<Category>;
    remove(id: number): Promise<void>;
    getTree(): Promise<Category[]>;
}
