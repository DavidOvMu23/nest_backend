import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  BaseEntity,
} from 'typeorm';

export enum TipoTrabajador {
  SUPERVISOR = 'supervisor',
  TELEOPERADOR = 'teleoperador',
}

@Entity('trabajador')
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
export class Trabajador extends BaseEntity {
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

  @Column({
    type: 'enum',
    enum: TipoTrabajador,
  })
  tipo: TipoTrabajador;
}
