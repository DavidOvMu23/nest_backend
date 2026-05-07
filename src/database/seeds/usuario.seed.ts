import { DataSource } from 'typeorm';
import usuarioData from '../../data/usuario';
import { Seeder } from 'typeorm-extension';
import { EstadoCuenta, Usuario } from '../../usuario/usuario.entity';
import { ContactoEmergencia } from '../../contacto_emergencia/contacto_emergencia.entity';

// Seed para la entidad Usuario. Además de crear los usuarios, replica el trigger
// de UsuarioService.create() creando un ContactoEmergencia por cada usuario,
// ya que el seeder usa el repo directamente (sin pasar por el servicio).
// IDs de contactos resultantes: a partir del 6 (los externos ocupan 1-5).
export class UsuarioSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const usuarioRepository = dataSource.getRepository(Usuario);
    const contactoRepository = dataSource.getRepository(ContactoEmergencia);

    const usuarioEntries = await Promise.all(
      usuarioData.map((usuario) => {
        const usuarioEntry = new Usuario();
        usuarioEntry.dni = usuario.dni;
        usuarioEntry.nombre = usuario.nombre;
        usuarioEntry.apellidos = usuario.apellidos;
        usuarioEntry.informacion = usuario.informacion;
        usuarioEntry.estado_cuenta = EstadoCuenta.ACTIVO;
        usuarioEntry.f_nac = usuario.f_nac;
        usuarioEntry.nivel_dependencia = usuario.nivel_dependencia;
        usuarioEntry.datos_medicos_dolencias = usuario.datos_medicos_dolencias;
        usuarioEntry.medicacion = usuario.medicacion;
        usuarioEntry.telefono = usuario.telefono;
        usuarioEntry.direccion = usuario.direccion;
        return usuarioEntry;
      }),
    );
    const savedUsuarios = await usuarioRepository.save(usuarioEntries);

    // Crear un ContactoEmergencia por cada usuario (equivalente al trigger)
    for (const usuario of savedUsuarios) {
      const contacto = contactoRepository.create({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono || '',
        usuarioReferenciado: usuario,
        creado_desde_usuario: true,
      } as any);
      await contactoRepository.save(contacto);
    }
  }
}
