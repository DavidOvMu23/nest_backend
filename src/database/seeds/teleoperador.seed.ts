import { DataSource } from 'typeorm';
import teleoperadorData from 'src/data/teleoperador';
import { Seeder } from 'typeorm-extension'
import { Teleoperador } from '../../teleoperador/teleoperador.entity';
import { Grupo } from '../../grupo/grupo.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';

export class TeleoperadorSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const teleoperadorRepository = dataSource.getRepository(Teleoperador);
        const grupoRepository = dataSource.getRepository(Grupo);
        const trabajadorRepository = dataSource.getRepository(Trabajador)


        const teleoperadorEntries = await Promise.all(
            teleoperadorData.map(async (teleoperador) => {
                const teleoperadorEntry = new Teleoperador();
                teleoperadorEntry.nia = teleoperador.nia;
                teleoperadorEntry.grupo = await grupoRepository.findOneByOrFail({ id_grup: teleoperador.grupo });
                return teleoperadorEntry;
            })
        )
    }
}
