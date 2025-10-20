import { AppDataSource } from '../../../data-source';
import { Supervisor } from '../../supervisor/supervisor.entity';
import { Grupo } from '../../grupo/grupo.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';

export async function seedSupervisores() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Supervisor);
    const grupoRepo = AppDataSource.getRepository(Grupo);
    const trabajadorRepo = AppDataSource.getRepository(Trabajador);

    const grupos = await grupoRepo.find();
    const trabajadores = await trabajadorRepo.find({ where: { tipo: 'supervisor' as TipoTrabajador } });

    const count = await repo.count();
    if (count === 0) {
        const supervisores = [
            {
                dni: '49223311X',
                grupo: grupos.find(g => g.nombre === 'Atención Mañanas'),
                ...trabajadores.find(t => t.correo === 'sofia.martin@cuidem.local'),
            },
            {
                dni: '12345678Z',
                grupo: grupos.find(g => g.nombre === 'Atención Tardes'),
                ...trabajadores.find(t => t.correo === 'javier.rovira@cuidem.local'),
            },
        ];
        await repo.save(supervisores);
        console.log('Supervisores creados');
    } else {
        console.log('Supervisores ya existen');
    }

    await AppDataSource.destroy();
}