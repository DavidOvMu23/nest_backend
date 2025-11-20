// src/database/seeds/teleoperador.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import teleoperadorData from '../../data/teleoperador';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';
import { Grupo } from '../../grupo/grupo.entity';

// Seed para la entidad Teleoperador, lo que hace es poblar la tabla Teleoperador con datos iniciales definidos en el archivo data/teleoperador.ts
export class TeleoperadorSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const teleRepo = dataSource.getRepository(Teleoperador);
    const trabajadorRepo = dataSource.getRepository(Trabajador);
    const grupoRepo = dataSource.getRepository(Grupo);

    const teleoperadores = await Promise.all(
      teleoperadorData.map(async (data) => {
        const trabajador = await trabajadorRepo.findOneBy({
          correo: data.correo,
        });
        if (!trabajador) {
          console.error(
            `Trabajador no encontrado para teleoperador: ${data.correo}`,
          );
          return null;
        }

        const grupo = await grupoRepo.findOneBy({ id_grup: data.grupo });
        if (!grupo) {
          console.error(`Grupo no encontrado: ${data.grupo}`);
          return null;
        }

        const teleoperador = new Teleoperador();
        teleoperador.nombre = trabajador.nombre;
        teleoperador.apellidos = trabajador.apellidos;
        teleoperador.correo = trabajador.correo;
        teleoperador.contrasena = trabajador.contrasena;
        teleoperador.rol = TipoTrabajador.TELEOPERADOR;
        teleoperador.nia = data.nia;
        teleoperador.grupo = grupo;

        return teleoperador;
      }),
    );

    // Filtrar los teleoperadores válidos antes de guardarlos
    const validTeleoperadores = teleoperadores.filter((t) => t !== null);
    if (validTeleoperadores.length > 0) {
      await teleRepo.save(validTeleoperadores);
    }
    console.log('Teleoperadores creados');
  }
}
