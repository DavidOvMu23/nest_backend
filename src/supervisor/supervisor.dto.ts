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

export class CreateSupervisorDTO {
    @IsOptional()
    @IsInt()
    @Matches(
        /^[0-9]{8}[A-Z]$/,
        {
            message: 'Format of DNI incorrect'
        }

    )
    dni?: number
}

export class UpdateSupervisorDTO {
    @IsOptional()
    @IsInt()
    @Matches(
        /^[0-9]{8}[A-Z]$/,
        {
            message: 'Format of DNI incorrect'
        }

    )
    dni?: number
}