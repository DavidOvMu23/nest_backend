import { AppDataSource } from '../../../data-source';
import { Comunicacion } from '../../comunicacion/comunicacion.entity';
import { Grupo } from '../../grupo/grupo.entity';
import { Usuario } from '../../usuario/usuario.entity';

export async function seedComunicaciones() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Comunicacion);
    const grupoRepo = AppDataSource.getRepository(Grupo);
    const usuarioRepo = AppDataSource.getRepository(Usuario);

    const grupos = await grupoRepo.find();
    const usuarios = await usuarioRepo.find();

    const count = await repo.count();
    if (count === 0) {
        const getGrupo = (nombre: string) => grupos.find(g => g.nombre === nombre);
        const getUsuario = (dni: string) => usuarios.find(u => u.dni === dni);

        const comunicaciones = [
            { grupo: getGrupo('Atención Mañanas'), usuario: getUsuario('33333333C'), fecha: new Date('2025-01-15'), hora: '11:05', duracion: '20', resumen: 'Seguimiento semanal', observaciones: 'Conversación fluida. Anima a continuar paseos.', estado: 'completada' },
            { grupo: getGrupo('Atención Mañanas'), usuario: getUsuario('22222222B'), fecha: new Date('2025-01-14'), hora: '10:20', duracion: '12', resumen: 'Intento de llamada', observaciones: 'No respondió, se reintenta mañana.', estado: 'no_contesto' },
            { grupo: getGrupo('Atención Tardes'), usuario: getUsuario('33333333C'), fecha: new Date('2025-01-13'), hora: '18:10', duracion: '16', resumen: 'Recordatorio de cita médica', observaciones: 'Confirma asistencia al centro de salud.', estado: 'completada' },
            { grupo: getGrupo('Atención Tardes'), usuario: getUsuario('11111111A'), fecha: new Date(), hora: '16:30', duracion: '9', resumen: 'Consulta sobre medicación', observaciones: 'Aclara posología nocturna.', estado: 'completada' },
            { grupo: getGrupo('Atención Noches'), usuario: getUsuario('55555555E'), fecha: new Date('2025-10-19'), hora: '23:50', duracion: '10', resumen: 'Verificación nocturna', observaciones: 'Descanso adecuado, sin incidencias.', estado: 'completada' },
            { grupo: getGrupo('Seguimiento Crónicos'), usuario: getUsuario('77777777G'), fecha: new Date(), hora: '12:40', duracion: '22', resumen: 'Plan respiratorio revisado', observaciones: 'Se pauta control de inhalador.', estado: 'pendiente' },
        ];

        await repo.save(comunicaciones);
        console.log('Comunicaciones creadas');
    } else {
        console.log('Comunicaciones ya existen');
    }

    await AppDataSource.destroy();
}
