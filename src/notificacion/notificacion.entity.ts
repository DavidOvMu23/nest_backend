import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Teleoperador } from '../teleoperador/teleoperador.entity';

// Enum para tipos de notificación
export enum TipoNotificacion {
  USUARIO_NUEVO = 'usuario_nuevo',
  LLAMADA_PENDING = 'llamada_pending',
  CONTACTO_ASIGNADO = 'contacto_asignado',
  SUPERVISOR_ASIGNADO = 'supervisor_asignado',
  MENSAJE = 'mensaje',
  ALERTA = 'alerta',
  OTRO = 'otro',
}

// Enum para estados
export enum EstadoNotificacion {
  SIN_LEER = 'sin_leer',
  LEIDA = 'leida',
  ARCHIVADA = 'archivada',
  CANCELADA = 'cancelada',
}

// Entidad Notificacion mapeada a la tabla 'notificacion'.
@Entity('notificacion')
@Index(['teleoperador', 'estado']) // Para búsquedas rápidas por usuario y estado
@Index(['createdAt']) // Para ordenar por fecha
export class Notificacion {
  @PrimaryGeneratedColumn()
  id_not: number;

  @Column()
  contenido: string;

  @Column({ type: 'enum', enum: EstadoNotificacion, default: EstadoNotificacion.SIN_LEER })
  estado: EstadoNotificacion;

  @Column({ type: 'enum', enum: TipoNotificacion, default: TipoNotificacion.OTRO })
  tipo: TipoNotificacion;

  // Metadata opcional para acciones contextuales (ej: id del usuario relacionado)
  @Column({ nullable: true, type: 'json' })
  metadata?: Record<string, any>;

  @ManyToOne(() => Teleoperador, (tel) => tel.notificaciones, { eager: true })
  teleoperador: Teleoperador;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
