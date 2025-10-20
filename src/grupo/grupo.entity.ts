import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Comunicacion } from '../comunicacion/comunicacion.entity';

@Entity('grupo')
export class Grupo {
    @PrimaryGeneratedColumn()
    id_grup: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column({ default: true })
    activo: boolean;

    @OneToMany(() => Teleoperador, tel => tel.grupo)
    teleoperadores: Teleoperador[];

    @OneToMany(() => Comunicacion, com => com.grupo)
    comunicaciones: Comunicacion[];
}