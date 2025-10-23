import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import usuario_contacto from 'src/data/usuario_contacto';
import { Usuario } from '../../usuario/usuario.entity';
import { ContactoEmergencia } from '../../contacto_emergencia/contacto_emergencia.entity';


export class UsuarioContactoSeed implements Seeder {
    public async run(dataSource: DataSource) {
        const usuarioRepository = dataSource.getRepository(Usuario);
        const contactoRepository = dataSource.getRepository(ContactoEmergencia);

        const usuarioContactoEntries = await Promise.all(
            usuario_contacto.map(async (usuario_contacto) => {
                const usuario = await usuarioRepository.findOneBy({ dni: usuario_contacto.usuario });
                if (!usuario) {
                    throw new Error(`Usuario no encontrado: ${usuario_contacto.usuario}`);
                }

                const contactos = await Promise.all(
                    usuario_contacto.contactos.map(async (telefono) => {
                        const contacto = await contactoRepository.findOneBy({ telefono });
                        if (!contacto) {
                            throw new Error(`ContactoEmergencia no encontrado: ${telefono}`);
                        }
                        return contacto;
                    })
                );

                usuario.contactosEmergencia = contactos;
                return usuario;
            })
        );

        await usuarioRepository.save(usuarioContactoEntries);
    }
}