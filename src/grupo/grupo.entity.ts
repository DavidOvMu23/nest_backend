import {
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Comunicacion } from '../comunicacion/comunicacion.entity';

@Entity('grupo')
export class Grupo {
    @PrimaryGeneratedColumn()
    id_grup: number;

    @OneToMany(() => Teleoperador, tel => tel.grupo)
    teleoperadores: Teleoperador[];

    @OneToMany(() => Comunicacion, com => com.grupo)
    comunicaciones: Comunicacion[];
}
