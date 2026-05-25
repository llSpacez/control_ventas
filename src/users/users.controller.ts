import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get('roles')
  @Roles('admin')
  async getRoles() {
    return this.usersService.getRoles();
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      success: true,
      data: user,
    };
  }

  @Post()
  @Roles('admin')
  async create(@Body() createUserDto: Partial<User>) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
    };
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    const user = await this.usersService.update(+id, updateUserDto);
    return {
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return {
      success: true,
      message: 'Usuario eliminado exitosamente',
    };
  }

  @Put(':id/status')
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    const user = await this.usersService.updateStatus(+id, isActive);
    return {
      success: true,
      message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
      data: user,
    };
  }
}