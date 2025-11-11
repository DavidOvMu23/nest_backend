import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeder, runSeeders, Seeder, SeederOptions } from "typeorm-extension";
//Comunicación
import { Comunicacion } from "./comunicacion/comunicacion.entity";
import { ComunicacionSeed } from "./database/seeds/comunicacion.seed";
//Contacto de emergencia
import { ContactoEmergencia } from "./contacto_emergencia/contacto_emergencia.entity";
import { ContactoEmergenciaSeeder } from "./database/seeds/contacto_emergencia.seed";
//Grupo
import { Grupo } from "./grupo/grupo.entity";
import { GrupoSeed } from "./database/seeds/grupo.seed";
//Notificación
import { Notificacion } from "./notificacion/notificacion.entity";
import { NotificacionSeed } from "./database/seeds/notificacion.seed";
//Supervisor
import { Supervisor } from "./supervisor/supervisor.entity";
import { SupervisorSeeder } from "./database/seeds/supervisor.seed";
//Teleoperador
import { Teleoperador } from "./teleoperador/teleoperador.entity";
import { TrabajadorSeeder } from "./database/seeds/trabajador.seed";
//Trabajador
import { Trabajador } from "./trabajador/trabajador.entity";
//Usuario
import { Usuario } from "./usuario/usuario.entity";
import { UsuarioSeed } from "./database/seeds/usuario.seed";
//Usuario-Contacto relación
import { UsuarioContactoSeed } from "./database/seeds/usuario_contacto.seed";
import { TeleoperadorSeeder } from "./database/seeds/teleoperador.seed";


const options: DataSourceOptions & SeederOptions = {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    entities: [
        Comunicacion,
        ContactoEmergencia,
        Grupo,
        Notificacion,
        Trabajador,
        Supervisor,
        Teleoperador,
        Usuario,
    ],
    seeds: [
        GrupoSeed,
        TrabajadorSeeder,
        SupervisorSeeder,
        TeleoperadorSeeder,
        ContactoEmergenciaSeeder,
        UsuarioSeed,
        UsuarioContactoSeed,
        ComunicacionSeed,
        NotificacionSeed,
    ],
};


const dataSource = new DataSource(options);

async function initializeWithRetry(maxRetries = 10, delayMs = 3000) {
    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
        try {
            await dataSource.initialize();
            return;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(`Error conectando a la base de datos (intento ${attempt}/${maxRetries}): ${message}`);
            if (attempt === maxRetries) {
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}

initializeWithRetry()
    .then(async () => {
        try {
            await dataSource.synchronize(true);
            await runSeeders(dataSource);
            console.log('Seeders ejecutados correctamente');
            await dataSource.destroy();
            process.exit(0);
        } catch (error) {
            console.error('Error ejecutando los seeders', error);
            await dataSource.destroy();
            process.exit(1);
        }
    })
    .catch(async (error) => {
        console.log('Error inicializando los datos', error);
        await dataSource.destroy();
        process.exit(1);
    });
