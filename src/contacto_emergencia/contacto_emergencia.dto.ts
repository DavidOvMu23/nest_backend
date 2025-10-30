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
  @IsInt()
  id_cont: number;

  @IsString()
  @Length(1, 500)
  nombre: string;

  @IsString()
  @Length(1, 500)
  apellidos: string;

  @IsString()
  @Length(1, 500)
  telefono: string;

  @IsString()
  @Length(1, 500)
  relacion: string;
}

export class UpdateContactoEmergenciaDTO {
  @IsInt()
  id_cont: number;

  @IsString()
  @Length(1, 500)
  nombre: string;

  @IsString()
  @Length(1, 500)
  apellidos: string;

  @IsString()
  @Length(1, 500)
  telefono: string;

  @IsString()
  @Length(1, 500)
  relacion: string;
}
