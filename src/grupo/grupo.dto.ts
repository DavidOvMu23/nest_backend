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

export class CreateGrupoDTO {
  @IsInt()
  id_grup: number;

  @IsString()
  @Length(1, 500)
  nombre: string;

  @IsString()
  @Length(1, 500)
  descripcion: string;

  @IsBoolean()
  activo: boolean;
}

export class UpdateGrupoDTO {
  @IsInt()
  id_grup: number;

  @IsString()
  @Length(1, 500)
  nombre: string;

  @IsString()
  @Length(1, 500)
  descripcion: string;

  @IsBoolean()
  activo: boolean;
}
