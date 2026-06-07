import { Response } from 'express';
import { BackupService } from './backup.service';
export declare class BackupController {
    private backupService;
    constructor(backupService: BackupService);
    createBackup(): Promise<{
        success: boolean;
        message: string;
        data: {
            filename: string;
            path: string;
            size: number;
        };
    }>;
    listBackups(): Promise<{
        success: boolean;
        data: {
            filename: string;
            path: string;
            size: number;
            created: Date;
        }[];
        totalBackups: number;
        totalSize: number;
    }>;
    restoreBackup(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteBackup(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
    downloadBackup(filename: string, res: Response): Promise<void>;
}
