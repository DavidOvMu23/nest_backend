import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUsuarioDTO, UpdateUsuarioDTO } from './usuario.dto';
import { EstadoCuenta, Usuario } from './usuario.entity';
import { ContactoEmergencia } from '../contacto_emergencia/contacto_emergencia.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(ContactoEmergencia)
    private readonly contactoRepository: Repository<ContactoEmergencia>,
  ) { }

  async create(dto: CreateUsuarioDTO): Promise<Usuario> {
    // Campos opcionales: si llegan vacíos, los guardamos como null
    const informacionLimpia = dto.informacion?.trim() || null;
    const datosMedicosLimpia = dto.datos_medicos_dolencias?.trim() || null;
    const medicacionLimpia = dto.medicacion?.trim() || null;
    const direccionLimpia = dto.direccion?.trim() || null;

    const existingUsuario = await this.usuarioRepository.findOne({
      where: { dni: dto.dni },
    });
    if (existingUsuario) {
      throw new ConflictException('El usuario con este DNI ya existe');
    }

    const usuario = this.usuarioRepository.create({
      nombre: dto.nombre,
      apellidos: dto.apellidos,
      dni: dto.dni,
      informacion: informacionLimpia,
      estado_cuenta: EstadoCuenta.ACTIVO,
      f_nac: new Date(dto.f_nac),
      nivel_dependencia: dto.nivel_dependencia,
      datos_medicos_dolencias: datosMedicosLimpia,
      medicacion: medicacionLimpia,
      telefono: dto.telefono,
      direccion: direccionLimpia,
      creado_desde_cliente: (dto as any).creado_desde_cliente ?? false,
    });

    const savedUsuario = await this.usuarioRepository.save(usuario);

    try {
      const existingContact = await this.contactoRepository.findOne({
        where: { usuarios: { dni: savedUsuario.dni } },
        relations: ['usuarios'],
      });

      if (!existingContact) {
        const contacto = this.contactoRepository.create({
          nombre: savedUsuario.nombre,
          apellidos: savedUsuario.apellidos,
          telefono: savedUsuario.telefono || '',
          // No referenciar al usuario para evitar que el contacto apunte a sí mismo
          usuarioReferenciado: null,
          creado_desde_usuario: true,
        } as any);
        await this.contactoRepository.save(contacto);
      }
    } catch (err) {
      // No queremos que la creación del usuario falle si por algún motivo
      // la creación del contacto falla. Loggear sería ideal; por ahora
      // dejamos que la creación del usuario proceda.
    }

    return savedUsuario;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      where: { estado_cuenta: EstadoCuenta.ACTIVO },
      relations: ['contactosEmergencia'],
    });
  }

  async findOne(dni: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { dni: dni } });
  }

  async update(dni: string, dto: UpdateUsuarioDTO): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { dni: dni },
    });
    if (!usuario) {
      return null;
    }
    // Si el usuario fue creado desde la app cliente, no permitimos editarlo
    if (usuario.creado_desde_cliente) {
      throw new BadRequestException(
        'Este usuario fue creado desde la app cliente. Edita sus datos desde allí.',
      );
    }
    const originalDni = usuario.dni;

    if (dto.nombre !== undefined) usuario.nombre = dto.nombre;
    if (dto.apellidos !== undefined) usuario.apellidos = dto.apellidos;
    if (dto.estado_cuenta !== undefined)
      usuario.estado_cuenta = dto.estado_cuenta;
    if (dto.informacion !== undefined) usuario.informacion = dto.informacion;
    if (dto.f_nac !== undefined) usuario.f_nac = new Date(dto.f_nac);
    if (dto.nivel_dependencia !== undefined)
      usuario.nivel_dependencia = dto.nivel_dependencia;
    if (dto.datos_medicos_dolencias !== undefined)
      usuario.datos_medicos_dolencias = dto.datos_medicos_dolencias;
    if (dto.medicacion !== undefined) usuario.medicacion = dto.medicacion;
    if (dto.telefono !== undefined) usuario.telefono = dto.telefono;
    if (dto.direccion !== undefined) usuario.direccion = dto.direccion;
    if (dto.dni !== undefined)
      usuario.dni = dto.dni ? dto.dni.toUpperCase() : usuario.dni;

    const saved = await this.usuarioRepository.save(usuario);

    // Propagar cambios al/los contactos de emergencia que referencian a este usuario
    try {
      const posiblesDnis = [originalDni];
      if (saved.dni && saved.dni !== originalDni) posiblesDnis.push(saved.dni);

      const contactos = await this.contactoRepository
        .createQueryBuilder('contacto')
        .leftJoinAndSelect('contacto.usuarioReferenciado', 'uRef')
        .leftJoinAndSelect('contacto.usuarios', 'u')
        .where('uRef.dni IN (:...dnis)', { dnis: posiblesDnis })
        .orWhere('u.dni IN (:...dnis)', { dnis: posiblesDnis })
        .getMany();

      for (const contacto of contactos) {
        contacto.nombre = saved.nombre;
        contacto.apellidos = saved.apellidos;
        contacto.telefono = saved.telefono || contacto.telefono;
        await this.contactoRepository.save(contacto);
      }
    } catch (err) {
      // No queremos que falle la actualización del usuario si la sincronización falla.
    }

    return saved;
  }

  async remove(dni: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({
      where: { dni: dni },
    });

    if (!usuario) {
      return false;
    }

    // Evitar suspensión/eliminación desde aquí si fue creado desde la app cliente
    if (usuario.creado_desde_cliente) {
      throw new BadRequestException(
        'Este usuario fue creado desde la app cliente. Elimínalo desde la app cliente.',
      );
    }

    usuario.estado_cuenta = EstadoCuenta.SUSPENDIDO;
    await this.usuarioRepository.save(usuario);
    return true;
  }
}
