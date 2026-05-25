import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { LoginDto, RegisterDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
      relations: { role: true },
    });
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último login
    await this.userRepository.update(user.id, { lastLogin: new Date() });

    const payload = { 
      sub: user.id, 
      username: user.username, 
      role: user.role.name 
    };

    return {
      success: true,
      message: 'Login exitoso',
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role.name,
        },
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (existingUser) {
      throw new ConflictException('El usuario o email ya existe');
    }

    // Verificar si el rol existe
    const role = await this.roleRepository.findOne({
      where: { id: registerDto.roleId },
    });

    if (!role) {
      throw new ConflictException('Rol no encontrado');
    }

    // Encriptar contraseña
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    
    const { password, ...result } = savedUser;
    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result,
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        role: true,
      },
    });
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    return {
      success: true,
      data: user,
    };
  }
}