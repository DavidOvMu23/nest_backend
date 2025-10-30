import {
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

/** DTO para crear supervisor. DNI se deja opcional aquí; ajusta si lo quieres obligatorio */
export class CreateSupervisorDTO {
    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Format of DNI incorrect' })
    @ApiPropertyOptional({ description: 'DNI del supervisor (8 dígitos + letra)', example: '12345678A' })
    dni?: string;
}

export class UpdateSupervisorDTO {
    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Format of DNI incorrect' })
    @ApiPropertyOptional({ description: 'DNI del supervisor (8 dígitos + letra)', example: '12345678A' })
    dni?: string;
}

/** DTO de respuesta que describe lo que el servidor devuelve al cliente */
export class SupervisorResponseDTO {
    @ApiProperty({ description: 'Identificador único', example: 1 })
    id: number;

    @ApiPropertyOptional({ description: 'DNI (8 dígitos + letra)', example: '12345678A' })
    dni?: string;

    @ApiProperty({ description: 'Fecha de creación (ISO)', example: '2025-10-30T12:34:56.789Z' })
    createdAt: string;

    @ApiPropertyOptional({ description: 'Fecha de última actualización (ISO)', example: '2025-10-30T12:34:56.789Z' })
    updatedAt?: string;
}