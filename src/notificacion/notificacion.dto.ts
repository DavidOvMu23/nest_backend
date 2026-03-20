import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO para crear una notificación.
export class CreateNotificacionDTO {
  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Contenido de la notificación',
    example: 'Tienes 3 llamadas programadas para hoy a partir de las 10:00.',
  })
  contenido: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Estado de la notificación',
    example: 'sin_leer',
  })
  estado: string;
}

// DTO para actualizar una notificación (parcial).
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
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Estado de la notificación',
    example: 'sin_leer',
  })
  estado?: string;
}

// DTO para la respuesta de una notificación.
export class NotificacionResponseDTO {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  id_not: number;

  @ApiProperty({
    description: 'Contenido de la notificación',
    example: 'Tienes 3 llamadas programadas para hoy a partir de las 10:00.',
  })
  contenido: string;

  @ApiProperty({
    description: 'Estado de la notificación',
    example: 'sin_leer',
  })
  estado: string;
}
