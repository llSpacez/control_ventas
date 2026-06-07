import { Role } from './role.entity';
import { Sale } from './sale.entity';
import { Purchase } from './purchase.entity';
import { Payment } from './payment.entity';
import { CashRegister } from './cash-register.entity';
import { Expense } from './expense.entity';
import { SystemLog } from './system-log.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    fullName: string;
    roleId: number;
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    role: Role;
    sales: Sale[];
    purchases: Purchase[];
    payments: Payment[];
    cashRegistersOpened: CashRegister[];
    expenses: Expense[];
    logs: SystemLog[];
}
