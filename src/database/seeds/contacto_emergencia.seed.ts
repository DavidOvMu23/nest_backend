import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import contactoEmergenciaData from '../../data/contacto_emergencia';
import { ContactoEmergencia } from '../../contacto_emergencia/contacto_emergencia.entity';

// Seed para la entidad ContactoEmergencia, lo que hace es poblar la tabla ContactoEmergencia con datos iniciales definidos en el archivo data/contacto_emergencia.ts
export class ContactoEmergenciaSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const contactoRepo = dataSource.getRepository(ContactoEmergencia);

    const contactos = contactoEmergenciaData.map((data) => {
      const contacto = new ContactoEmergencia();
      contacto.nombre = data.nombre;
      contacto.apellidos = data.apellidos;
      contacto.telefono = data.telefono;
      contacto.usuarioReferenciado = null;
      return contacto;
    });

    await contactoRepo.save(contactos);
    console.log('Contactos de emergencia creados');
  }
}
