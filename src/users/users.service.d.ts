import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
export declare class UsersService {
    private userRepository;
    private roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    findAll(paginationDto: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(id: number, userData: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
    updateStatus(id: number, isActive: boolean): Promise<User>;
    getRoles(): Promise<Role[]>;
}
