import { Purchase } from './purchase.entity';
import { Product } from './product.entity';
export declare class PurchaseDetail {
    id: number;
    purchaseId: number;
    productId: number;
    quantity: number;
    unitCost: number;
    subtotal: number;
    purchase: Purchase;
    product: Product;
}
