import { DataSource } from 'typeorm';
import teleoperadorData from 'src/data/teleoperador';
import { Seeder } from 'typeorm-extension';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';
import { Grupo } from '../../grupo/grupo.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';

export class TeleoperadorSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const teleoperadorRepository = dataSource.getRepository(Teleoperador);
        const grupoRepository = dataSource.getRepository(Grupo);
        const trabajadorRepository = dataSource.getRepository(Trabajador);


        const teleoperadorEntries = await Promise.all(
            teleoperadorData.map(async (teleoperador) => {
                const trabajadorBase = await trabajadorRepository.findOneBy({ correo: teleoperador.correo });
                if (!trabajadorBase) {
                    throw new Error(`Trabajador no encontrado para el correo ${teleoperador.correo}`);
                }
                if (trabajadorBase.tipo !== TipoTrabajador.TELEOPERADOR) {
                    throw new Error(`El trabajador ${teleoperador.correo} no es teleoperador`);
                }

                const grupo = await grupoRepository.findOneBy({ id_grup: teleoperador.grupo });
                if (!grupo) {
                    throw new Error(`Grupo no encontrado con id ${teleoperador.grupo}`);
                }

                const teleoperadorEntry = teleoperadorRepository.create({
                    ...trabajadorBase,
                    nia: teleoperador.nia,
                    grupo,
                    tipo: TipoTrabajador.TELEOPERADOR,
                });

                return teleoperadorEntry;
            })
        );

        await teleoperadorRepository.save(teleoperadorEntries);
    }
}
