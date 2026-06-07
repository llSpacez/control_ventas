import { Inventory } from './inventory.entity';
export declare class Warehouse {
    id: number;
    name: string;
    location: string;
    managerName: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    inventories: Inventory[];
}
