import { AppDataSource } from '../../../data-source';
import { Usuario } from '../../usuario/usuario.entity';
import { ContactoEmergencia } from '../../contacto_emergencia/contacto_emergencia.entity';

export async function seedUsuarioContacto() {
    await AppDataSource.initialize();
    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const contactoRepo = AppDataSource.getRepository(ContactoEmergencia);

    const usuarios = await usuarioRepo.find();
    const contactos = await contactoRepo.find();

    const getUsuario = (dni: string) => usuarios.find(u => u.dni === dni);
    const getContacto = (telefono: string) => contactos.find(c => c.telefono === telefono);

    // Carmen: su hija Laura (645678901) y su esposo Antonio (678112233)
    const carmen = getUsuario('11111111A');
    const laura = getContacto('645678901');
    const antonio = getContacto('678112233');
    if (carmen && laura && antonio) {
        carmen.contactosEmergencia = [laura, antonio];
        await usuarioRepo.save(carmen);
    }

    // José: sus hijos Pedro (698765432) y Carmen Ruiz (612398765)
    const jose = getUsuario('22222222B');
    const pedro = getContacto('698765432');
    const carmenRuiz = getContacto('612398765');
    if (jose && pedro && carmenRuiz) {
        jose.contactosEmergencia = [pedro, carmenRuiz];
        await usuarioRepo.save(jose);
    }

    // Eduardo: vecina Marta (600400400)
    const eduardo = getUsuario('55555555E');
    const marta = getContacto('600400400');
    if (eduardo && marta) {
        eduardo.contactosEmergencia = [marta];
        await usuarioRepo.save(eduardo);
    }

    // Antonio: su esposa Carmen (634567890) y su hija Laura (645678901)
    const antonioUser = getUsuario('77777777G');
    const carmenTel = getContacto('634567890');
    if (antonioUser && carmenTel && laura) {
        antonioUser.contactosEmergencia = [carmenTel, laura];
        await usuarioRepo.save(antonioUser);
    }

    console.log('Relaciones Usuario–Contacto creadas');
    await AppDataSource.destroy();
}
