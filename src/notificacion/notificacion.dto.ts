import { IsOptional, IsString, Length, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoNotificacion, TipoNotificacion } from './notificacion.entity';

export class CreateNotificacionDTO {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @ApiPropertyOptional({ description: 'Título de la notificación' })
  titulo?: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({ description: 'Contenido de la notificación' })
  contenido: string;

  @IsOptional()
  @IsEnum(EstadoNotificacion)
  @ApiPropertyOptional({ enum: EstadoNotificacion })
  estado?: EstadoNotificacion;

  @IsOptional()
  @IsEnum(TipoNotificacion)
  @ApiPropertyOptional({ enum: TipoNotificacion })
  tipo?: TipoNotificacion;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ description: 'Metadata contextual (actorName, groupName, etc.)' })
  metadata?: Record<string, any>;
}

export class UpdateNotificacionDTO {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @ApiPropertyOptional()
  titulo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional()
  contenido?: string;

  @IsOptional()
  @IsEnum(EstadoNotificacion)
  @ApiPropertyOptional({ enum: EstadoNotificacion })
  estado?: EstadoNotificacion;

  @IsOptional()
  @IsEnum(TipoNotificacion)
  @ApiPropertyOptional({ enum: TipoNotificacion })
  tipo?: TipoNotificacion;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  metadata?: Record<string, any>;
}

export class NotificacionResponseDTO {
  id_not: number;
  titulo?: string;
  contenido: string;
  estado: EstadoNotificacion;
  tipo: TipoNotificacion;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
