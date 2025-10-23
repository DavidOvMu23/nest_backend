import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    BaseEntity,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

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
    @ManyToMany(() => Usuario, usuario => usuario.contactosEmergencia, { nullable: true })
    usuarios?: Usuario[];
    dni_usuario_ref: Usuario | null;
}
