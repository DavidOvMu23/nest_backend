import { IsOptional, IsString, Length, Matches, IsArray, ArrayUnique, ArrayNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO para crear un contacto de emergencia
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


  @IsOptional()
  @IsString()
  @Matches(/^$|^[0-9]{8}[A-Z]$/)
  @ApiPropertyOptional({
    description: 'DNI del usuario/paciente referenciado',
    example: '11111111A',
  })
  dniUsuarioRef?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ValidateIf((o) => Array.isArray((o as any).usuariosDnis))
  @ApiPropertyOptional({
    description: 'Lista de DNIs de usuarios asociados a este contacto',
    example: ['11111111A', '22222222B'],
    isArray: true,
  })
  usuariosDnis?: string[];

  @ApiPropertyOptional({ description: 'Indica si el contacto fue generado automáticamente al crear un usuario', example: false })
  creado_desde_usuario?: boolean;
}

// DTO para actualizar un contacto de emergencia
export class UpdateContactoEmergenciaDTO {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Nombre del contacto de emergencia',
    example: 'Sofía',
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Apellidos del contacto de emergencia',
    example: 'Martín Prado',
  })
  apellidos?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    description: 'Teléfono de el contacto de emergencia',
    example: '6098765433',
  })
  telefono?: string;


  @IsOptional()
  @IsString()
  @Matches(/^$|^[0-9]{8}[A-Z]$/)
  @ApiPropertyOptional({
    description: 'DNI del usuario/paciente referenciado',
    example: '11111111A',
  })
  dniUsuarioRef?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ValidateIf((o) => Array.isArray((o as any).usuariosDnis))
  @ApiPropertyOptional({
    description: 'Lista de DNIs de usuarios asociados a este contacto',
    example: ['11111111A', '22222222B'],
    isArray: true,
  })
  usuariosDnis?: string[];

  @ApiPropertyOptional({ description: 'Indica si el contacto fue generado automáticamente al crear un usuario', example: false })
  creado_desde_usuario?: boolean;
}

// DTO para la respuesta de un contacto de emergencia
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


  @ApiPropertyOptional({
    description: 'DNI del usuario/paciente referenciado',
    example: '11111111A',
  })
  dniUsuarioRef?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario/paciente referenciado',
    example: 'José Martínez',
  })
  pacienteNombre?: string;

  @ApiPropertyOptional({
    description: 'Lista de DNIs de usuarios asociados a este contacto',
    example: ['11111111A', '22222222B'],
    isArray: true,
  })
  usuariosDnis?: string[];
}
