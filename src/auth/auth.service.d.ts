import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { LoginDto, RegisterDto } from '../dto/login.dto';
export declare class AuthService {
    private userRepository;
    private roleRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
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
            role: Role;
            sales: import("../entities/sale.entity").Sale[];
            purchases: import("../entities/purchase.entity").Purchase[];
            payments: import("../entities/payment.entity").Payment[];
            cashRegistersOpened: import("../entities/cash-register.entity").CashRegister[];
            expenses: import("../entities/expense.entity").Expense[];
            logs: import("../entities/system-log.entity").SystemLog[];
        };
    }>;
    getProfile(userId: number): Promise<{
        success: boolean;
        data: User;
    }>;
}
