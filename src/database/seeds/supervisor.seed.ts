import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import supervisorData from '../../data/supervisor';
import { Supervisor } from '../../supervisor/supervisor.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';
import { find } from 'rxjs';


export class SupervisorSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const supervisorRepository = dataSource.getRepository(Supervisor);
        const trabajadorRepository = dataSource.getRepository(Trabajador);

        const supervisorEntries = await Promise.all(
            supervisorData.map(async (supervisor) => {
                trabajadorRepository.findOneBy({
                    tipo: TipoTrabajador.SUPERVISOR,
                });
                const supervisorEntry = new Supervisor();
                supervisorEntry.dni = supervisor.dni;
                return supervisorEntry;
            })
        );

        await supervisorRepository.save(supervisorEntries);
    }
}
