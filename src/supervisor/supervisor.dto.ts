import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Length,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

/**
 * NOTA RÁPIDA (por si eres “nuevo”):
 * Un DTO (Data Transfer Object) describe la forma exacta del JSON que esperamos recibir
 * o enviar. Aquí usamos decoradores de class-validator para forzar el tipo de dato y
 * mostrar mensajes claros si algo está mal, y decoradores de Swagger para documentar la API.
 */

/** DTO para crear supervisor dentro del panel de gestión */
export class CreateSupervisorDTO {
  // Campo obligatorio de texto. Limitamos la longitud para evitar nombres absurdamente largos.
  @IsString()
  @Length(1, 120)
  @ApiProperty({ description: 'Nombre del supervisor', example: 'Sofía' })
  nombre: string;

  // Igual que antes, pero para los apellidos.
  @IsString()
  @Length(1, 150)
  @ApiProperty({
    description: 'Apellidos del supervisor',
    example: 'Martín Prado',
  })
  apellidos: string;

  // Un correo válido y único. Si no tiene formato de email, salta error antes de llegar al controller.
  @IsEmail()
  @ApiProperty({
    description: 'Correo corporativo único',
    example: 'sofia.martin@cuidem.local',
  })
  correo: string;

  // Pedimos una contraseña con longitud mínima para que no sea “123”.
  @IsString()
  @Length(6, 128)
  @ApiProperty({
    description: 'Contraseña temporal o definitiva',
    example: 'temporal123',
  })
  contrasena: string;
  // El DNI es obligator al crear, debe cumplir el patrón 8 números + letra.
  @IsString()
  @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Format of DNI incorrect' })
  @ApiProperty({
    description: 'DNI del supervisor (8 dígitos + letra)',
    example: '12345678A',
  })
  dni: string;
}

export class UpdateSupervisorDTO {
  // En los DTO de actualización todo es opcional: solo cambiamos lo que venga en el body.
  @IsOptional()
  @IsString()
  @Length(1, 120)
  @ApiPropertyOptional({
    description: 'Nombre del supervisor',
    example: 'Sofía',
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  @ApiPropertyOptional({
    description: 'Apellidos del supervisor',
    example: 'Martín Prado',
  })
  apellidos?: string;

  // Permitimos actualizar el correo si no entra en conflicto con otro.
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'Correo corporativo único',
    example: 'sofia.martin@cuidem.local',
  })
  correo?: string;

  // Se puede regenerar la contraseña; aplicamos las mismas reglas que al crear.
  @IsOptional()
  @IsString()
  @Length(6, 128)
  @ApiPropertyOptional({
    description: 'Contraseña temporal o definitiva',
    example: 'temporal123',
  })
  contrasena?: string;

  // También aplicamos la misma validación del DNI (si viene vacío no se toca).
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Format of DNI incorrect' })
  @ApiPropertyOptional({
    description: 'DNI del supervisor (8 dígitos + letra)',
    example: '12345678A',
  })
  dni?: string;
}

/** DTO de respuesta que describe lo que el servidor devuelve al cliente */
export class SupervisorResponseDTO {
  // Este id viene de la tabla padre (trabajador). Sirve para futuras operaciones.
  @ApiProperty({ description: 'Identificador único', example: 1 })
  id_trab: number;

  // El resto de campos se devuelven tal cual están guardados en la BD.
  @ApiProperty({ description: 'Nombre del supervisor', example: 'Sofía' })
  nombre: string;

  @ApiProperty({
    description: 'Apellidos del supervisor',
    example: 'Martín Prado',
  })
  apellidos: string;

  @ApiProperty({
    description: 'Correo corporativo',
    example: 'sofia.martin@cuidem.local',
  })
  correo: string;

  @ApiProperty({ description: 'DNI (8 dígitos + letra)', example: '12345678A' })
  dni: string;
}
