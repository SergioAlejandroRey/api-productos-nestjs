import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;
}
