import { User } from './user.entity';
export declare class SystemLog {
    id: number;
    userId: number;
    action: string;
    tableName: string;
    recordId: number;
    oldData: any;
    newData: any;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    user: User;
}
