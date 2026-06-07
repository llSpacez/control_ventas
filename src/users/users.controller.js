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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(query) {
        try {
            const page = query.page ? parseInt(query.page, 10) : 1;
            const limit = query.limit ? parseInt(query.limit, 10) : 10;
            const search = query.search || '';
            const result = await this.usersService.findAll({
                page: isNaN(page) ? 1 : page,
                limit: isNaN(limit) ? 10 : limit,
                search
            });
            return {
                success: true,
                data: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            };
        }
        catch (error) {
            console.error('Error en findAll:', error);
            return {
                success: false,
                data: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
                message: error.message,
            };
        }
    }
    async getRoles() {
        try {
            const roles = await this.usersService.getRoles();
            return {
                success: true,
                data: roles,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findOne(id) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return {
                    success: false,
                    message: 'ID inválido',
                };
            }
            const user = await this.usersService.findOne(userId);
            return {
                success: true,
                data: user,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async create(createUserDto) {
        try {
            const user = await this.usersService.create(createUserDto);
            const { password, ...result } = user;
            return {
                success: true,
                message: 'Usuario creado exitosamente',
                data: result,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async update(id, updateUserDto) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return {
                    success: false,
                    message: 'ID inválido',
                };
            }
            const user = await this.usersService.update(userId, updateUserDto);
            const { password, ...result } = user;
            return {
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: result,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async remove(id) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return {
                    success: false,
                    message: 'ID inválido',
                };
            }
            await this.usersService.remove(userId);
            return {
                success: true,
                message: 'Usuario eliminado exitosamente',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async updateStatus(id, isActive) {
        try {
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return {
                    success: false,
                    message: 'ID inválido',
                };
            }
            const user = await this.usersService.updateStatus(userId, isActive);
            return {
                success: true,
                message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
                data: user,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateStatus", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map