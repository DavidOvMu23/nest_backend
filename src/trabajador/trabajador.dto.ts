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

    @IsEnum(TipoTrabajador)
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
    @ApiProperty({
        description: 'Rol del trabajador',
        enum: TipoTrabajador,
        example: TipoTrabajador.TELEOPERADOR,
    })
    rol: TipoTrabajador;

    @ValidateIf((dto) => dto.rol === TipoTrabajador.TELEOPERADOR)
    @IsString()
    @Matches(/^[0-9]{8}$/, { message: 'Formato de NIA incorrecto' })
    @ApiPropertyOptional({
        description: 'NIA obligatorio para teleoperadores (8 dígitos)',
        example: '12345678',
    })
    nia?: string;

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

    @IsOptional()
    @IsEnum(TipoTrabajador)
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
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

export class TrabajadorReponseDTO {
    @ApiProperty({ description: 'Identificador unico', example: 1 })
    id_trab: number;

    @ApiProperty({ description: 'Nombre del trabajador', example: 'Julen' })
    nombre: string;

    @ApiProperty({ description: 'Apellido del trabajador', example: 'García Mártinez' })
    apellidos: string;

    @ApiPropertyOptional({ description: 'Correo electronico del trabajador', example: 'julen.garcia@cuidem.local' })
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
