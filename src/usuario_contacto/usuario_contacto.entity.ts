import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';


@Entity()
export class UsuarioContactoUsuario {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.contactosAsignados)
    usuario: Usuario;

    @ManyToOne(() => Usuario, usuario => usuario.esContactoDe)
    contacto: Usuario;

    @Column({ nullable: true })
    parentesco: string;

    @Column({ nullable: true })
    observaciones: string;
}

