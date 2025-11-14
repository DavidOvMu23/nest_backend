// El archivo de configuración de la fuente de datos para TypeORM en una aplicación NestJS
// Carga variables de entorno desde archivos .env en diferentes ubicaciones

import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

// Intentar cargar variables de entorno desde múltiples ubicaciones
const envCandidates = ['.env', '../env', '../../env'];
for (const candidate of envCandidates) {
    const result = config({ path: candidate, override: false });
    if (!result.error) {
        break;
    }
}

// Configuración de la fuente de datos para TypeORM
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [join(__dirname, 'src/**/*.entity.{ts,js}')],
    synchronize: true, // solo para desarrollo
    logging: false,
});
