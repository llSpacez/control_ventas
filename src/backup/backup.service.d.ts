import { ConfigService } from '@nestjs/config';
export declare class BackupService {
    private configService;
    private backupDir;
    private dbHost;
    private dbUser;
    private dbPassword;
    private dbName;
    constructor(configService: ConfigService);
    createBackup(): Promise<{
        filename: string;
        path: string;
        size: number;
    }>;
    listBackups(): Promise<Array<{
        filename: string;
        path: string;
        size: number;
        created: Date;
    }>>;
    restoreBackup(filename: string): Promise<void>;
    deleteBackup(filename: string): Promise<void>;
    downloadBackup(filename: string): Promise<{
        path: string;
        filename: string;
    }>;
    getBackupSize(): Promise<number>;
}
