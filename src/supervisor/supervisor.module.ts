import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorService } from './supervisor.service';
import { SupervisorController } from './supervisor.controller';
import { Supervisor } from './supervisor.entity';

/**
 * Un módulo agrupa todo lo que tiene sentido que vaya junto:
 * - imports: qué recursos externos necesita (aquí el repositorio de Supervisor).
 * - providers: servicios disponibles dentro del módulo.
 * - controllers: rutas HTTP gestionadas.
 * - exports: lo que dejamos disponible a otros módulos (opcional).
 */
@Module({
  imports: [TypeOrmModule.forFeature([Supervisor])], // TypeORM nos da el Repository<Supervisor>
  providers: [SupervisorService],
  controllers: [SupervisorController],
  exports: [SupervisorService], // Por si otro módulo quiere reutilizar la lógica.
})
export class SupervisorModule {}
