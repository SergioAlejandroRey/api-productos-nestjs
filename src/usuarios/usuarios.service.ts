import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({ where: { email } });
  }

  findByEmailConPassword(email: string): Promise<Usuario | null> {
    return this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.passwordHash')
      .where('usuario.email = :email', { email })
      .getOne();
  }

  create(datos: Pick<Usuario, 'nombre' | 'email' | 'passwordHash'>): Promise<Usuario> {
    const usuario = this.usuariosRepository.create(datos);
    return this.usuariosRepository.save(usuario);
  }
}
