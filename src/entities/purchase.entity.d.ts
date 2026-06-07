import { Supplier } from './supplier.entity';
import { User } from './user.entity';
import { PurchaseDetail } from './purchase-detail.entity';
export declare class Purchase {
    id: number;
    purchaseNumber: string;
    purchaseDate: Date;
    subtotal: number;
    tax: number;
    total: number;
    supplierId: number;
    userId: number;
    status: string;
    notes: string;
    createdAt: Date;
    supplier: Supplier;
    user: User;
    details: PurchaseDetail[];
}
