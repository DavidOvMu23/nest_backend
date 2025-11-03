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
export class UpdateGrupoDTO {
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
