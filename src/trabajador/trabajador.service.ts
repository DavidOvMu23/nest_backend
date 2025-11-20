import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTrabajadorDTO, UpdateTrabajadorDTO } from './trabajador.dto';
import { Trabajador, TipoTrabajador } from './trabajador.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';
import * as bcrypt from 'bcrypt';

// Servicio de Trabajador que maneja la lógica de negocio.
@Injectable()
export class TrabajadorService {
  constructor(
    @InjectRepository(Trabajador)
    private readonly trabajadorRepository: Repository<Trabajador>,
    @InjectRepository(Teleoperador)
    private readonly teleoperadorRepository: Repository<Teleoperador>,
    @InjectRepository(Supervisor)
    private readonly supervisorRepository: Repository<Supervisor>,
  ) {}

  // Método para crear un nuevo trabajador.
  async create(dto: CreateTrabajadorDTO): Promise<Trabajador> {
    const rol =
      typeof dto.rol === 'string'
        ? (dto.rol.toLowerCase() as TipoTrabajador)
        : dto.rol;

    const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

    // Validar rol
    if (!rol) {
      throw new BadRequestException(
        'Debe indicar un rol válido para el trabajador',
      );
    }

    if (rol === TipoTrabajador.TELEOPERADOR) {
      if (!dto.nia) {
        throw new BadRequestException(
          'El NIA es obligatorio para crear un teleoperador',
        );
      }

      // Crear teleoperador
      const teleoperador = this.teleoperadorRepository.create({
        nombre: dto.nombre,
        apellidos: dto.apellidos,
        correo: dto.correo,
        contrasena: hashedPassword,
        rol: TipoTrabajador.TELEOPERADOR,
        nia: dto.nia,
      });

      return this.teleoperadorRepository.save(teleoperador);
    }

    // Crear supervisor
    if (rol === TipoTrabajador.SUPERVISOR) {
      if (!dto.dni) {
        throw new BadRequestException(
          'El DNI es obligatorio para crear un supervisor',
        );
      }

      // Crear supervisor
      const supervisor = this.supervisorRepository.create({
        nombre: dto.nombre,
        apellidos: dto.apellidos,
        correo: dto.correo,
        contrasena: hashedPassword,
        rol: TipoTrabajador.SUPERVISOR,
        dni: typeof dto.dni === 'string' ? dto.dni.toUpperCase() : dto.dni,
      });

      // Guardar supervisor
      return this.supervisorRepository.save(supervisor);
    }

    // Crear trabajador genérico
    const trabajador = this.trabajadorRepository.create({
      nombre: dto.nombre,
      apellidos: dto.apellidos,
      correo: dto.correo,
      contrasena: hashedPassword,
      rol,
    });
    return this.trabajadorRepository.save(trabajador);
  }

  // Método para obtener todos los trabajadores.
  async findAll(): Promise<Trabajador[]> {
    const trabajadores = await this.trabajadorRepository.find();
    return this.mergeTeleoperadoresConGrupo(trabajadores);
  }

  // Método para obtener un trabajador por su ID.
  async findOne(id: number): Promise<Trabajador | null> {
    const trabajador = await this.trabajadorRepository.findOne({
      where: {
        id_trab: id,
      },
    });
    return this.cargarGrupoSiTeleoperador(trabajador);
  }

  // Método para actualizar un trabajador existente.
  async update(
    id: number,
    dto: UpdateTrabajadorDTO,
  ): Promise<Trabajador | null> {
    const trabajador = await this.trabajadorRepository.findOne({
      where: {
        id_trab: id,
      },
    });

    // Verificar si el trabajador existe
    if (!trabajador) {
      return null;
    }

    // Procesar actualización del rol
    const rolUpdate =
      dto.rol === undefined
        ? undefined
        : typeof dto.rol === 'string'
          ? (dto.rol.toLowerCase() as TipoTrabajador)
          : dto.rol;

    // Validar que el rol no cambie
    if (rolUpdate !== undefined && rolUpdate !== trabajador.rol) {
      throw new BadRequestException(
        'El rol de un trabajador no se puede cambiar desde este endpoint',
      );
    }

    // Actualizar campos básicos si están definidos
    if (dto.nombre !== undefined) trabajador.nombre = dto.nombre;
    if (dto.apellidos !== undefined) trabajador.apellidos = dto.apellidos;
    if (dto.correo !== undefined) trabajador.correo = dto.correo;
    if (dto.contrasena !== undefined) trabajador.contrasena = dto.contrasena;

    // Actualizar campos específicos si están definidos
    if (trabajador instanceof Teleoperador) {
      if (dto.nia !== undefined) {
        trabajador.nia = dto.nia;
      }
      await this.teleoperadorRepository.save(trabajador);
      return this.cargarGrupoSiTeleoperador(trabajador);
    }

    // Actualizar campos específicos si están definidos
    if (trabajador instanceof Supervisor) {
      if (dto.dni !== undefined) {
        trabajador.dni =
          typeof dto.dni === 'string' ? dto.dni.toUpperCase() : dto.dni;
      }
      return this.supervisorRepository.save(trabajador);
    }

    return this.trabajadorRepository.save(trabajador);
  }

  // Método para eliminar un trabajador por su ID.
  async remove(id: number): Promise<boolean> {
    const result = await this.trabajadorRepository.delete({
      id_trab: id,
    });
    const affected = result.affected ?? 0;
    return affected > 0;
  }

  // Método para encontrar un trabajador por su correo electrónico.
  async findByEmail(correo: string) {
    const trabajador = await this.trabajadorRepository.findOne({
      where: { correo },
    });
    return this.cargarGrupoSiTeleoperador(trabajador);
  }

  // Método privado para fusionar teleoperadores con su grupo correspondiente.
  private async mergeTeleoperadoresConGrupo(
    trabajadores: Trabajador[],
  ): Promise<Trabajador[]> {
    const teleIds = trabajadores
      .filter((trabajador) => trabajador.rol === TipoTrabajador.TELEOPERADOR)
      .map((trabajador) => trabajador.id_trab);

    if (teleIds.length === 0) {
      return trabajadores;
    }

    const teleoperadores = await this.teleoperadorRepository.find({
      where: { id_trab: In(teleIds) },
      relations: {
        grupo: true,
      },
    });

    const teleoperadorMap = new Map<number, Teleoperador>();
    teleoperadores.forEach((teleoperador) => {
      teleoperadorMap.set(teleoperador.id_trab, teleoperador);
    });

    return trabajadores.map(
      (trabajador) => teleoperadorMap.get(trabajador.id_trab) ?? trabajador,
    );
  }

  // Método privado para cargar el grupo si el trabajador es un teleoperador.
  private async cargarGrupoSiTeleoperador(
    trabajador: Trabajador | null,
  ): Promise<Trabajador | null> {
    if (!trabajador || trabajador.rol !== TipoTrabajador.TELEOPERADOR) {
      return trabajador;
    }

    return this.teleoperadorRepository.findOne({
      where: { id_trab: trabajador.id_trab },
      relations: {
        grupo: true,
      },
    });
  }
}
