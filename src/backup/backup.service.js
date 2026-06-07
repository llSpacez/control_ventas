"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let BackupService = class BackupService {
    constructor(configService) {
        this.configService = configService;
        this.backupDir = this.configService.get('BACKUP_PATH') || './backups';
        this.dbHost = this.configService.get('DB_HOST');
        this.dbUser = this.configService.get('DB_USER');
        this.dbPassword = this.configService.get('DB_PASSWORD');
        this.dbName = this.configService.get('DB_NAME');
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }
    async createBackup() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `backup_${this.dbName}_${timestamp}.sql`;
            const filepath = path.join(this.backupDir, filename);
            const command = `mysqldump -h ${this.dbHost} -u ${this.dbUser} -p${this.dbPassword} ${this.dbName} --routines --triggers --single-transaction > "${filepath}"`;
            await execAsync(command);
            if (!fs.existsSync(filepath)) {
                throw new Error('No se pudo crear el respaldo');
            }
            const stats = fs.statSync(filepath);
            return {
                filename,
                path: filepath,
                size: stats.size,
            };
        }
        catch (error) {
            console.error('Error al crear respaldo:', error);
            throw new common_1.InternalServerErrorException('Error al crear el respaldo de la base de datos');
        }
    }
    async listBackups() {
        try {
            const files = fs.readdirSync(this.backupDir);
            const backups = files
                .filter(file => file.endsWith('.sql'))
                .map(file => {
                const filepath = path.join(this.backupDir, file);
                const stats = fs.statSync(filepath);
                return {
                    filename: file,
                    path: filepath,
                    size: stats.size,
                    created: stats.birthtime,
                };
            })
                .sort((a, b) => b.created.getTime() - a.created.getTime());
            return backups;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al listar respaldos');
        }
    }
    async restoreBackup(filename) {
        try {
            const filepath = path.join(this.backupDir, filename);
            if (!fs.existsSync(filepath)) {
                throw new common_1.NotFoundException('Archivo de respaldo no encontrado');
            }
            const command = `mysql -h ${this.dbHost} -u ${this.dbUser} -p${this.dbPassword} ${this.dbName} < "${filepath}"`;
            await execAsync(command);
        }
        catch (error) {
            console.error('Error al restaurar respaldo:', error);
            throw new common_1.InternalServerErrorException('Error al restaurar el respaldo');
        }
    }
    async deleteBackup(filename) {
        try {
            const filepath = path.join(this.backupDir, filename);
            if (!fs.existsSync(filepath)) {
                throw new common_1.NotFoundException('Archivo de respaldo no encontrado');
            }
            fs.unlinkSync(filepath);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al eliminar el respaldo');
        }
    }
    async downloadBackup(filename) {
        const filepath = path.join(this.backupDir, filename);
        if (!fs.existsSync(filepath)) {
            throw new common_1.NotFoundException('Archivo de respaldo no encontrado');
        }
        return {
            path: filepath,
            filename,
        };
    }
    async getBackupSize() {
        try {
            const files = fs.readdirSync(this.backupDir);
            let totalSize = 0;
            for (const file of files) {
                if (file.endsWith('.sql')) {
                    const filepath = path.join(this.backupDir, file);
                    const stats = fs.statSync(filepath);
                    totalSize += stats.size;
                }
            }
            return totalSize;
        }
        catch (error) {
            return 0;
        }
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BackupService);
//# sourceMappingURL=backup.service.js.map