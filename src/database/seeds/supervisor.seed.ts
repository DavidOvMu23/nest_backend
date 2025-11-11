// src/database/seeds/supervisor.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import supervisorData from '../../data/supervisor';
import { Supervisor } from '../../supervisor/supervisor.entity';
import { Trabajador } from '../../trabajador/trabajador.entity';

export class SupervisorSeeder implements Seeder {
    public async run(dataSource: DataSource) {

        const supervisorRepo = dataSource.getRepository(Supervisor);
        const trabajadorRepo = dataSource.getRepository(Trabajador);

        const supervisores = await Promise.all(
            supervisorData.map(async data => {
                const supervisor = new Supervisor();
                const trabajador = await trabajadorRepo.findOneBy({ correo: data.correo });

                if (!trabajador) {
                    console.error(`❌ Trabajador no encontrado para supervisor: ${data.correo}`);
                    return null;
                }

                supervisor.dni = data.dni;

                return supervisor;
            })
        );

        await supervisorRepo.save(supervisores.filter(s => s !== null));
        console.log('✅ Supervisores creados');
    }
}
