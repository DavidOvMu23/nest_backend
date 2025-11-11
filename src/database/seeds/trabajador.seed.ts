// src/database/seeds/trabajador.seed.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import trabajadorData from '../../data/trabajador';
import { Trabajador } from '../../trabajador/trabajador.entity';
import * as bcrypt from 'bcrypt';

export class TrabajadorSeeder implements Seeder {
    public async run(dataSource: DataSource) {
        const trabajadorRepo = dataSource.getRepository(Trabajador);

        const trabajadores = await Promise.all(
            trabajadorData.map(async data => {
                const trabajador = new Trabajador();
                trabajador.nombre = data.nombre;
                trabajador.apellidos = data.apellidos;
                trabajador.correo = data.correo;
                trabajador.contrasena = await bcrypt.hash(data.contrasena, 10);
                trabajador.rol = data.rol;
                return trabajador;
            })
        );

        await trabajadorRepo.save(trabajadores);
        console.log('✅ Trabajadores creados');
    }
}
