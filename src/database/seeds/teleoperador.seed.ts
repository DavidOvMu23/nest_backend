import { AppDataSource } from '../../../data-source';
import { Teleoperador } from '../../teleoperador/teleoperador.entity';
import { Grupo } from '../../grupo/grupo.entity';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';

export async function seedTeleoperadores() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Teleoperador);
    const grupoRepo = AppDataSource.getRepository(Grupo);
    const trabajadorRepo = AppDataSource.getRepository(Trabajador);

    const grupos = await grupoRepo.find();
    const trabajadores = await trabajadorRepo.find({ where: { tipo: 'teleoperador' as TipoTrabajador } });

    const count = await repo.count();
    if (count === 0) {
        const teleoperadores = [
            { nia: 'NIA0001', grupo: grupos.find(g => g.nombre === 'Atención Mañanas'), ...trabajadores.find(t => t.correo === 'laura.gomez@cuidem.local') },
            { nia: 'NIA0002', grupo: grupos.find(g => g.nombre === 'Atención Mañanas'), ...trabajadores.find(t => t.correo === 'carlos.navas@cuidem.local') },
            { nia: 'NIA0003', grupo: grupos.find(g => g.nombre === 'Atención Tardes'), ...trabajadores.find(t => t.correo === 'noa.benitez@cuidem.local') },
            { nia: 'NIA0004', grupo: grupos.find(g => g.nombre === 'Atención Tardes'), ...trabajadores.find(t => t.correo === 'pablo.rey@cuidem.local') },
            { nia: 'NIA0005', grupo: grupos.find(g => g.nombre === 'Atención Noches'), ...trabajadores.find(t => t.correo === 'ines.campos@cuidem.local') },
            { nia: 'NIA0006', grupo: grupos.find(g => g.nombre === 'Seguimiento Crónicos'), ...trabajadores.find(t => t.correo === 'hugo.santos@cuidem.local') },
        ];
        await repo.save(teleoperadores);
        console.log('Teleoperadores creados');
    } else {
        console.log('Teleoperadores ya existen');
    }

    await AppDataSource.destroy();
}
