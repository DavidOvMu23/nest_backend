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
import { SupervisorSeed } from "./database/seeds/supervisor.seed";
//Teleoperador
import { Teleoperador } from "./teleoperador/teleoperador.entity";
import { TeleoperadorSeed } from "./database/seeds/teleoperador.seed";
//Trabajador
import { Trabajador } from "./trabajador/trabajador.entity";
import { TrabajadorSeed } from "./database/seeds/trabajador.seed";
//Usuario de contacto
import { UsuarioContactoSeed } from "./database/seeds/usuario_contacto.seed";
import { UsuarioContactoUsuario } from "./usuario_contacto/usuario_contacto.entity";
//Usuario
import { Usuario } from "./usuario/usuario.entity";
import { UsuarioSeed } from "./database/seeds/usuario.seed";


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
        Supervisor,
        Teleoperador,
        Trabajador,
        Usuario,
        UsuarioContactoUsuario
    ],
    seeds: [
        ComunicacionSeed,
        ContactoEmergenciaSeeder,
        GrupoSeed,
        NotificacionSeed,
        SupervisorSeed,
        TeleoperadorSeed,
        TrabajadorSeed,
        UsuarioSeed,
        UsuarioContactoSeed
    ]
};


const dataSource = new DataSource(options);

dataSource
    .initialize()
    .then(async () => {
        await dataSource.synchronize(true);
        await runSeeders(dataSource)
        process.exit();
    })
    .catch((error) => console.log('Error inicializando los datos', error))