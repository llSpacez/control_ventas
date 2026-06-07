import { Return } from './return.entity';
import { Product } from './product.entity';
export declare class ReturnDetail {
    id: number;
    returnId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    reason: string;
    return: Return;
    product: Product;
}
