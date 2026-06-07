import { User } from './user.entity';
export declare class Role {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    users: User[];
}
