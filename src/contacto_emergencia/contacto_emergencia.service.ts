import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import {
  CreateContactoEmergenciaDTO,
  UpdateContactoEmergenciaDTO,
} from './contacto_emergencia.dto';
import { ContactoEmergencia } from './contacto_emergencia.entity';
import { Usuario } from '../usuario/usuario.entity';

// Servicio para gestionar contactos de emergencia
@Injectable()
export class ContactoEmergenciaService {
  constructor(
    @InjectRepository(ContactoEmergencia)
    private readonly contacto_emergenciaRepository: Repository<ContactoEmergencia>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  // Crear un nuevo contacto de emergencia
  async create(dto: CreateContactoEmergenciaDTO): Promise<ContactoEmergencia> {
    let usuarioReferenciado: Usuario | null = null;
    if (dto.dniUsuarioRef) {
      usuarioReferenciado = await this.usuarioRepository.findOne({
        where: { dni: dto.dniUsuarioRef.toUpperCase() },
      });
      if (!usuarioReferenciado) {
        throw new BadRequestException(
          `No existe usuario con DNI ${dto.dniUsuarioRef}`,
        );
      }
    }

    const contacto_emergencia = this.contacto_emergenciaRepository.create({
      nombre: dto.nombre,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      relacion: dto.relacion,
      usuarioReferenciado,
    });

    const saved = await this.contacto_emergenciaRepository.save(
      contacto_emergencia,
    );

    await this.sincronizarUsuarioContacto(
      saved.id_cont,
      usuarioReferenciado?.dni ?? null,
    );

    return this.contacto_emergenciaRepository.findOne({
      where: { id_cont: saved.id_cont },
      relations: { usuarioReferenciado: true },
    }) as Promise<ContactoEmergencia>;
  }

  // Obtener todos los contactos de emergencia
  async findAll(): Promise<ContactoEmergencia[]> {
    return this.contacto_emergenciaRepository.find({
      relations: { usuarioReferenciado: true },
    });
  }

  // Obtener contactos de emergencia por DNI de usuario
  async findByUsuarioDni(dni: string): Promise<ContactoEmergencia[]> {
    return this.contacto_emergenciaRepository.find({
      where: { usuarioReferenciado: { dni } },
      relations: { usuarioReferenciado: true },
    });
  }

  // Obtener un contacto de emergencia por su ID
  async findOne(id: number): Promise<ContactoEmergencia | null> {
    return this.contacto_emergenciaRepository.findOne({
      where: { id_cont: id },
      relations: { usuarioReferenciado: true },
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

    if (dto.dniUsuarioRef !== undefined) {
      if (dto.dniUsuarioRef.trim() === '') {
        contacto_emergencia.usuarioReferenciado = null;
      } else {
        const usuarioReferenciado = await this.usuarioRepository.findOne({
          where: { dni: dto.dniUsuarioRef.toUpperCase() },
        });

        if (!usuarioReferenciado) {
          throw new BadRequestException(
            `No existe usuario con DNI ${dto.dniUsuarioRef}`,
          );
        }

        contacto_emergencia.usuarioReferenciado = usuarioReferenciado;
      }
    }

    const saved = await this.contacto_emergenciaRepository.save(
      contacto_emergencia,
    );

    await this.sincronizarUsuarioContacto(
      saved.id_cont,
      contacto_emergencia.usuarioReferenciado?.dni ?? null,
    );

    return this.contacto_emergenciaRepository.findOne({
      where: { id_cont: saved.id_cont },
      relations: { usuarioReferenciado: true },
    });
  }

  // Eliminar un contacto de emergencia por su ID
  async remove(id: number): Promise<boolean> {
    const result = await this.contacto_emergenciaRepository.delete({
      id_cont: id,
    });
    const affected = result.affected ?? 0;
    return affected > 0;
  }

  private async sincronizarUsuarioContacto(
    contactoId: number,
    dniUsuarioObjetivo: string | null,
  ): Promise<void> {
    const contacto = await this.contacto_emergenciaRepository.findOne({
      where: { id_cont: contactoId },
    });

    if (!contacto) {
      return;
    }

    // Quitar el contacto de cualquier usuario previamente vinculado
    const usuariosConContacto = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.contactosEmergencia', 'contacto')
      .where('contacto.id_cont = :contactoId', { contactoId })
      .getMany();

    for (const usuario of usuariosConContacto) {
      usuario.contactosEmergencia = usuario.contactosEmergencia
        .filter((c) => c.id_cont !== contactoId);
      await this.usuarioRepository.save(usuario);
    }

    // Añadir el contacto al usuario objetivo (si existe)
    if (dniUsuarioObjetivo != null && dniUsuarioObjetivo.trim() !== '') {
      const usuarioObjetivo = await this.usuarioRepository.findOne({
        where: { dni: dniUsuarioObjetivo.toUpperCase() },
        relations: ['contactosEmergencia'],
      });

      if (usuarioObjetivo !== null) {
        const yaExiste = usuarioObjetivo.contactosEmergencia.some(
          (c) => c.id_cont === contactoId,
        );
        if (!yaExiste) {
          usuarioObjetivo.contactosEmergencia = [
            ...usuarioObjetivo.contactosEmergencia,
            contacto,
          ];
          await this.usuarioRepository.save(usuarioObjetivo);
        }
      }
    }
  }
}
