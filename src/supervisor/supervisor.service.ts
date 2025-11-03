import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupervisorDTO, UpdateSupervisorDTO } from './supervisor.dto';
import { Supervisor } from './supervisor.entity';
import { TipoTrabajador } from '../trabajador/trabajador.entity';

/**
 * Servicio = “la zona que habla con la base de datos”.
 * Aquí no hay magia: inyectamos el Repository de TypeORM y usamos sus métodos
 * para crear, buscar, actualizar o borrar supervisores.
 */
@Injectable()
export class SupervisorService {
    constructor(
        @InjectRepository(Supervisor)
        private readonly supervisorRepository: Repository<Supervisor>,
    ) { }

    /**
     * CREATE = recibir el DTO y convertirlo en una entidad lista para guardar.
     * - repository.create() construye el objeto (pero no lo guarda).
     * - repository.save() lo mete en la base de datos.
     */
    async create(dto: CreateSupervisorDTO): Promise<Supervisor> {
        const supervisor = this.supervisorRepository.create({
            nombre: dto.nombre,
            apellidos: dto.apellidos,
            correo: dto.correo,
            contrasena: dto.contrasena,
            dni: dto.dni.toUpperCase(), // normalizamos el DNI a mayúsculas
            tipo: TipoTrabajador.SUPERVISOR, // aseguramos que el tipo coincide con la subclase
        });

        return this.supervisorRepository.save(supervisor);
    }

    /**
     * READ ALL = devuelve el listado completo.
     * find() sin parámetros = SELECT * FROM supervisor;
     */
    async findAll(): Promise<Supervisor[]> {
        return this.supervisorRepository.find();
    }

    /**
     * READ ONE = buscamos por el id (en la tabla heredada se llama id_trab).
     * Si no existe devolvemos null y el controller decidirá qué hacer.
     */
    async findOne(id: number): Promise<Supervisor | null> {
        return this.supervisorRepository.findOne({ where: { id_trab: id } });
    }

    /**
     * UPDATE = primero buscamos, luego tocamos solo los campos que llegaron en el DTO
     * y finalmente persistimos el resultado con save().
     */
    async update(id: number, dto: UpdateSupervisorDTO): Promise<Supervisor | null> {
        const supervisor = await this.supervisorRepository.findOne({ where: { id_trab: id } });
        if (!supervisor) {
            return null;
        }

        if (dto.nombre !== undefined) supervisor.nombre = dto.nombre;
        if (dto.apellidos !== undefined) supervisor.apellidos = dto.apellidos;
        if (dto.correo !== undefined) supervisor.correo = dto.correo;
        if (dto.contrasena !== undefined) supervisor.contrasena = dto.contrasena;
        if (dto.dni !== undefined) supervisor.dni = dto.dni ? dto.dni.toUpperCase() : supervisor.dni;

        return this.supervisorRepository.save(supervisor);
    }

    /**
     * DELETE = usamos delete({ id }) y devolvemos true/false según si borró algo.
     * result.affected nos dice cuántas filas fueron eliminadas.
     */
    async remove(id: number): Promise<boolean> {
        const result = await this.supervisorRepository.delete({ id_trab: id });
        const affected = result.affected ?? 0;
        return affected > 0;
    }
}
