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
  ) {}

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
      usuarioReferenciado,
    } as any);

    const savedRaw =
      await this.contacto_emergenciaRepository.save(contacto_emergencia);
    const saved = Array.isArray(savedRaw)
      ? savedRaw[0]
      : (savedRaw as ContactoEmergencia);

    // sincronizar asociaciones many-to-many usando lista de DNIs si se proporcionó
    const usuariosDnis = (
      dto.usuariosDnis ??
      (usuarioReferenciado ? [usuarioReferenciado.dni] : [])
    ).filter((d) => d.toUpperCase() !== (dto.dniUsuarioRef ?? '').toUpperCase());
    await this.sincronizarUsuarioContactoBulk(saved.id_cont, usuariosDnis);

    return this.contacto_emergenciaRepository.findOne({
      where: { id_cont: saved.id_cont },
      relations: { usuarioReferenciado: true, usuarios: true },
    }) as Promise<ContactoEmergencia>;
  }

  // Obtener todos los contactos de emergencia
  async findAll(): Promise<ContactoEmergencia[]> {
    return this.contacto_emergenciaRepository.find({
      relations: { usuarioReferenciado: true, usuarios: true },
    });
  }

  // Obtener contactos de emergencia por DNI de usuario
  async findByUsuarioDni(dni: string): Promise<ContactoEmergencia[]> {
    return this.contacto_emergenciaRepository.find({
      where: { usuarios: { dni } },
      relations: { usuarioReferenciado: true, usuarios: true },
    });
  }

  // Obtener un contacto de emergencia por su ID
  async findOne(id: number): Promise<ContactoEmergencia | null> {
    return this.contacto_emergenciaRepository.findOne({
      where: { id_cont: id },
      relations: { usuarioReferenciado: true, usuarios: true },
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
        relations: { usuarioReferenciado: true },
      });
    if (!contacto_emergencia) {
      return null;
    }

    // Si es un contacto de sistema (vinculado a un usuario o creado automáticamente),
    // solo permitimos actualizar las asociaciones (usuariosDnis).
    if (contacto_emergencia.usuarioReferenciado || contacto_emergencia.creado_desde_usuario) {
      if (
        dto.nombre !== undefined ||
        dto.apellidos !== undefined ||
        dto.telefono !== undefined ||
        dto.dniUsuarioRef !== undefined
      ) {
        throw new BadRequestException(
          'Este contacto está vinculado a un usuario del sistema. Solo puedes modificar los usuarios asignados.',
        );
      }
    } else {
      if (dto.nombre !== undefined) contacto_emergencia.nombre = dto.nombre;
      if (dto.apellidos !== undefined)
        contacto_emergencia.apellidos = dto.apellidos;
      if (dto.telefono !== undefined)
        contacto_emergencia.telefono = dto.telefono;

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
    }

    const savedRaw =
      await this.contacto_emergenciaRepository.save(contacto_emergencia);
    const saved = Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;

    // Si se proporcionó lista de DNIs, sincronizamos asociaciones many-to-many
    if (dto.usuariosDnis !== undefined) {
      const selfDni = (contacto_emergencia.usuarioReferenciado?.dni ?? '').toUpperCase();
      const dnisSinSiMismo = (dto.usuariosDnis ?? []).filter(
        (d) => d.toUpperCase() !== selfDni,
      );
      await this.sincronizarUsuarioContactoBulk(saved.id_cont, dnisSinSiMismo);
    } else {
      // mantener comportamiento previo: sincronizar con usuarioReferenciado
      await this.sincronizarUsuarioContacto(
        saved.id_cont,
        contacto_emergencia.usuarioReferenciado?.dni ?? null,
      );
    }
    return this.contacto_emergenciaRepository.findOne({
      where: { id_cont: saved.id_cont },
      relations: { usuarioReferenciado: true, usuarios: true },
    });
  }

  // Eliminar un contacto de emergencia por su ID
  async remove(id: number): Promise<boolean> {
    // Cargamos relaciones para saber si el contacto está asociado a usuarios
    const contacto = await this.contacto_emergenciaRepository.findOne({
      where: { id_cont: id },
      relations: { usuarioReferenciado: true, usuarios: true },
    });

    if (!contacto) return false;

    // Si el contacto fue generado automáticamente al crear un usuario, no se
    // permite eliminarlo desde aquí (solo desde el perfil del cliente o
    // tras desvincularlo desde el cliente).
    if (contacto.creado_desde_usuario) {
      throw new BadRequestException(
        'No se puede eliminar este contacto: fue generado automáticamente al crear un usuario. Elimínalo o desvincúlalo desde el perfil del cliente.',
      );
    }

    // Si está vinculado a un usuario (como referencia directa) o está en la lista
    // many-to-many de usuarios, impedimos la eliminación directa.
    if (
      contacto.usuarioReferenciado ||
      (contacto.usuarios && contacto.usuarios.length > 0)
    ) {
      throw new BadRequestException(
        'Este contacto está asociado a uno o varios usuarios. Primero desvincula las asociaciones o elimina la referencia desde el perfil del cliente.',
      );
    }

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
      usuario.contactosEmergencia = usuario.contactosEmergencia.filter(
        (c) => c.id_cont !== contactoId,
      );
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

  // Nueva función: sincroniza asociaciones many-to-many usando lista de DNIs.
  private async sincronizarUsuarioContactoBulk(
    contactoId: number,
    usuariosDnis: string[] = [],
  ): Promise<void> {
    const contacto = await this.contacto_emergenciaRepository.findOne({
      where: { id_cont: contactoId },
    });

    if (!contacto) return;

    const normalized = usuariosDnis
      .filter((d) => typeof d === 'string' && d.trim() !== '')
      .map((d) => d.toUpperCase());

    // Obtener usuarios que actualmente tienen este contacto
    const usuariosConContacto = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.contactosEmergencia', 'contacto')
      .where('contacto.id_cont = :contactoId', { contactoId })
      .getMany();

    // Quitar el contacto de usuarios que ya no están en la lista
    for (const usuario of usuariosConContacto) {
      if (!normalized.includes(usuario.dni.toUpperCase())) {
        usuario.contactosEmergencia = usuario.contactosEmergencia.filter(
          (c) => c.id_cont !== contactoId,
        );
        await this.usuarioRepository.save(usuario);
      }
    }

    // Añadir el contacto a los usuarios listados
    for (const dni of normalized) {
      const usuario = await this.usuarioRepository.findOne({
        where: { dni: dni },
        relations: ['contactosEmergencia'],
      });
      if (!usuario) continue; // ignorar DNIs inválidos

      const yaExiste = usuario.contactosEmergencia.some(
        (c) => c.id_cont === contactoId,
      );
      if (!yaExiste) {
        usuario.contactosEmergencia = [
          ...usuario.contactosEmergencia,
          contacto,
        ];
        await this.usuarioRepository.save(usuario);
      }
    }
  }
}
