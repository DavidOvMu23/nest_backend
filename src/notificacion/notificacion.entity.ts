import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Trabajador } from '../trabajador/trabajador.entity';

export enum TipoNotificacion {
  CALL = 'call',
  SYSTEM = 'system',
  SUPERVISION = 'supervision',
}

export enum EstadoNotificacion {
  SIN_LEER = 'sin_leer',
  LEIDA = 'leida',
  ARCHIVADA = 'archivada',
  CANCELADA = 'cancelada',
}

@Entity('notificacion')
@Index(['teleoperador', 'estado'])
@Index(['createdAt'])
export class Notificacion {
  @PrimaryGeneratedColumn()
  id_not: number;

  @Column({ nullable: true })
  titulo?: string;

  @Column()
  contenido: string;

  @Column({ type: 'enum', enum: EstadoNotificacion, default: EstadoNotificacion.SIN_LEER })
  estado: EstadoNotificacion;

  @Column({ type: 'enum', enum: TipoNotificacion, default: TipoNotificacion.SUPERVISION })
  tipo: TipoNotificacion;

  @Column({ nullable: true, type: 'json' })
  metadata?: Record<string, any>;

  // Destinatario: puede ser Supervisor o Teleoperador (ambos en tabla 'trabajador')
  @ManyToOne(() => Trabajador, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teleoperadorId' })
  teleoperador: Trabajador;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
