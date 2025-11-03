import { IsEmail, IsOptional, IsString, Matches, Length, IsNumber } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';


export class CreateTrabajadorDTO {
    @IsString()
    @Length(1, 120)
    @ApiProperty({ description: 'Nombre del trabajador', example: 'Julen' })
    nombre: string;

    @IsString()
    @Length(1, 150)
    @ApiProperty({ description: 'Apellido del trabajador', example: 'García Mártinez' })
    apellidos: string;

    @IsEmail()
    @ApiProperty({ description: 'Correo electronico del trabajador', example: 'julen.garcia@cuidem.local' })
    correo: string;

    @IsString()
    @Length(6, 128)
    @ApiProperty({ description: 'Contraseña temporal o definitiva', example: 'temporal123' })
    contrasena: string;

}


export class UpdateTrabajadorDTO {
    @IsOptional()
    @IsString()
    @Length(1, 120)
    @ApiPropertyOptional({ description: 'Nombre del trabajador', example: 'Julen' })
    nombre?: string;

    @IsOptional()
    @IsString()
    @Length(1, 150)
    @ApiPropertyOptional({ description: 'Apellido del trabajador', example: 'García Mártinez' })
    apellidos?: string;

    @IsOptional()
    @IsEmail()
    @ApiPropertyOptional({ description: 'Correo electronico del trabajador', example: 'julen.garcia@cuidem.local' })
    correo?: string;

    @IsOptional()
    @IsString()
    @Length(6, 128)
    @ApiPropertyOptional({ description: 'Contraseña temporal o definitiva', example: 'temporal123' })
    contrasena?: string;

}

export class TrabajadorReponseDTO {
    @ApiProperty({ description: 'Identificador unico', example: 1 })
    id_trab: number;

    @ApiProperty({ description: 'Nombre del trabajador', example: 'Julen' })
    nombre: string;

    @ApiProperty({ description: 'Apellido del trabajador', example: 'García Mártinez' })
    apellidos: string;

    @ApiPropertyOptional({ description: 'Correo electronico del trabajador', example: 'julen.garcia@cuidem.local' })
    correo?: string;

}