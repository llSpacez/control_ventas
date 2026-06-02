import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
    });
    this.logger.log('JWT Strategy inicializada');
    this.logger.log(`JWT_SECRET configurado: ${!!configService.get('JWT_SECRET')}`);
  }

  async validate(payload: any) {
    this.logger.log(`Payload recibido: ${JSON.stringify(payload)}`);
    
    if (!payload) {
      this.logger.error('Payload vacío');
      throw new UnauthorizedException('Token inválido');
    }

    if (!payload.sub) {
      this.logger.error('Payload sin sub');
      throw new UnauthorizedException('Token inválido: falta sub');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}