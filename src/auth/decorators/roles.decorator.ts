import { SetMetadata } from '@nestjs/common';

// Lo que hace esto es piullar los roles y comprueba que rol es el que tenemos para no dar acceso a todo el mundo a cosas que no tiene sentido que la gente pueda tocar
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);