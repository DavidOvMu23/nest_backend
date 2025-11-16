import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDTO, UpdateUsuarioDTO } from './usuario.dto';
import { EstadoCuenta, Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDTO): Promise<Usuario> {
    // Dirección opcional: si llega vacía, la guardamos como null.
    const direccionLimpia = dto.direccion?.trim() || null;
    const usuario = this.usuarioRepository.create({
      nombre: dto.nombre,
      apellidos: dto.apellidos,
      dni: dto.dni,
      informacion: dto.informacion,
      estado_cuenta: EstadoCuenta.ACTIVO,
      f_nac: new Date(dto.f_nac),
      nivel_dependencia: dto.nivel_dependencia,
      datos_medicos_dolencias: dto.datos_medicos_dolencias,
      medicacion: dto.medicacion,
      telefono: dto.telefono,
      direccion: direccionLimpia,
    });

    return this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
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

    return this.usuarioRepository.save(usuario);
  }

  async remove(dni: string): Promise<boolean> {
    const result = await this.usuarioRepository.delete({ dni: dni });
    const affected = result.affected ?? 0;
    return affected > 0;
  }
}
