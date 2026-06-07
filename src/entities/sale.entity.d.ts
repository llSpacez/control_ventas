import { Customer } from './customer.entity';
import { User } from './user.entity';
import { SaleDetail } from './sale-detail.entity';
import { Payment } from './payment.entity';
export declare class Sale {
    id: number;
    invoiceNumber: string;
    saleDate: Date;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: string;
    paymentStatus: string;
    customerId: number;
    userId: number;
    notes: string;
    createdAt: Date;
    customer: Customer;
    user: User;
    details: SaleDetail[];
    payments: Payment[];
}
