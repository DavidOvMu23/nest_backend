import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comunicacion } from './comunicacion.entity';
import { Grupo } from '../grupo/grupo.entity';
import { Usuario } from '../usuario/usuario.entity';
import { NotificacionService } from '../notificacion/notificacion.service';
import { TipoNotificacion } from '../notificacion/notificacion.entity';

@Injectable()
export class ComunicacionScheduler {
  private readonly logger = new Logger(ComunicacionScheduler.name);

  constructor(
    @InjectRepository(Comunicacion)
    private readonly comunicacionRepository: Repository<Comunicacion>,
    private readonly notificacionService: NotificacionService,
  ) {}

  // Se ejecuta cada minuto. Busca llamadas programadas para exactamente
  // 10 minutos desde ahora y notifica al grupo y a los supervisores.
  @Cron('* * * * *')
  async notificarLlamadasProximas(): Promise<void> {
    const now   = new Date();
    const target = new Date(now.getTime() + 10 * 60 * 1000);

    // Formatos posibles que el usuario puede haber escrito: "01:05" o "1:05"
    const hh = String(target.getHours()).padStart(2, '0');
    const mm = String(target.getMinutes()).padStart(2, '0');
    const horaConCero    = `${hh}:${mm}`;
    const horaSinCero    = `${String(target.getHours())}:${mm}`;
    const horasABuscar   = horaConCero === horaSinCero
      ? [horaConCero]
      : [horaConCero, horaSinCero];

    // Fecha de hoy en formato "YYYY-MM-DD" usando la zona horaria del servidor
    const yyyy = now.getFullYear();
    const mes  = String(now.getMonth() + 1).padStart(2, '0');
    const dia  = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mes}-${dia}`;

    this.logger.log(
      `[Recordatorio] ${now.toISOString()} — buscando llamadas a las ${horasABuscar.join(' / ')} del ${todayStr}`,
    );

    // QueryBuilder evita ambigüedades de zona horaria en el campo DATE.
    const llamadas = await this.comunicacionRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.grupo',   'grupo')
      .leftJoinAndSelect('c.usuario', 'usuario')
      .where('CAST(c.fecha AS DATE) = :today',   { today: todayStr })
      .andWhere('c.hora IN (:...horas)',          { horas: horasABuscar })
      .andWhere('c.estado NOT IN (:...estados)',  { estados: ['completada', 'no_contesto', 'cancelada'] })
      .getMany();

    this.logger.log(`[Recordatorio] ${llamadas.length} llamada(s) encontrada(s)`);

    for (const llamada of llamadas) {
      const grupo = llamada.grupo as Grupo | null;
      if (!grupo) continue;

      const usuario      = llamada.usuario as Usuario | undefined;
      const usuarioNombre = usuario
        ? `${usuario.nombre} ${usuario.apellidos}`
        : 'desconocido';

      const metadata = {
        eventType:   'LLAMADA_RECORDATORIO',
        callId:      llamada.id_com,
        grupoNombre: grupo.nombre,
        usuarioNombre,
      };

      await this.notificacionService.notifyTeleoperadoresInGroup(
        grupo.id_grup,
        'Llamada en 10 minutos',
        `Tienes una llamada programada a las ${llamada.hora} con el usuario ${usuarioNombre}`,
        TipoNotificacion.CALL,
        metadata,
      );
    }
  }
}
