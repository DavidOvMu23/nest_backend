import { ChildEntity, Column } from 'typeorm';
import { Trabajador } from '../trabajador/trabajador.entity';

@ChildEntity()
export class Supervisor extends Trabajador {
  @Column({ unique: true })
  dni: string;
}
