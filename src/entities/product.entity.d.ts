import { Category } from './category.entity';
import { Supplier } from './supplier.entity';
import { SaleDetail } from './sale-detail.entity';
import { PurchaseDetail } from './purchase-detail.entity';
import { Inventory } from './inventory.entity';
import { ReturnDetail } from './return-detail.entity';
export declare class Product {
    id: number;
    code: string;
    barcode: string;
    name: string;
    description: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    categoryId: number;
    supplierId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
    supplier: Supplier;
    saleDetails: SaleDetail[];
    purchaseDetails: PurchaseDetail[];
    inventories: Inventory[];
    returnDetails: ReturnDetail[];
}
