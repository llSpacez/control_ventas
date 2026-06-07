import { Product } from './product.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    parentCategoryId: number;
    isActive: boolean;
    createdAt: Date;
    parentCategory: Category;
    children: Category[];
    products: Product[];
}
