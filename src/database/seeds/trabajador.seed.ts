import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import trabajadorData from '../../data/trabajador';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';

export class TrabajadorSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const trabajadorRepository = dataSource.getRepository(Trabajador);

        const trabajadorEntries = await Promise.all(
            trabajadorData.map(async (trabajador) => {
                const trabajadorEntry = new Trabajador();
                trabajadorEntry.nombre = trabajador.nombre;
                trabajadorEntry.apellidos = trabajador.apellidos;
                trabajadorEntry.correo = trabajador.correo;
                trabajadorEntry.contrasena = trabajador.contrasena;
                trabajadorEntry.tipo = trabajador.tipo;
                return trabajadorEntry;
            })
        );
        await trabajadorRepository.save(trabajadorEntries);
    }
}
