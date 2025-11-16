import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Length,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { EstadoCuenta } from './usuario.entity';

export class CreateUsuarioDTO {
  @IsString()
  @Length(9, 9, { message: 'El DNI debe tener 8 dígitos y 1 letra' })
  @ApiProperty({ example: '12345678A' })
  dni: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Carmen' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Rodríguez Sanz' })
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Vive sola, pulsera SOS' })
  informacion: string;

  @IsDateString()
  @ApiProperty({ example: '1945-11-30' })
  f_nac: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'leve' })
  nivel_dependencia: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'HTA y artrosis' })
  datos_medicos_dolencias?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Lisinopril 10mg' })
  medicacion?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '600123456' })
    telefono: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Plaza España 8, Barcelona' })
  direccion?: string;
}

export class UpdateUsuarioDTO {
  @IsOptional()
  @IsString()
  @Length(9, 9, { message: 'El DNI debe tener 8 dígitos y 1 letra' })
  @ApiPropertyOptional({ example: '12345678A' })
  dni?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Carmen' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Rodríguez Sanz' })
  apellidos?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Vive sola, pulsera SOS' })
  informacion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'activo' })
  estado_cuenta?: EstadoCuenta;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: '1945-11-30' })
  f_nac?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'leve' })
  nivel_dependencia?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'HTA y artrosis' })
  datos_medicos_dolencias?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Lisinopril 10mg' })
  medicacion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '600123456' })
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Plaza España 8, Barcelona' })
  direccion?: string;
}

export class UsuarioResponseDTO {
  @ApiProperty({ example: '12345678A' })
  dni: string;

  @ApiProperty({ example: 'Carmen' })
  nombre: string;

  @ApiProperty({ example: 'Rodríguez Sanz' })
  apellidos: string;

  @ApiProperty({ example: 'Vive sola, pulsera SOS' })
  informacion: string;

  @ApiProperty({ example: 'activo' })
  estado_cuenta: EstadoCuenta;

  @ApiProperty({ example: '1945-11-30' })
  f_nac: string;

  @ApiProperty({ example: 'leve' })
  nivel_dependencia: string;

  @ApiPropertyOptional({ example: 'HTA y artrosis' })
  datos_medicos_dolencias?: string;

  @ApiPropertyOptional({ example: 'Lisinopril 10mg' })
  medicacion?: string;

  @ApiPropertyOptional({ example: '600123456' })
  telefono?: string;

  @ApiPropertyOptional({ example: 'Plaza España 8, Barcelona' })
  direccion?: string;
}
