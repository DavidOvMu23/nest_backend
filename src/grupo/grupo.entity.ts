import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Comunicacion } from '../comunicacion/comunicacion.entity';

// Entidad Grupo que representa un grupo en la base de datos.
@Entity('grupo')
export class Grupo {
  @PrimaryGeneratedColumn()
  id_grup: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Teleoperador, (tel) => tel.grupo)
  teleoperadores: Teleoperador[];

  @OneToMany(() => Comunicacion, (com) => com.grupo)
  comunicaciones: Comunicacion[];
}
