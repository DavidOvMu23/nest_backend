import { AppDataSource } from '../../../data-source';
import { Grupo } from '../../grupo/grupo.entity';

export async function seedGrupos() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Grupo);

    const count = await repo.count();
    if (count === 0) {
        const grupos = [
            { nombre: 'Atención Mañanas', descripcion: 'Turno 08:00–15:00', activo: true },
            { nombre: 'Atención Tardes', descripcion: 'Turno 15:00–22:00', activo: true },
            { nombre: 'Atención Noches', descripcion: 'Turno 22:00–08:00', activo: true },
            { nombre: 'Seguimiento Crónicos', descripcion: 'Casos con dependencia moderada/severa', activo: true },
        ];
        await repo.save(grupos);
        console.log('Grupos creados');
    } else {
        console.log('Grupos ya existen');
    }

    await AppDataSource.destroy();
}
