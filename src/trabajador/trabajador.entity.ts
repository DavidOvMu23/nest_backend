import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  BaseEntity,
} from 'typeorm';

// Enum para los tipos de trabajador.
export enum TipoTrabajador {
  SUPERVISOR = 'supervisor',
  TELEOPERADOR = 'teleoperador',
}

// Entidad Trabajador mapeada a la tabla 'trabajador'.
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
    name: 'rol',
  })
  rol: TipoTrabajador;
}
