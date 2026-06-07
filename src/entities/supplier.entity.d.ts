import { Product } from './product.entity';
import { Purchase } from './purchase.entity';
export declare class Supplier {
    id: number;
    ruc: string;
    businessName: string;
    contactName: string;
    phone: string;
    email: string;
    address: string;
    isActive: boolean;
    createdAt: Date;
    products: Product[];
    purchases: Purchase[];
}
