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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { match } from 'assert';

export class CreateNotificacionDTO {
  @IsInt()
  id_not: number;

  @IsString()
  @Length(1, 500)
  contenido: string;

  @IsString()
  @Length(1, 500)
  estado: string;
}

export class UpdateNotificacionDTO {
  @IsInt()
  id_not: number;

  @IsString()
  @Length(1, 500)
  contenido: string;

  @IsString()
  @Length(1, 500)
  estado: string;
}
