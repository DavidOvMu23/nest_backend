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

export type TipoTrabajador = "admin" | "editor" | "ghost";

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
  contraseña: string;

  @Column({
    type: 'enum',
    enum: ["admin", "editor", "ghost"],
  })
  tipo: TipoTrabajador;
}
