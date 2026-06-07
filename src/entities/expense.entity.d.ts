import { User } from './user.entity';
import { CashRegister } from './cash-register.entity';
export declare class Expense {
    id: number;
    expenseNumber: string;
    description: string;
    amount: number;
    category: string;
    expenseDate: Date;
    paymentMethod: string;
    receiptNumber: string;
    userId: number;
    cashRegisterId: number;
    createdAt: Date;
    user: User;
    cashRegister: CashRegister;
}
