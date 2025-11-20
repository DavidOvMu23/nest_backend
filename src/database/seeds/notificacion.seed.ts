import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import notificacionData from '../../data/notificacion';
import { Notificacion } from '../../notificacion/notificacion.entity';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';

// Seed para la entidad Notificacion, lo que hace es poblar la tabla Notificacion con datos iniciales definidos en el archivo data/notificacion.ts
export class NotificacionSeed implements Seeder {
  public async run(dataSource: DataSource) {
    const notificacionRepository = dataSource.getRepository(Notificacion);
    const teleoperadorRepository = dataSource.getRepository(Teleoperador);

    const notificacionEntries = await Promise.all(
      notificacionData.map(async (notificacion) => {
        const notificacionEntry = new Notificacion();
        notificacionEntry.contenido = notificacion.contenido;
        notificacionEntry.estado = notificacion.estado;
        /*Esto lo que hace es comprobar que el teleoperador exita para evitar errores, puesto que el findOneBy puede darte valor null si no lo encuentra entonces no se puede almacenar la notificacion puesto que si o si tiene que haber un teleoperador asociado, por es que se hace ese if y luego lanzo la excepcion en caso de que no se encuentre*/
        const tele = await teleoperadorRepository.findOneBy({
          correo: notificacion.teleoperador,
        }); //Aquí almaceno en una constante el valor que me va a dar el findOneBy.
        if (!tele) {
          // Aquí compruebo que dicha constante tenga valor es decir sea true, en caso de que no tenga algo entonces lanzará una excepción
          throw new Error(
            `Teleoperador no encontrado: ${notificacion.teleoperador}`,
          );
        }
        notificacionEntry.teleoperador = tele;
        return notificacionEntry;
      }),
    );
    await notificacionRepository.save(notificacionEntries);
  }
}
