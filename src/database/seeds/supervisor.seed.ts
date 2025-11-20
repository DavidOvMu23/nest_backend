// src/database/seeds/supervisor.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import supervisorData from '../../data/supervisor';
import { Supervisor } from '../../supervisor/supervisor.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';

// Seed para la entidad Supervisor, lo que hace es poblar la tabla Supervisor con datos iniciales definidos en el archivo data/supervisor.ts
export class SupervisorSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const supervisorRepo = dataSource.getRepository(Supervisor);
    const trabajadorRepo = dataSource.getRepository(Trabajador);

    const supervisores = await Promise.all(
      supervisorData.map(async (data) => {
        const trabajador = await trabajadorRepo.findOneBy({
          correo: data.correo,
        });

        if (!trabajador) {
          console.error(
            `Trabajador no encontrado para supervisor: ${data.correo}`,
          );
          return null;
        }

        const supervisor = new Supervisor();
        supervisor.nombre = trabajador.nombre;
        supervisor.apellidos = trabajador.apellidos;
        supervisor.correo = trabajador.correo;
        supervisor.contrasena = trabajador.contrasena;
        supervisor.rol = TipoTrabajador.SUPERVISOR;
        supervisor.dni = data.dni;

        return supervisor;
      }),
    );

    const validSupervisores = supervisores.filter((s) => s !== null);
    if (validSupervisores.length > 0) {
      await supervisorRepo.save(validSupervisores);
    }
    console.log('✅ Supervisores creados');
  }
}
