import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Teleoperador } from '../teleoperador/teleoperador.entity';

@Entity('notificacion')
export class Notificacion {
    @PrimaryGeneratedColumn()
    id_not: number;

    @Column()
    contenido: string;

    @Column()
    estado: string;

    @ManyToOne(() => Teleoperador, tel => tel.notificaciones)
    teleoperador: Teleoperador;
}
