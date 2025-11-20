import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateContactoEmergenciaDTO,
  UpdateContactoEmergenciaDTO,
} from './contacto_emergencia.dto';
import { ContactoEmergencia } from './contacto_emergencia.entity';

// Servicio para gestionar contactos de emergencia
@Injectable()
export class ContactoEmergenciaService {
  constructor(
    @InjectRepository(ContactoEmergencia)
    private readonly contacto_emergenciaRepository: Repository<ContactoEmergencia>,
  ) {}

  // Crear un nuevo contacto de emergencia
  async create(dto: CreateContactoEmergenciaDTO): Promise<ContactoEmergencia> {
    const contacto_emergencia = this.contacto_emergenciaRepository.create({
      nombre: dto.nombre,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      relacion: dto.relacion,
    });

    return this.contacto_emergenciaRepository.save(contacto_emergencia);
  }

  // Obtener todos los contactos de emergencia
  async findAll(): Promise<ContactoEmergencia[]> {
    return this.contacto_emergenciaRepository.find();
  }

  // Obtener contactos de emergencia por DNI de usuario
  async findByUsuarioDni(dni: string): Promise<ContactoEmergencia[]> {
    return this.contacto_emergenciaRepository.find({
      where: { usuarioReferenciado: { dni } },
    });
  }

  // Obtener un contacto de emergencia por su ID
  async findOne(id: number): Promise<ContactoEmergencia | null> {
    return this.contacto_emergenciaRepository.findOne({
      where: { id_cont: id },
    });
  }

  // Actualizar un contacto de emergencia existente
  async update(
    id: number,
    dto: UpdateContactoEmergenciaDTO,
  ): Promise<ContactoEmergencia | null> {
    const contacto_emergencia =
      await this.contacto_emergenciaRepository.findOne({
        where: { id_cont: id },
      });
    if (!contacto_emergencia) {
      return null;
    }

    if (dto.nombre !== undefined) contacto_emergencia.nombre = dto.nombre;
    if (dto.apellidos !== undefined)
      contacto_emergencia.apellidos = dto.apellidos;
    if (dto.telefono !== undefined) contacto_emergencia.telefono = dto.telefono;
    if (dto.relacion !== undefined) contacto_emergencia.relacion = dto.relacion;

    return this.contacto_emergenciaRepository.save(contacto_emergencia);
  }

  // Eliminar un contacto de emergencia por su ID
  async remove(id: number): Promise<boolean> {
    const result = await this.contacto_emergenciaRepository.delete({
      id_cont: id,
    });
    const affected = result.affected ?? 0;
    return affected > 0;
  }
}
