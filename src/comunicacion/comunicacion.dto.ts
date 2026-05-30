import {
  IsString,
  Length,
  IsOptional,
  IsInt,
  IsDateString,
  ValidateIf,
} from 'class-validator';
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

  // Solo obligatorio cuando la llamada está completada. En pendiente o no
  // contestada todavía no se conoce la duración, así que se permite vacío.
  @ValidateIf((o) => o.estado === 'completada')
  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Duración de la comunicación',
    example: '20',
  })
  duracion: string;

  // Solo obligatorio cuando la llamada está completada. En pendiente o no
  // contestada no hay nada que resumir, así que se permite vacío.
  @ValidateIf((o) => o.estado === 'completada')
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

  @IsOptional()
  @IsString()
  @Length(0, 500)
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

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'ID del teleoperador que realizó la llamada',
    example: 1,
  })
  teleoperadorId?: number;
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

  // Solo obligatorio cuando la llamada está completada (mismo criterio que
  // CreateComunicacionDTO). Así editar una llamada pendiente o no contestada
  // no falla al enviar la duración vacía.
  @IsOptional()
  @ValidateIf((o) => o.estado === 'completada')
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Duración de la comunicación',
    example: '20',
  })
  duracion?: string;

  // Solo obligatorio cuando la llamada está completada (mismo criterio que
  // CreateComunicacionDTO). En pendiente o no contestada se permite vacío.
  @IsOptional()
  @ValidateIf((o) => o.estado === 'completada')
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

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'ID del teleoperador que realizó la llamada',
    example: 1,
  })
  teleoperadorId?: number;
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

export class TeleoperadorComunicacionResponseDTO {
  @ApiProperty({ description: 'ID teleoperador', example: 1 })
  id_trab: number;
  @ApiProperty({ description: 'Nombre', example: 'Laura' })
  nombre: string;
  @ApiProperty({ description: 'Apellidos', example: 'Gómez Pons' })
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

  @ApiPropertyOptional({
    description: 'Observaciones de la llamada',
    example: 'Conversación fluida. Anima a continuar paseos.',
  })
  observaciones?: string;

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

  @ApiPropertyOptional({
    description: 'Teleoperador que realizó la llamada',
    type: () => TeleoperadorComunicacionResponseDTO,
  })
  teleoperador?: TeleoperadorComunicacionResponseDTO;
}
