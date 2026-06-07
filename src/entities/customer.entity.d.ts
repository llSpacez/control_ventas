import { Sale } from './sale.entity';
export declare class Customer {
    id: number;
    documentType: string;
    documentNumber: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    birthDate: Date;
    isActive: boolean;
    createdAt: Date;
    sales: Sale[];
}
