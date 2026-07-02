import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Grupo } from '../grupo/grupo.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';

// Entidad que representa una comunicación en la base de datos
@Entity('comunicacion')
export class Comunicacion {
  @PrimaryGeneratedColumn()
  id_com: number;

  // Tipo 'date': almacena solo la fecha (sin hora ni zona horaria), evitando
  // que PostgreSQL convierta a UTC y el día retroceda uno. La hora se guarda
  // por separado en la columna 'hora'.
  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  hora: string;

  @Column()
  duracion: string;

  @Column()
  resumen: string;

  @Column()
  estado: string;

  @Column({ nullable: true })
  observaciones?: string;

  // Información que deja el supervisor para el teleoperador que hará la
  // llamada (instrucciones, contexto...). La escribe el supervisor al crear
  // la llamada; el teleoperador solo puede leerla.
  @Column({ nullable: true })
  informacion_supervisor?: string;

  // Relación Many-to-One con la entidad Grupo
  @ManyToOne(() => Grupo, (grupo) => grupo.comunicaciones, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  grupo: Grupo | null;

  // Relación Many-to-One con la entidad Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.comunicaciones)
  usuario: Usuario;

  // Relación Many-to-One con el teleoperador que realizó la comunicación
  @ManyToOne(() => Teleoperador, { nullable: true, onDelete: 'SET NULL' })
  teleoperador: Teleoperador | null;
}
