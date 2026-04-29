import { IsOptional, IsString, Length, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoNotificacion, TipoNotificacion } from './notificacion.entity';

// DTO para crear una notificación
export class CreateNotificacionDTO {
  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Contenido de la notificación',
    example: 'Tienes 3 llamadas programadas para hoy a partir de las 10:00.',
  })
  contenido: string;

  @IsEnum(EstadoNotificacion)
  @ApiPropertyOptional({
    description: 'Estado de la notificación',
    enum: EstadoNotificacion,
    example: EstadoNotificacion.SIN_LEER,
  })
  estado?: EstadoNotificacion = EstadoNotificacion.SIN_LEER;

  @IsEnum(TipoNotificacion)
  @ApiPropertyOptional({
    description: 'Tipo de notificación',
    enum: TipoNotificacion,
    example: TipoNotificacion.OTRO,
  })
  tipo?: TipoNotificacion = TipoNotificacion.OTRO;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Metadata opcional para acciones contextuales',
    example: { usuarioId: 1, accion: 'view' },
  })
  metadata?: Record<string, any>;
}

// DTO para actualizar una notificación
export class UpdateNotificacionDTO {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Contenido de la notificación',
    example: 'Tienes 3 llamadas programadas para hoy a partir de las 10:00.',
  })
  contenido?: string;

  @IsOptional()
  @IsEnum(EstadoNotificacion)
  @ApiPropertyOptional({
    description: 'Estado de la notificación',
    enum: EstadoNotificacion,
    example: EstadoNotificacion.LEIDA,
  })
  estado?: EstadoNotificacion;

  @IsOptional()
  @IsEnum(TipoNotificacion)
  @ApiPropertyOptional({
    description: 'Tipo de notificación',
    enum: TipoNotificacion,
  })
  tipo?: TipoNotificacion;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: 'Metadata opcional',
    example: { usuarioId: 1 },
  })
  metadata?: Record<string, any>;
}

// DTO para respuesta de notificación (con timestamps)
export class NotificacionResponseDTO {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  id_not: number;

  @ApiProperty({
    description: 'Contenido de la notificación',
    example: 'Tienes 3 llamadas programadas para hoy.',
  })
  contenido: string;

  @ApiProperty({
    description: 'Estado de la notificación',
    enum: EstadoNotificacion,
    example: EstadoNotificacion.SIN_LEER,
  })
  estado: EstadoNotificacion;

  @ApiProperty({
    description: 'Tipo de notificación',
    enum: TipoNotificacion,
    example: TipoNotificacion.USUARIO_NUEVO,
  })
  tipo: TipoNotificacion;

  @ApiPropertyOptional({
    description: 'Metadata adicional',
    example: { usuarioId: 1 },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2026-04-28T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2026-04-28T10:05:00.000Z',
  })
  updatedAt: Date;
}
