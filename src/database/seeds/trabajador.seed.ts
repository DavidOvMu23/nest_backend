// src/database/seeds/trabajador.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import trabajadorData from '../../data/trabajador';
import supervisorData from '../../data/supervisor';
import teleoperadorData from '../../data/teleoperador';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';
import { Supervisor } from '../../supervisor/supervisor.entity';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';
import { Grupo } from '../../grupo/grupo.entity';
import * as bcrypt from 'bcrypt';

export class TrabajadorSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const trabajadorRepo = dataSource.getRepository(Trabajador);
    const supervisorRepo = dataSource.getRepository(Supervisor);
    const teleoperadorRepo = dataSource.getRepository(Teleoperador);
    const grupoRepo = dataSource.getRepository(Grupo);

    // Crear trabajadores base
    const trabajadores = await Promise.all(
      trabajadorData.map(async (data) => {
        if (data.rol === TipoTrabajador.SUPERVISOR) {
          const supervisor = new Supervisor();
          supervisor.nombre = data.nombre;
          supervisor.apellidos = data.apellidos;
          supervisor.correo = data.correo;
          supervisor.contrasena = await bcrypt.hash(data.contrasena, 10);
          supervisor.rol = data.rol;

          // Buscar el DNI para este supervisor
          const supervisorInfo = supervisorData.find(
            (s) => s.correo === data.correo,
          );
          if (supervisorInfo) {
            supervisor.dni = supervisorInfo.dni;
          }

          return supervisor;
        } else if (data.rol === TipoTrabajador.TELEOPERADOR) {
          const teleoperador = new Teleoperador();
          teleoperador.nombre = data.nombre;
          teleoperador.apellidos = data.apellidos;
          teleoperador.correo = data.correo;
          teleoperador.contrasena = await bcrypt.hash(data.contrasena, 10);
          teleoperador.rol = data.rol;

          // Buscar el NIA y grupo para este teleoperador
          const teleoperadorInfo = teleoperadorData.find(
            (t) => t.correo === data.correo,
          );
          if (teleoperadorInfo) {
            teleoperador.nia = teleoperadorInfo.nia;
            const grupo = await grupoRepo.findOneBy({
              id_grup: teleoperadorInfo.grupo,
            });
            if (grupo) {
              teleoperador.grupo = grupo;
            }
          }

          return teleoperador;
        }

        // Trabajador genérico (aunque no debería llegar aquí)
        const trabajador = new Trabajador();
        trabajador.nombre = data.nombre;
        trabajador.apellidos = data.apellidos;
        trabajador.correo = data.correo;
        trabajador.contrasena = await bcrypt.hash(data.contrasena, 10);
        trabajador.rol = data.rol;
        return trabajador;
      }),
    );

    // Separar supervisores y teleoperadores
    const supervisores = trabajadores.filter((t) => t instanceof Supervisor);
    const teleoperadores = trabajadores.filter(
      (t) => t instanceof Teleoperador,
    );

    // Guardar supervisores
    if (supervisores.length > 0) {
      await supervisorRepo.save(supervisores);
    }

    // Guardar teleoperadores
    if (teleoperadores.length > 0) {
      await teleoperadorRepo.save(teleoperadores);
    }

    console.log('✅ Trabajadores creados');
  }
}
