import { ChildEntity, Column } from 'typeorm';
import { Trabajador } from '../trabajador/trabajador.entity';

// Entidad Supervisor que extiende de Trabajador.
@ChildEntity()
export class Supervisor extends Trabajador {
  @Column({ unique: true })
  dni: string;
}
