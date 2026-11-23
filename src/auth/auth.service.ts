import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/usuario.entity.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existente = await this.usuariosService.findByEmail(email);

    if (existente) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const usuario = await this.usuariosService.create({
      nombre: dto.nombre.trim(),
      email,
      passwordHash,
    });

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: this.usuarioPublico(usuario),
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.findByEmailConPassword(
      dto.email.trim().toLowerCase(),
    );

    if (
      !usuario ||
      !(await bcrypt.compare(dto.password, usuario.passwordHash))
    ) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      usuario: this.usuarioPublico(usuario),
    };
  }

  private usuarioPublico(usuario: Usuario) {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    };
  }
}
