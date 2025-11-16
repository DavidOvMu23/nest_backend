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
  IsBoolean,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GrupoResponseDTO } from '../grupo/grupo.dto';
import { match } from 'assert';

export class CreateComunicacionDTO {
  @IsDate()
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
}

export class UpdateComunicacionDTO {
  @IsDate()
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
}
