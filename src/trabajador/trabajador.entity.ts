import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  BaseEntity,
} from 'typeorm';

/*export enum TipoTrabajador {
  TELEOPERADOR = 'teleoperador',
  SUPERVISOR = 'supervisor',
}*/



@Entity('trabajador')
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
export class Trabajador {
  @PrimaryGeneratedColumn()
  id_trab: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena: string;

  @Column()
  tipo: number;
}
