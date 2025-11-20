import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Grupo } from '../grupo/grupo.entity';
import { Usuario } from '../usuario/usuario.entity';

// Entidad que representa una comunicación en la base de datos
@Entity('comunicacion')
export class Comunicacion {
  @PrimaryGeneratedColumn()
  id_com: number;

  @Column()
  fecha: Date;

  @Column()
  hora: string;

  @Column()
  duracion: string;

  @Column()
  resumen: string;

  @Column()
  estado: string;

  @Column()
  observaciones: string;

  // Relación Many-to-One con la entidad Grupo
  @ManyToOne(() => Grupo, (grupo) => grupo.comunicaciones, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  grupo: Grupo | null;

  // Relación Many-to-One con la entidad Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.comunicaciones)
  usuario: Usuario;
}
