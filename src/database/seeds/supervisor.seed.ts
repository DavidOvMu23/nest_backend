import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import supervisorData from '../../data/supervisor';
import trabajadorData from '../../data/trabajador';
import { Supervisor } from '../../supervisor/supervisor.entity';
import { TipoTrabajador } from '../../trabajador/trabajador.entity';


export class SupervisorSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const supervisorRepository = dataSource.getRepository(Supervisor);

        const supervisorEntries = await Promise.all(
            supervisorData.map(async (supervisor) => {
                const trabajadorBase = trabajadorData.find((trabajador) => trabajador.correo === supervisor.correo);
                if (!trabajadorBase) {
                    throw new Error(`Datos base de trabajador no encontrados para el correo ${supervisor.correo}`);
                }
                if (trabajadorBase.rol !== TipoTrabajador.SUPERVISOR) {
                    throw new Error(`El trabajador ${supervisor.correo} no está marcado como supervisor en los datos base`);
                }

                const supervisorEntry = supervisorRepository.create({
                    nombre: trabajadorBase.nombre,
                    apellidos: trabajadorBase.apellidos,
                    correo: trabajadorBase.correo,
                    contrasena: trabajadorBase.contrasena,
                    rol: TipoTrabajador.SUPERVISOR,
                    dni: supervisor.dni,
                });
                return supervisorEntry;
            })
        );

        await supervisorRepository.save(supervisorEntries);
    }
}
