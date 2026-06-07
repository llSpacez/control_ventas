import { User } from './user.entity';
export declare class CashRegister {
    id: number;
    openingDate: Date;
    closingDate: Date;
    initialAmount: number;
    salesTotal: number;
    expensesTotal: number;
    expectedAmount: number;
    actualAmount: number;
    difference: number;
    status: string;
    openedByUserId: number;
    closedByUserId: number;
    notes: string;
    createdAt: Date;
    openedBy: User;
    closedBy: User;
}
