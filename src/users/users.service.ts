import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select(['user.id', 'user.username', 'user.email', 'user.fullName', 'user.isActive', 'user.lastLogin', 'user.createdAt', 'role']);

    if (search) {
      queryBuilder.where('user.username LIKE :search', { search: `%${search}%` })
        .orWhere('user.email LIKE :search', { search: `%${search}%` })
        .orWhere('user.fullName LIKE :search', { search: `%${search}%` });
    }

    queryBuilder.orderBy(`user.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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

  async create(userData: Partial<User>): Promise<User> {
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
    const role = await this.roleRepository.findOne({
      where: { id: userData.roleId },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Encriptar contraseña
    if (userData.password) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
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
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = isActive;
    return this.userRepository.save(user);
  }

  async getRoles() {
    const roles = await this.roleRepository.find();
    return {
      success: true,
      data: roles,
    };
  }
}