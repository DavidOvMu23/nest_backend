import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrabajadorDTO, UpdateTrabajadorDTO } from './trabajador.dto';
import { Trabajador } from './trabajador.entity';


@Injectable()
export class TrabajadorService {
    constructor(
        @InjectRepository(Trabajador)
        private readonly trabajadorRepository: Repository<Trabajador>,
    ) { }


    async create(dto: CreateTrabajadorDTO): Promise<Trabajador> {
        const trabajador = this.trabajadorRepository.create({
            nombre: dto.nombre,
            apellidos: dto.apellidos,
            correo: dto.correo,
            contrasena: dto.contrasena
        })
        return this.trabajadorRepository.save(trabajador)
    }


    async findAll(): Promise<Trabajador[]> {
        return this.trabajadorRepository.find();
    }


    async findOne(id: number): Promise<Trabajador | null> {
        return this.trabajadorRepository.findOne({
            where: {
                id_trab: id
            }
        })
    }

    async update(id: number, dto: UpdateTrabajadorDTO): Promise<Trabajador | null> {
        const trabajador = await this.trabajadorRepository.findOne({
            where: {
                id_trab: id
            }
        })


        if (!trabajador) {
            return null;
        }


        if (dto.nombre !== undefined) trabajador.nombre = dto.nombre;
        if (dto.apellidos !== undefined) trabajador.apellidos = dto.apellidos;
        if (dto.correo !== undefined) trabajador.correo = dto.correo;
        if (dto.contrasena !== undefined) trabajador.contrasena = dto.contrasena;

        return this.trabajadorRepository.save(trabajador)
    }


    async remove(id: number): Promise<boolean> {
        const result = await this.trabajadorRepository.delete({
            id_trab: id
        })
        const affected = result.affected ?? 0;
        return affected > 0;
    }
}
