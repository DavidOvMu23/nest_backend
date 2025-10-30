import {
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class CreateSupervisorDTO {
    @IsString()
    @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Format of DNI incorrect' })
    dni: string;
}

export class UpdateSupervisorDTO {

    @IsString()
    @Matches(/^[0-9]{8}[A-Z]$/, { message: 'Format of DNI incorrect' })
    dni: string;
}