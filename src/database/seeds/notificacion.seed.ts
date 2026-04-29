import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import notificacionData from '../../data/notificacion';
import { Notificacion, EstadoNotificacion, TipoNotificacion } from '../../notificacion/notificacion.entity';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';

export class NotificacionSeed implements Seeder {
  public async run(dataSource: DataSource) {
    const notificacionRepository = dataSource.getRepository(Notificacion);
    const teleoperadorRepository = dataSource.getRepository(Teleoperador);

    const notificacionEntries = await Promise.all(
      notificacionData.map(async (notificacion) => {
        const notificacionEntry = new Notificacion();
        notificacionEntry.contenido = notificacion.contenido;
        notificacionEntry.estado = notificacion.estado as EstadoNotificacion;
        notificacionEntry.tipo = notificacion.tipo as TipoNotificacion || TipoNotificacion.OTRO;

        const tele = await teleoperadorRepository.findOneBy({
          correo: notificacion.teleoperador,
        });

        if (!tele) {
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
