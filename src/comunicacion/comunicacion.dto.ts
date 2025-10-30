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
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { match } from 'assert';

export class CreateComunicacionDTO {
  @IsInt()
  id_com: number;

  @IsDate()
  fecha: Date;

  @IsString()
  @Length(1, 500)
  hora: string;

  @IsString()
  @Length(1, 500)
  duracion: string;

  @IsString()
  @Length(1, 500)
  resumen: string;

  @IsString()
  @Length(1, 500)
  estado: string;

  @IsString()
  @Length(1, 500)
  observaciones: string;
}

export class UpdateComunicacionDTO {
  @IsInt()
  id_com: number;

  @IsDate()
  fecha: Date;

  @IsString()
  @Length(1, 500)
  hora: string;

  @IsString()
  @Length(1, 500)
  duracion: string;

  @IsString()
  @Length(1, 500)
  resumen: string;

  @IsString()
  @Length(1, 500)
  estado: string;

  @IsString()
  @Length(1, 500)
  observaciones: string;
}
