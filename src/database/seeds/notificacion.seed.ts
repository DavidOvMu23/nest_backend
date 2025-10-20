import { AppDataSource } from '../../../data-source';
import { Notificacion } from '../../notificacion/notificacion.entity';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';

export async function seedNotificaciones() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Notificacion);
    const telRepo = AppDataSource.getRepository(Teleoperador);

    const teleops = await telRepo.find();
    const count = await repo.count();

    if (count === 0 && teleops.length) {
        const map = (correo: string) => teleops.find(t => t.correo === correo);

        const notificaciones = [
            { teleoperador: map('laura.gomez@cuidem.local'), contenido: 'Tienes 3 llamadas programadas para hoy a partir de las 10:00.', estado: 'sin_leer' },
            { teleoperador: map('laura.gomez@cuidem.local'), contenido: 'La incidencia de centralita quedó resuelta.', estado: 'leida' },
            { teleoperador: map('carlos.navas@cuidem.local'), contenido: 'Recuerda registrar la comunicación con José Martínez.', estado: 'sin_leer' },
            { teleoperador: map('noa.benitez@cuidem.local'), contenido: 'Nueva pauta de comunicación empática — viernes 12:00.', estado: 'leida' },
            { teleoperador: map('pablo.rey@cuidem.local'), contenido: 'Caso escalado a psicología comunitaria.', estado: 'archivada' },
            { teleoperador: map('ines.campos@cuidem.local'), contenido: 'Se cancela la formación de esta tarde.', estado: 'cancelada' },
            { teleoperador: map('hugo.santos@cuidem.local'), contenido: 'Actualiza el resumen de la llamada de Eduardo.', estado: 'sin_leer' },
        ];

        await repo.save(notificaciones);
        console.log('Notificaciones creadas');
    } else {
        console.log('Notificaciones ya existen o faltan teleoperadores');
    }

    await AppDataSource.destroy();
}
