import { AppDataSource } from '../../../data-source';
import { Usuario } from '../../usuario/usuario.entity';
import { Repository } from 'typeorm';

// Creamos un tipo inline para contacto de emergencia y su relación.
// (Asumimos que tienes una entidad ContactoEmergencia con las columnas del SQL)
import { ContactoEmergencia } from '../../contacto_emergencia/contacto_emergencia.entity';

export async function seedContactosEmergencia() {
    await AppDataSource.initialize();
    const contactoRepo = AppDataSource.getRepository(ContactoEmergencia);
    const usuarioRepo = AppDataSource.getRepository(Usuario);

    const count = await contactoRepo.count();
    if (count === 0) {
        const usuarios = await usuarioRepo.find();

        const getUsuario = (dni: string) => usuarios.find(u => u.dni === dni) || null;

        const contactos = [
            {
                nombre: 'Laura',
                apellidos: 'Rodríguez Pérez',
                telefono: '645678901',
                relacion: 'Hija',
                dni_usuario_ref: getUsuario('88888888H'),
            },
            {
                nombre: 'Antonio',
                apellidos: 'López García',
                telefono: '678112233',
                relacion: 'Esposo',
                dni_usuario_ref: getUsuario('77777777G'),
            },
            {
                nombre: 'Pedro',
                apellidos: 'Martínez Gómez',
                telefono: '698765432',
                relacion: 'Hijo',
                dni_usuario_ref: getUsuario('99999999J'),
            },
            {
                nombre: 'Marta',
                apellidos: 'Vega Ríos',
                telefono: '600400400',
                relacion: 'Vecina',
                dni_usuario_ref: null,
            },
            {
                nombre: 'Carmen',
                apellidos: 'Ruiz Díaz',
                telefono: '612398765',
                relacion: 'Hija',
                dni_usuario_ref: null,
            },
            {
                nombre: 'Carmen',
                apellidos: 'Rodríguez Sanz',
                telefono: '634567890',
                relacion: 'Esposa',
                dni_usuario_ref: getUsuario('11111111A'),
            },
        ];

        await contactoRepo.save(contactos);
        console.log('Contactos de emergencia creados');
    } else {
        console.log('Contactos de emergencia ya existen');
    }

    await AppDataSource.destroy();
}
