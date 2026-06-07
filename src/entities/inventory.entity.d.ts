import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
export declare class Inventory {
    id: number;
    productId: number;
    warehouseId: number;
    quantity: number;
    minStock: number;
    maxStock: number;
    lastUpdated: Date;
    product: Product;
    warehouse: Warehouse;
}
