import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Comunicacion } from '../comunicacion/comunicacion.entity';

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
    estado_cuenta: string;

    @Column({ type: 'date' })
    f_nac: Date;

    @Column()
    nivel_dependencia: string;

    @Column()
    datos_medicos_dolencias: string;

    @Column()
    medicacion: string;

    @OneToMany(() => Comunicacion, com => com.usuario)
    comunicaciones: Comunicacion[];

    @ManyToOne(() => Usuario)
    contactoEmergencia: Usuario; // Relación por DNI_cont
}
