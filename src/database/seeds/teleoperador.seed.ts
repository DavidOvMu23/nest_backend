// src/database/seeds/teleoperador.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import teleoperadorData from '../../data/teleoperador';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';
import { Trabajador } from '../../trabajador/trabajador.entity';
import { Grupo } from '../../grupo/grupo.entity';

export class TeleoperadorSeeder implements Seeder {
    public async run(dataSource: DataSource) {

        const teleRepo = dataSource.getRepository(Teleoperador);
        const trabajadorRepo = dataSource.getRepository(Trabajador);
        const grupoRepo = dataSource.getRepository(Grupo);

        const teleoperadores = await Promise.all(
            teleoperadorData.map(async data => {
                const teleoperador = new Teleoperador();

                const trabajador = await trabajadorRepo.findOneBy({ correo: data.correo });
                if (!trabajador) {
                    console.error(`❌ Trabajador no encontrado para teleoperador: ${data.correo}`);
                    return null;
                }

                const grupo = await grupoRepo.findOneBy({ id_grup: data.grupo });
                if (!grupo) {
                    console.error(`❌ Grupo no encontrado: ${data.grupo}`);
                    return null;
                }

                teleoperador.nia = data.nia;
                teleoperador.grupo = grupo;

                return teleoperador;
            })
        );

        await teleRepo.save(teleoperadores.filter(t => t !== null));
        console.log('✅ Teleoperadores creados');
    }
}
