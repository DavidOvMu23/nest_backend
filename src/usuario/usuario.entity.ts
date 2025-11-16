import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Comunicacion } from '../comunicacion/comunicacion.entity';
import { ContactoEmergencia } from '../contacto_emergencia/contacto_emergencia.entity';

export enum EstadoCuenta {
  ACTIVO = 'activo',
  SUSPENDIDO = 'suspendido',
}

@Entity('usuario')
export class Usuario {
  @PrimaryColumn()
  dni: string;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  informacion: string;

  @Column({
    type: 'enum',
    enum: EstadoCuenta,
    default: EstadoCuenta.ACTIVO,
  })
  estado_cuenta: EstadoCuenta;

  @Column({ type: 'date' })
  f_nac: Date;

  @Column()
  nivel_dependencia: string;

  @Column({ type: 'text', nullable: true })
  datos_medicos_dolencias?: string | null;

  @Column({ type: 'text', nullable: true })
  medicacion?: string | null;

  @Column()
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string | null;

  @OneToMany(() => Comunicacion, (com) => com.usuario)
  comunicaciones: Comunicacion[];

  @ManyToMany(() => ContactoEmergencia, (contacto) => contacto.usuarios, {
    cascade: true,
  })
  @JoinTable({
    name: 'usuario_contacto',
    joinColumn: { name: 'dni_usuario', referencedColumnName: 'dni' },
    inverseJoinColumn: { name: 'id_contacto', referencedColumnName: 'id_cont' },
  })
  contactosEmergencia: ContactoEmergencia[];

  @OneToMany(
    () => ContactoEmergencia,
    (contacto) => contacto.usuarioReferenciado,
  )
  contactosPropios?: ContactoEmergencia[];
}
