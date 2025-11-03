import {
  IsEmail,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  Length,
  IsDateString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { match } from 'assert';

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

export class UpdateNotificacionDTO {
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
