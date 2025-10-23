import { Grupo } from '../../grupo/grupo.entity';
import grupoData from '../../data/grupo';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class GrupoSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const grupoRepository = dataSource.getRepository(Grupo);



        const grupoEntries = await Promise.all(
            grupoData.map(async (grupo) => {
                const grupoEntry = new Grupo();
                grupoEntry.nombre = grupo.nombre;
                grupoEntry.descripcion = grupo.descripcion;
                grupoEntry.activo = grupo.activo;
                return grupoEntry;
            })
        );
        await grupoRepository.save(grupoEntries);
    }
}