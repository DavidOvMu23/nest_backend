import { AppDataSource } from '../../data-source';

// Seeds base
import { seedGrupos } from './seeds/grupo.seed';
import { seedTrabajadores } from './seeds/trabajador.seed';
import { seedSupervisores } from './seeds/supervisor.seed';
import { seedTeleoperadores } from './seeds/teleoperador.seed';
import { seedUsuarios } from './seeds/usuario.seed';
import { seedContactosEmergencia } from './seeds/contacto_emergencia.seed';
import { seedUsuarioContacto } from './seeds/usuario_contacto.seed';
import { seedComunicaciones } from './seeds/comunicacion.seed';
import { seedNotificaciones } from './seeds/notificacion.seed';

async function runSeeds() {
    try {
        console.log('Iniciando carga de datos iniciales...');

        await seedGrupos();
        await seedTrabajadores();
        await seedSupervisores();
        await seedTeleoperadores();
        await seedUsuarios();
        await seedContactosEmergencia();
        await seedUsuarioContacto();
        await seedComunicaciones();
        await seedNotificaciones();

        console.log('Carga de datos completada correctamente.');
    } catch (error) {
        console.error('Error ejecutando seeds:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

runSeeds();
