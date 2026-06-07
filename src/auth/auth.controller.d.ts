import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: any;
                username: any;
                fullName: any;
                email: any;
                role: any;
            };
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
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
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        data: import("../entities/user.entity").User;
    }>;
}
