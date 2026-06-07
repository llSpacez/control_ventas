import { Sale } from './sale.entity';
import { User } from './user.entity';
export declare class Payment {
    id: number;
    saleId: number;
    paymentDate: Date;
    amount: number;
    paymentMethod: string;
    referenceNumber: string;
    status: string;
    userId: number;
    sale: Sale;
    user: User;
}
