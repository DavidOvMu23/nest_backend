import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

// Entidad para el contacto de emergencia
@Entity('contacto_emergencia')
export class ContactoEmergencia extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_cont: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  telefono: string;

  @Column()
  relacion: string;

  // En tu SQL, algunos contactos están vinculados a usuarios, otros son genéricos
  @ManyToMany(() => Usuario, (usuario) => usuario.contactosEmergencia, {
    nullable: true,
  })
  usuarios?: Usuario[];

  // Relación opcional con un usuario específico
  @ManyToOne(() => Usuario, (usuario) => usuario.contactosPropios, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'dni_usuario_ref', referencedColumnName: 'dni' })
  usuarioReferenciado?: Usuario | null;
}
