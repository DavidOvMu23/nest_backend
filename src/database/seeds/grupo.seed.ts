import { Grupo } from '../../grupo/grupo.entity';
import grupoData from '../../data/grupo';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

// Seed para la entidad Grupo, lo que hace es poblar la tabla Grupo con datos iniciales definidos en el archivo data/grupo.ts
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
      }),
    );
    await grupoRepository.save(grupoEntries);
  }
}
