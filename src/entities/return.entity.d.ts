import { Sale } from './sale.entity';
import { User } from './user.entity';
import { ReturnDetail } from './return-detail.entity';
export declare class Return {
    id: number;
    returnNumber: string;
    saleId: number;
    returnDate: Date;
    totalAmount: number;
    reason: string;
    status: string;
    userId: number;
    createdAt: Date;
    sale: Sale;
    user: User;
    details: ReturnDetail[];
}
