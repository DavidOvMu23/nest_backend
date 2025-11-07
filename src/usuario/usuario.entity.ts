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

  @Column()
  estado_cuenta: boolean;

  @Column({ type: 'date' })
  f_nac: Date;

  @Column()
  nivel_dependencia: string;

  @Column({ nullable: true })
  datos_medicos_dolencias: string;

  @Column({ nullable: true })
  medicacion: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @OneToMany(() => Comunicacion, (com) => com.usuario)
  comunicaciones: Comunicacion[];

  @ManyToMany(() => ContactoEmergencia, (contacto) => contacto.usuarios, {
    cascade: true,
  })
  @JoinTable({
    name: 'usuario_contacto', // nombre de tabla intermedia igual que en SQL
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
