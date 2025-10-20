import { AppDataSource } from '../../../data-source';
import { Trabajador, TipoTrabajador } from '../../trabajador/trabajador.entity';

export async function seedTrabajadores() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Trabajador);

    const count = await repo.count();
    if (count === 0) {
        const trabajadores = [
            { nombre: 'Sofía', apellidos: 'Martín Prado', correo: 'sofia.martin@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.SUPERVISOR },
            { nombre: 'Javier', apellidos: 'Rovira Díaz', correo: 'javier.rovira@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.SUPERVISOR },
            { nombre: 'Laura', apellidos: 'Gómez Vera', correo: 'laura.gomez@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.TELEOPERADOR },
            { nombre: 'Carlos', apellidos: 'Navas Gil', correo: 'carlos.navas@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.TELEOPERADOR },
            { nombre: 'Noa', apellidos: 'Benítez Pardo', correo: 'noa.benitez@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.TELEOPERADOR },
            { nombre: 'Pablo', apellidos: 'Rey Serrano', correo: 'pablo.rey@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.TELEOPERADOR },
            { nombre: 'Inés', apellidos: 'Campos León', correo: 'ines.campos@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.TELEOPERADOR },
            { nombre: 'Hugo', apellidos: 'Santos Ibarra', correo: 'hugo.santos@cuidem.local', contrasena: 'temporal123', tipo: TipoTrabajador.TELEOPERADOR },
        ];
        await repo.save(trabajadores);
        console.log('Trabajadores creados');
    } else {
        console.log('Trabajadores ya existen');
    }

    await AppDataSource.destroy();
}
