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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { match } from 'assert';

// DTO para crear un nuevo Grupo
export class CreateGrupoDTO {
  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Nombre del grupo',
    example: 'Grupo1',
  })
  nombre: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Descripción del grupo',
    example: 'Gupo de alex y miriam',
  })
  descripcion: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Estado del grupo',
    example: true,
  })
  activo: boolean;
}
// DTO para actualizar un Grupo existente
export class UpdateGrupoDTO {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Nombre del grupo',
    example: 'Grupo1',
  })
  nombre: string;


  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Descripción del grupo',
    example: 'Gupo de alex y miriam',
  })
  descripcion: string;


  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Estado del grupo',
    example: true,
  })
  activo: boolean;
}

// DTO para la respuesta de un Grupo
export class GrupoResponseDTO {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  id_grup: number;

  @ApiProperty({
    description: 'Nombre del grupo',
    example: 'Grupo1',
  })
  nombre: string;

  @ApiProperty({
    description: 'Nombre del grupo',
    example: 'Grupo1',
  })
  descripcion: string;

  @ApiProperty({
    description: 'Estado del grupo',
    example: true,
  })
  activo: boolean;
}
