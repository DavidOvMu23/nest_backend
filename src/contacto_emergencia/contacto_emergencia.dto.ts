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

export class CreateContactoEmergenciaDTO {
  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Nombre del contacto de emergencia',
    example: 'Sofía',
  })
  nombre: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Apellidos del contacto de emergencia',
    example: 'Martín Prado',
  })
  apellidos: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Teléfono de el contacto de emergencia',
    example: '6098765433',
  })
  telefono: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Relación del contacto de emergencia con el usuario',
    example: 'Hija',
  })
  relacion: string;
}

export class UpdateContactoEmergenciaDTO {
  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Nombre del contacto de emergencia',
    example: 'Sofía',
  })
  nombre: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Apellidos del contacto de emergencia',
    example: 'Martín Prado',
  })
  apellidos: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Teléfono de el contacto de emergencia',
    example: '6098765433',
  })
  telefono: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Relación del contacto de emergencia con el usuario',
    example: 'Hija',
  })
  relacion: string;
}

export class ContactoEmergenciaResponseDTO {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  id_cont: number;

  @ApiProperty({
    description: 'Nombre del contacto de emergencia',
    example: 'Sofía',
  })
  nombre: string;

  @ApiProperty({
    description: 'Apellidos del contacto de emergencia',
    example: 'Martín Prado',
  })
  apellidos: string;

  @ApiProperty({
    description: 'Teléfono de el contacto de emergencia',
    example: '6098765433',
  })
  telefono: string;

  @ApiProperty({
    description: 'Relación del contacto de emergencia con el usuario',
    example: 'Hija',
  })
  relacion: string;
}
