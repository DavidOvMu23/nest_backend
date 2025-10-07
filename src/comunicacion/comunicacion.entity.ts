import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Grupo } from '../grupo/grupo.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity('comunicacion')
export class Comunicacion {
    @PrimaryGeneratedColumn()
    id_com: number;

    @Column()
    fecha: Date;

    @Column()
    hora: string;

    @Column()
    duracion: string;

    @Column()
    resumen: string;

    @Column()
    estado: string;

    @Column()
    observaciones: string;

    @ManyToOne(() => Grupo, grupo => grupo.comunicaciones)
    grupo: Grupo;

    @ManyToOne(() => Usuario, usuario => usuario.comunicaciones)
    usuario: Usuario;
}
