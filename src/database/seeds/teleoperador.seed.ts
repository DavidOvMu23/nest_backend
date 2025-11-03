import { DataSource } from 'typeorm';
import teleoperadorData from 'src/data/teleoperador';
import { Seeder } from 'typeorm-extension';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';
import { Grupo } from '../../grupo/grupo.entity';
import { TipoTrabajador } from '../../trabajador/trabajador.entity';
import trabajadorData from '../../data/trabajador';

export class TeleoperadorSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const teleoperadorRepository = dataSource.getRepository(Teleoperador);
        const grupoRepository = dataSource.getRepository(Grupo);


        const teleoperadorEntries = await Promise.all(
            teleoperadorData.map(async (teleoperador) => {
                const trabajadorBase = trabajadorData.find((trabajador) => trabajador.correo === teleoperador.correo);
                if (!trabajadorBase) {
                    throw new Error(`Datos base de trabajador no encontrados para el correo ${teleoperador.correo}`);
                }
                if (trabajadorBase.rol !== TipoTrabajador.TELEOPERADOR) {
                    throw new Error(`El trabajador ${teleoperador.correo} no está marcado como teleoperador en los datos base`);
                }
                const grupo = await grupoRepository.findOneBy({ id_grup: teleoperador.grupo });
                if (!grupo) {
                    throw new Error(`Grupo no encontrado con id ${teleoperador.grupo}`);
                }

                const teleoperadorEntry = teleoperadorRepository.create({
                    nombre: trabajadorBase.nombre,
                    apellidos: trabajadorBase.apellidos,
                    correo: trabajadorBase.correo,
                    contrasena: trabajadorBase.contrasena,
                    rol: TipoTrabajador.TELEOPERADOR,
                    nia: teleoperador.nia,
                    grupo,
                });

                return teleoperadorEntry;
            })
        );

        await teleoperadorRepository.save(teleoperadorEntries);
    }
}
