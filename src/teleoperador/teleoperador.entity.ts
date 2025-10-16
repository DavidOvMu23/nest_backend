import {
    ChildEntity,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Trabajador } from '../trabajador/trabajador.entity';
import { Grupo } from '../grupo/grupo.entity';
import { Notificacion } from '../notificacion/notificacion.entity';

@ChildEntity()
export class Teleoperador extends Trabajador {
    @Column({ unique: true })
    nia: string;

    @ManyToOne(() => Grupo, grupo => grupo.teleoperadores, { nullable: true })
    grupo: Grupo;

    @OneToMany(() => Notificacion, noti => noti.teleoperador)
    notificaciones: Notificacion[];
}
