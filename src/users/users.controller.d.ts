import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("../entities/user.entity").User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        message?: undefined;
    } | {
        success: boolean;
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        message: any;
    }>;
    getRoles(): Promise<{
        success: boolean;
        data: import("../entities/role.entity").Role[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../entities/user.entity").User;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    create(createUserDto: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            username: string;
            email: string;
            fullName: string;
            roleId: number;
            isActive: boolean;
            lastLogin: Date;
            createdAt: Date;
            role: import("../entities/role.entity").Role;
            sales: import("../entities/sale.entity").Sale[];
            purchases: import("../entities/purchase.entity").Purchase[];
            payments: import("../entities/payment.entity").Payment[];
            cashRegistersOpened: import("../entities/cash-register.entity").CashRegister[];
            expenses: import("../entities/expense.entity").Expense[];
            logs: import("../entities/system-log.entity").SystemLog[];
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    update(id: string, updateUserDto: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            username: string;
            email: string;
            fullName: string;
            roleId: number;
            isActive: boolean;
            lastLogin: Date;
            createdAt: Date;
            role: import("../entities/role.entity").Role;
            sales: import("../entities/sale.entity").Sale[];
            purchases: import("../entities/purchase.entity").Purchase[];
            payments: import("../entities/payment.entity").Payment[];
            cashRegistersOpened: import("../entities/cash-register.entity").CashRegister[];
            expenses: import("../entities/expense.entity").Expense[];
            logs: import("../entities/system-log.entity").SystemLog[];
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: any;
    }>;
    updateStatus(id: string, isActive: boolean): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user.entity").User;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
