import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrabajadorDTO, UpdateTrabajadorDTO } from './trabajador.dto';
import { Trabajador, TipoTrabajador } from './trabajador.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';

@Injectable()
export class TrabajadorService {
    constructor(
        @InjectRepository(Trabajador)
        private readonly trabajadorRepository: Repository<Trabajador>,
        @InjectRepository(Teleoperador)
        private readonly teleoperadorRepository: Repository<Teleoperador>,
        @InjectRepository(Supervisor)
        private readonly supervisorRepository: Repository<Supervisor>,
    ) { }

    async create(dto: CreateTrabajadorDTO): Promise<Trabajador> {
        const rol =
            typeof dto.rol === 'string'
                ? (dto.rol.toLowerCase() as TipoTrabajador)
                : dto.rol;

        if (!rol) {
            throw new BadRequestException('Debe indicar un rol válido para el trabajador');
        }

        if (rol === TipoTrabajador.TELEOPERADOR) {
            if (!dto.nia) {
                throw new BadRequestException('El NIA es obligatorio para crear un teleoperador');
            }

            const teleoperador = this.teleoperadorRepository.create({
                nombre: dto.nombre,
                apellidos: dto.apellidos,
                correo: dto.correo,
                contrasena: dto.contrasena,
                rol: TipoTrabajador.TELEOPERADOR,
                nia: dto.nia,
            });

            return this.teleoperadorRepository.save(teleoperador);
        }

        if (rol === TipoTrabajador.SUPERVISOR) {
            if (!dto.dni) {
                throw new BadRequestException('El DNI es obligatorio para crear un supervisor');
            }

            const supervisor = this.supervisorRepository.create({
                nombre: dto.nombre,
                apellidos: dto.apellidos,
                correo: dto.correo,
                contrasena: dto.contrasena,
                rol: TipoTrabajador.SUPERVISOR,
                dni: typeof dto.dni === 'string' ? dto.dni.toUpperCase() : dto.dni,
            });

            return this.supervisorRepository.save(supervisor);
        }

        const trabajador = this.trabajadorRepository.create({
            nombre: dto.nombre,
            apellidos: dto.apellidos,
            correo: dto.correo,
            contrasena: dto.contrasena,
            rol,
        });
        return this.trabajadorRepository.save(trabajador);
    }

    async findAll(): Promise<Trabajador[]> {
        return this.trabajadorRepository.find();
    }

    async findOne(id: number): Promise<Trabajador | null> {
        return this.trabajadorRepository.findOne({
            where: {
                id_trab: id,
            },
        });
    }

    async update(id: number, dto: UpdateTrabajadorDTO): Promise<Trabajador | null> {
        const trabajador = await this.trabajadorRepository.findOne({
            where: {
                id_trab: id,
            },
        });

        if (!trabajador) {
            return null;
        }

        const rolUpdate =
            dto.rol === undefined
                ? undefined
                : typeof dto.rol === 'string'
                    ? (dto.rol.toLowerCase() as TipoTrabajador)
                    : dto.rol;

        if (rolUpdate !== undefined && rolUpdate !== trabajador.rol) {
            throw new BadRequestException('El rol de un trabajador no se puede cambiar desde este endpoint');
        }

        if (dto.nombre !== undefined) trabajador.nombre = dto.nombre;
        if (dto.apellidos !== undefined) trabajador.apellidos = dto.apellidos;
        if (dto.correo !== undefined) trabajador.correo = dto.correo;
        if (dto.contrasena !== undefined) trabajador.contrasena = dto.contrasena;

        if (trabajador instanceof Teleoperador) {
            if (dto.nia !== undefined) {
                trabajador.nia = dto.nia;
            }
            return this.teleoperadorRepository.save(trabajador);
        }

        if (trabajador instanceof Supervisor) {
            if (dto.dni !== undefined) {
                trabajador.dni =
                    typeof dto.dni === 'string' ? dto.dni.toUpperCase() : dto.dni;
            }
            return this.supervisorRepository.save(trabajador);
        }

        return this.trabajadorRepository.save(trabajador);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.trabajadorRepository.delete({
            id_trab: id,
        });
        const affected = result.affected ?? 0;
        return affected > 0;
    }
}
