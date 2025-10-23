import { DataSource } from 'typeorm';
import { Comunicacion } from '../../comunicacion/comunicacion.entity';
import comunicacionData from '../../data/comunicacion';
import { Grupo } from '../../grupo/grupo.entity';
import { Usuario } from '../../usuario/usuario.entity';
import { Seeder } from 'typeorm-extension';

export class ComunicacionSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const comunicacionRepository = dataSource.getRepository(Comunicacion);
        const grupoRepository = dataSource.getRepository(Grupo);
        const usuarioRepository = dataSource.getRepository(Usuario);



        const comunicacionEntries = await Promise.all(
            comunicacionData.map(async (comunicacion) => {
                const comunicacionEntry = new Comunicacion();
                comunicacionEntry.fecha = comunicacion.fecha;
                comunicacionEntry.hora = comunicacion.hora;
                comunicacionEntry.duracion = comunicacion.duracion;
                comunicacionEntry.resumen = comunicacion.resumen;
                comunicacionEntry.observaciones = comunicacion.observaciones;
                comunicacionEntry.estado = comunicacion.estado;
                comunicacionEntry.grupo = (await grupoRepository.findOneBy({ id_grup: comunicacion.grupo }))!;
                comunicacionEntry.usuario = (await usuarioRepository.findOneBy({ dni: comunicacion.usuario }))!;
                return comunicacionEntry;
            })
        );
        await comunicacionRepository.save(comunicacionEntries);
    }
}