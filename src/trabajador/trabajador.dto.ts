import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TipoTrabajador } from './trabajador.entity';

// DTO para crear un trabajador.
export class CreateTrabajadorDTO {
  @IsString()
  @Length(1, 120)
  @ApiProperty({ description: 'Nombre del trabajador', example: 'Julen' })
  nombre: string;

  // DTO para actualizar un trabajador.
  @IsString()
  @Length(1, 150)
  @ApiProperty({
    description: 'Apellido del trabajador',
    example: 'García Mártinez',
  })
  apellidos: string;

  // DTO para la respuesta de un trabajador.
  @IsEmail()
  @ApiProperty({
    description: 'Correo electronico del trabajador',
    example: 'julen.garcia@cuidem.local',
  })
  correo: string;

  // Contraseña temporal o definitiva
  @IsString()
  @Length(6, 128)
  @ApiProperty({
    description: 'Contraseña temporal o definitiva',
    example: 'temporal123',
  })
  contrasena: string;

  // Rol del trabajador
  @IsEnum(TipoTrabajador)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @ApiProperty({
    description: 'Rol del trabajador',
    enum: TipoTrabajador,
    example: TipoTrabajador.TELEOPERADOR,
  })
  rol: TipoTrabajador;

  // NIA obligatorio para teleoperadores
  @ValidateIf((dto) => dto.rol === TipoTrabajador.TELEOPERADOR)
  @IsString()
  @Matches(/^[0-9]{8}$/, { message: 'Formato de NIA incorrecto' })
  @ApiPropertyOptional({
    description: 'NIA obligatorio para teleoperadores (8 dígitos)',
    example: '12345678',
  })
  nia?: string;

  // DNI obligatorio para supervisores
  @ValidateIf((dto) => dto.rol === TipoTrabajador.SUPERVISOR)
  @IsString()
  @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Formato de DNI incorrecto' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @ApiPropertyOptional({
    description: 'DNI obligatorio para supervisores (8 dígitos + letra)',
    example: '12345678A',
  })
  dni?: string;
}
// DTO para actualizar un trabajador (parcial).
export class UpdateTrabajadorDTO {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  @ApiPropertyOptional({
    description: 'Nombre del trabajador',
    example: 'Julen',
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  @ApiPropertyOptional({
    description: 'Apellido del trabajador',
    example: 'García Mártinez',
  })
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'Correo electronico del trabajador',
    example: 'julen.garcia@cuidem.local',
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
  @IsEnum(TipoTrabajador)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @ApiPropertyOptional({
    description: 'Rol del trabajador',
    enum: TipoTrabajador,
    example: TipoTrabajador.SUPERVISOR,
  })
  rol?: TipoTrabajador;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8}$/, { message: 'Formato de NIA incorrecto' })
  @ApiPropertyOptional({
    description: 'NIA del teleoperador (8 dígitos)',
    example: '12345678',
  })
  nia?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Formato de DNI incorrecto' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @ApiPropertyOptional({
    description: 'DNI del supervisor (8 dígitos + letra)',
    example: '12345678A',
  })
  dni?: string;
}
// DTO para la respuesta de un trabajador.
export class TrabajadorReponseDTO {
  @ApiProperty({ description: 'Identificador unico', example: 1 })
  id_trab: number;

  @ApiProperty({ description: 'Nombre del trabajador', example: 'Julen' })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del trabajador',
    example: 'García Mártinez',
  })
  apellidos: string;

  @ApiPropertyOptional({
    description: 'Correo electronico del trabajador',
    example: 'julen.garcia@cuidem.local',
  })
  correo?: string;

  @ApiProperty({
    description: 'Rol del trabajador',
    enum: TipoTrabajador,
    example: TipoTrabajador.SUPERVISOR,
  })
  rol: TipoTrabajador;

  @ApiPropertyOptional({
    description: 'NIA del teleoperador (8 dígitos)',
    example: '12345678',
  })
  nia?: string;

  @ApiPropertyOptional({
    description: 'DNI del supervisor (8 dígitos + letra)',
    example: '12345678A',
  })
  dni?: string;

  @ApiPropertyOptional({
    description: 'Identificador del grupo al que pertenece el teleoperador',
    example: 2,
  })
  grupoId?: number;
}
