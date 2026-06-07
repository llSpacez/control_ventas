"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const backup_service_1 = require("./backup.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let BackupController = class BackupController {
    constructor(backupService) {
        this.backupService = backupService;
    }
    async createBackup() {
        const backup = await this.backupService.createBackup();
        return {
            success: true,
            message: 'Respaldo creado exitosamente',
            data: backup,
        };
    }
    async listBackups() {
        const backups = await this.backupService.listBackups();
        const totalSize = await this.backupService.getBackupSize();
        return {
            success: true,
            data: backups,
            totalBackups: backups.length,
            totalSize,
        };
    }
    async restoreBackup(filename) {
        await this.backupService.restoreBackup(filename);
        return {
            success: true,
            message: 'Base de datos restaurada exitosamente',
        };
    }
    async deleteBackup(filename) {
        await this.backupService.deleteBackup(filename);
        return {
            success: true,
            message: 'Respaldo eliminado exitosamente',
        };
    }
    async downloadBackup(filename, res) {
        const { path: filepath, filename: name } = await this.backupService.downloadBackup(filename);
        res.download(filepath, name);
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Post)('create'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "listBackups", null);
__decorate([
    (0, common_1.Post)('restore/:filename'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "restoreBackup", null);
__decorate([
    (0, common_1.Delete)(':filename'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteBackup", null);
__decorate([
    (0, common_1.Get)('download/:filename'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "downloadBackup", null);
exports.BackupController = BackupController = __decorate([
    (0, swagger_1.ApiTags)('backup'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('backup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [backup_service_1.BackupService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map