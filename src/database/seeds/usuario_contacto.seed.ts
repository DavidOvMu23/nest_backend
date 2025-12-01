import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import usuario_contacto from 'src/data/usuario_contacto';
import { Usuario } from '../../usuario/usuario.entity';
import { ContactoEmergencia } from '../../contacto_emergencia/contacto_emergencia.entity';

// Seed para la relación entre Usuario y ContactoEmergencia, lo que hace es poblar la tabla Usuario con sus contactos de emergencia asociados, definidos en el archivo data/usuario_contacto.ts
export class UsuarioContactoSeed implements Seeder {
  public async run(dataSource: DataSource) {
    const usuarioRepository = dataSource.getRepository(Usuario);
    const contactoRepository = dataSource.getRepository(ContactoEmergencia);

    const usuarioContactoEntries = await Promise.all(
      usuario_contacto.map(async (usuario_contacto) => {
        const usuario = await usuarioRepository.findOneBy({
          dni: usuario_contacto.usuario,
        });
        if (!usuario) {
          throw new Error(`Usuario no encontrado: ${usuario_contacto.usuario}`);
        }

        const contactos = await Promise.all(
          usuario_contacto.contactos.map(async (id_cont) => {
            const contacto = await contactoRepository.findOneBy({ id_cont });
            if (!contacto) {
              throw new Error(`ContactoEmergencia no encontrado: ${id_cont}`);
            }
            return contacto;
          }),
        );

        usuario.contactosEmergencia = contactos;
        return usuario;
      }),
    );

    await usuarioRepository.save(usuarioContactoEntries);
  }
}
