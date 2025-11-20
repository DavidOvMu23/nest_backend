import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Length,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

// DTO para crear un teleoperador.
export class CreateTeleoperadorDTO {
  @IsString()
  @Length(1, 120)
  @ApiProperty({ description: 'Nombre del Teleoperador', example: 'Juan' })
  nombre: string;

  @IsString()
  @Length(1, 150)
  @ApiProperty({
    description: 'Apellido del teleoperador',
    example: 'Matín Prado',
  })
  apellidos: string;

  @IsEmail()
  @ApiProperty({
    description: 'Correo del teleoperador',
    example: 'Juan.martin@cuidem.local',
  })
  correo: string;

  @IsString()
  @Length(6, 128)
  @ApiProperty({
    description: 'Contraseña temporal o definitiva',
    example: 'temporal123',
  })
  contrasena: string;

  @IsNumber()
  @Matches(/^[0-9]{8}$/, { message: 'Formato de NIA incorrecto' })
  @ApiProperty({
    description: 'NIA del teleoperador(8 dígitos)',
    example: '12345678A',
  })
  nia: string;
}

// DTO para actualizar un teleoperador (parcial).
export class UpdateTeleoperadorDTO {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  @ApiPropertyOptional({
    description: 'Nombre del Teleoperador',
    example: 'Juan',
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  @ApiPropertyOptional({
    description: 'Apellido del teleoperador',
    example: 'Matín Prado',
  })
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'Correo del teleoperador',
    example: 'Juan.martin@cuidem.local',
  })
  correo?: string;

  @IsOptional()
  @IsString()
  @Length(6, 128)
  @ApiPropertyOptional({
    description: 'Contraseña temporal o definitiva',
    example: 'temporal123',
  })
  contrasena?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8}$/, { message: 'Formato de NIA incorrecto' })
  @ApiPropertyOptional({
    description: 'NIA del teleoperador(8 dígitos)',
    example: '12345678',
  })
  nia?: string;
}

// DTO para la respuesta de un teleoperador.
export class TeleoperadorResponseDTO {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  id_trab: number;

  @ApiProperty({ description: 'Nombre del teleoperador', example: 'Juan' })
  nombre: string;

  @ApiProperty({
    description: 'Apellidos del teleoperador',
    example: 'Martín Prado',
  })
  apellidos: string;

  @ApiProperty({
    description: 'Correo corporativo',
    example: 'juan.martin@cuidem.local',
  })
  correo: string;

  @ApiProperty({ description: 'NIA (8 dígitos)', example: '12345678' })
  nia: string;
}
