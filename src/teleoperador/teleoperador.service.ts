import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTeleoperadorDTO,
  UpdateTeleoperadorDTO,
} from './teleoperador.dto';
import { Teleoperador } from './teleoperador.entity';
import { TipoTrabajador } from 'src/trabajador/trabajador.entity';

// Servicio de Teleoperador que maneja la lógica de negocio.
@Injectable()
export class TeleoperadorService {
  constructor(
    @InjectRepository(Teleoperador)
    private readonly teleoperadorRepository: Repository<Teleoperador>,
  ) {}

  // Método para crear un nuevo teleoperador.
  async create(dto: CreateTeleoperadorDTO): Promise<Teleoperador> {
    const teleoperador = this.teleoperadorRepository.create({
      nombre: dto.nombre,
      apellidos: dto.apellidos,
      correo: dto.correo,
      contrasena: dto.contrasena,
      nia: dto.nia,
      rol: TipoTrabajador.TELEOPERADOR,
    });

    return this.teleoperadorRepository.save(teleoperador);
  }

  // Método para obtener todos los teleoperadores.
  async findAll(): Promise<Teleoperador[]> {
    return this.teleoperadorRepository.find();
  }

  // Método para obtener un teleoperador por su ID.
  async findOne(id: number): Promise<Teleoperador | null> {
    return this.teleoperadorRepository.findOne({ where: { id_trab: id } });
  }

  // Método para actualizar un teleoperador existente.
  async update(
    id: number,
    dto: UpdateTeleoperadorDTO,
  ): Promise<Teleoperador | null> {
    const teleoperador = await this.teleoperadorRepository.findOne({
      where: { id_trab: id },
    });
    if (!teleoperador) {
      return null;
    }

    if (dto.nombre !== undefined) teleoperador.nombre = dto.nombre;
    if (dto.apellidos !== undefined) teleoperador.apellidos = dto.apellidos;
    if (dto.correo !== undefined) teleoperador.correo = dto.correo;
    if (dto.contrasena !== undefined) teleoperador.contrasena = dto.contrasena;
    if (dto.nia !== undefined) teleoperador.nia = dto.nia;

    return this.teleoperadorRepository.save(teleoperador);
  }

  // Método para eliminar un teleoperador por su ID.
  async remove(id: number): Promise<boolean> {
    const result = await this.teleoperadorRepository.delete({ id_trab: id });
    const affected = result.affected ?? 0;
    return affected > 0;
  }
}
