import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(paginationDto: { page?: number; limit?: number; search?: string }) {
    // Asegurar que los valores sean números
    const page = Math.max(1, Number(paginationDto.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(paginationDto.limit) || 10));
    const skip = (page - 1) * limit;
    const search = paginationDto.search || '';

    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .select([
          'user.id',
          'user.username',
          'user.email',
          'user.fullName',
          'user.isActive',
          'user.lastLogin',
          'user.createdAt',
          'role'
        ]);

      if (search && search.trim() !== '') {
        queryBuilder.where('user.username LIKE :search', { search: `%${search}%` })
          .orWhere('user.email LIKE :search', { search: `%${search}%` })
          .orWhere('user.fullName LIKE :search', { search: `%${search}%` });
      }

      const [data, total] = await queryBuilder
        .orderBy('user.id', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data: data || [],
        total: total || 0,
        page,
        limit,
        totalPages: Math.ceil((total || 0) / limit),
      };
    } catch (error) {
      console.error('Error en findAll:', error);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {role: true},
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: {role: true},
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      // Verificar si ya existe
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: userData.username },
          { email: userData.email },
        ],
      });

      if (existingUser) {
        throw new ConflictException('El nombre de usuario o email ya existe');
      }

      // Verificar rol
      if (userData.roleId) {
        const role = await this.roleRepository.findOne({
          where: { id: userData.roleId },
        });
        if (!role) {
          throw new NotFoundException('Rol no encontrado');
        }
      } else {
        // Rol por defecto: vendedor (id: 3)
        userData.roleId = 3;
      }

      // Encriptar contraseña
      if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 10);
      }

      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // Si se actualiza contraseña, encriptar
    if (userData.password) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }

    // Si se actualiza rol, verificar que existe
    if (userData.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: userData.roleId },
      });
      if (!role) {
        throw new NotFoundException('Rol no encontrado');
      }
    }

    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = isActive;
    return await this.userRepository.save(user);
  }

  async getRoles() {
    return this.roleRepository.find();
  }
}