import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Teleoperador } from '../teleoperador/teleoperador.entity';

// Entidad Notificacion mapeada a la tabla 'notificacion'.
@Entity('notificacion')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id_not: number;

  @Column()
  contenido: string;

  @Column()
  estado: string;

  @ManyToOne(() => Teleoperador, (tel) => tel.notificaciones)
  teleoperador: Teleoperador;
}
