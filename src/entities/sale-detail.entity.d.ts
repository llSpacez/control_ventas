import { Sale } from './sale.entity';
import { Product } from './product.entity';
export declare class SaleDetail {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
    sale: Sale;
    product: Product;
}
