import { DataSource } from 'typeorm';
import usuarioData from '../../data/usuario';
import { Seeder } from 'typeorm-extension';
import { Usuario } from '../../usuario/usuario.entity';

export class UsuarioSeed implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        const usuarioRepository = dataSource.getRepository(Usuario);
        const usuarioEntries = await Promise.all(
            usuarioData.map(async (usuario) => {
                const usuarioEntry = new Usuario();
                usuarioEntry.dni = usuario.dni;
                usuarioEntry.nombre = usuario.nombre;
                usuarioEntry.apellidos = usuario.apellidos;
                usuarioEntry.informacion = usuario.informacion;
                usuarioEntry.estado_cuenta = usuario.estado_cuenta;
                usuarioEntry.f_nac = usuario.f_nac;
                usuarioEntry.nivel_dependencia = usuario.nivel_dependencia;
                usuarioEntry.datos_medicos_dolencias = usuario.datos_medicos_dolencias;
                usuarioEntry.medicacion = usuario.medicacion;
                usuarioEntry.telefono = usuario.telefono;
                usuarioEntry.direccion = usuario.direccion;
                return usuarioEntry;
            })
        );
        await usuarioRepository.save(usuarioEntries)
    }
}