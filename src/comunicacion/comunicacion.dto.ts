import { IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GrupoResponseDTO } from '../grupo/grupo.dto';

// DTO para crear una nueva comunicación
export class CreateComunicacionDTO {
  @IsDateString()
  @ApiProperty({
    description: 'Fecha de la comunicación',
    example: '2025-01-14',
  })
  fecha: Date;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Hora de la comunicación',
    example: '16:00',
  })
  hora: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Duración de la comunicación',
    example: '20',
  })
  duracion: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Resumen de la comunicación',
    example: 'Conversación fluida. Anima a continuar paseos.',
  })
  resumen: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Estado de la llamada',
    example: 'completada',
  })
  estado: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Observaciones de la llamada',
    example: 'Conversación fluida. Anima a continuar paseos.',
  })
  observaciones: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'DNI del usuario al que se le hizo la llamada',
    example: '10101010K',
  })
  usuarioId?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'ID del grupo que realizó la llamada',
    example: 1,
  })
  grupoId?: number;
}

export class UpdateComunicacionDTO {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de la comunicación',
    example: '2025-01-14',
  })
  fecha?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Hora de la comunicación',
    example: '16:00',
  })
  hora?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Duración de la comunicación',
    example: '20',
  })
  duracion?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Resumen de la comunicación',
    example: 'Conversación fluida. Anima a continuar paseos.',
  })
  resumen?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Estado de la llamada',
    example: 'completada',
  })
  estado?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Observaciones de la llamada',
    example: 'Conversación fluida. Anima a continuar paseos.',
  })
  observaciones?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'DNI del usuario al que se le hizo la llamada',
    example: '10101010K',
  })
  usuarioId?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'ID del grupo que realizó la llamada',
    example: 1,
  })
  grupoId?: number;
}

// DTO para la respuesta de una comunicación
export class UsuarioComunicacionResponseDTO {
  @ApiProperty({ description: 'ID usuario', example: '10101010K' })
  id_usu: string;
  @ApiProperty({ description: 'Nombre', example: 'Beatriz' })
  nombre: string;
  @ApiProperty({ description: 'Apellidos', example: 'Fernández Luna' })
  apellidos: string;
}

export class ComunicacionResponseDTO {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  id_com: number;

  @ApiProperty({
    description: 'Fecha de la comunicación',
    example: '2025-01-14',
  })
  fecha: Date;

  @ApiProperty({
    description: 'Hora de la comunicación',
    example: '16:00',
  })
  hora: string;

  @ApiProperty({
    description: 'Duración de la comunicación',
    example: '20',
  })
  duracion: string;

  @ApiProperty({
    description: 'Resumen de la comunicación',
    example: 'Conversación fluida. Anima a continuar paseos.',
  })
  resumen: string;

  @ApiProperty({
    description: 'Estado de la llamada',
    example: 'completada',
  })
  estado: string;

  @ApiProperty({
    description: 'Observaciones de la llamada',
    example: 'Conversación fluida. Anima a continuar paseos.',
  })
  observaciones: string;

  @ApiPropertyOptional({
    description: 'Grupo que realizó la comunicación',
    type: () => GrupoResponseDTO,
  })
  grupo?: GrupoResponseDTO;

  @ApiPropertyOptional({
    description: 'Usuario al que se le ha hecho la llamada',
    type: () => UsuarioComunicacionResponseDTO,
  })
  usuario?: UsuarioComunicacionResponseDTO;
}
