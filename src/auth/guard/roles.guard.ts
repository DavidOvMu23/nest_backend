import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // Log for debugging when access is denied
    if (!user) {
      this.logger.warn(
        `Acceso denegado: no hay usuario en la request. Roles requeridos: ${JSON.stringify(requiredRoles)}`,
      );
      return false;
    }
    const userRole = (user.rol ?? '').toString().toLowerCase();
    const allowed = requiredRoles
      .map((r) => r.toString().toLowerCase())
      .some((role) => role === userRole);
    if (!allowed) {
      this.logger.warn(
        `Acceso denegado: rol del usuario '${userRole}' no está entre ${JSON.stringify(requiredRoles)}`,
      );
      this.logger.debug(`User payload: ${JSON.stringify(user)}`);
    }
    return allowed;
  }
}
