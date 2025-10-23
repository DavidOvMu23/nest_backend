import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Usuario } from '../../usuario/usuario.entity';
import contactoEmergenciaData from '../../data/contacto_emergencia';
import { ContactoEmergencia } from '../../contacto_emergencia/contacto_emergencia.entity';

export class ContactoEmergenciaSeeder implements Seeder {
    public async run(dataSource: DataSource) {
        const contactoRepo = dataSource.getRepository(ContactoEmergencia);
        const usuarioRepo = dataSource.getRepository(Usuario);

        const contactos = await Promise.all(
            contactoEmergenciaData.map(async data => {
                const contacto = new ContactoEmergencia();
                contacto.nombre = data.nombre;
                contacto.apellidos = data.apellidos;
                contacto.telefono = data.telefono;
                contacto.relacion = data.relacion;
                contacto.dni_usuario_ref = data.dni_usuario_ref != null
                    ? await usuarioRepo.findOneBy({ dni: data.dni_usuario_ref })
                    : null;
                return contacto;
            })
        );

        await contactoRepo.save(contactos);
        console.log('Contactos de emergencia creados');
    }
}
