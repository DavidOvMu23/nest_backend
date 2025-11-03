import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import supervisorData from '../../data/supervisor';
import { Supervisor } from '../../supervisor/supervisor.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';


export class SupervisorSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const supervisorRepository = dataSource.getRepository(Supervisor);
        const trabajadorRepository = dataSource.getRepository(Trabajador);

        const supervisorEntries = await Promise.all(
            supervisorData.map(async (supervisor) => {
                const trabajadorBase = await trabajadorRepository.findOneBy({ correo: supervisor.correo });
                if (!trabajadorBase) {
                    throw new Error(`Trabajador no encontrado para el correo ${supervisor.correo}`);
                }
                if (trabajadorBase.tipo !== TipoTrabajador.SUPERVISOR) {
                    throw new Error(`El trabajador ${supervisor.correo} no es supervisor`);
                }

                const supervisorEntry = supervisorRepository.create({
                    ...trabajadorBase,
                    dni: supervisor.dni,
                    tipo: TipoTrabajador.SUPERVISOR,
                });
                return supervisorEntry;
            })
        );

        await supervisorRepository.save(supervisorEntries);
    }
}
