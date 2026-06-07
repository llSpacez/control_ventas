import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async findAll(@Query() query: any) {
    try {
      // Convertir query params a números correctamente
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
    } catch (error) {
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

  @Get('roles')
  @Roles('admin')
  async getRoles() {
    try {
      const roles = await this.usersService.getRoles();
      return {
        success: true,
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post()
  @Roles('admin')
  async create(@Body() createUserDto: any) {
    try {
      const user = await this.usersService.create(createUserDto);
      const { password, ...result } = user;
      return {
        success: true,
        message: 'Usuario creado exitosamente',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put(':id/status')
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}