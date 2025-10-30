import { Injectable } from '@nestjs/common';
import { CreateSupervisorDTO, UpdateSupervisorDTO } from './supervisor.dto';

/**
 * Servicio de Supervisores (STUB en memoria)
 *
 * Atención: esto es una implementación simple en memoria pensada para desarrollo
 * y pruebas. No la uses en producción (no persiste nada al reiniciar la app).
 *
 * Está escrita con comentarios sencillos para que entiendas qué hace cada cosa.
 */

export type Supervisor = {
    id: number; // identificador numérico automático
    dni?: string; // el dni (8 dígitos + letra). Usamos string para conservar la letra
    createdAt: string; // fecha ISO de creación
    updatedAt?: string; // fecha ISO de última actualización
};

@Injectable()
export class SupervisorService {
    // Aquí almacenaremos los supervisores en memoria (array). Fácil y directo.
    private items: Supervisor[] = [];
    // Contador para asignar id incremental
    private nextId = 1;

    // Crear un nuevo supervisor
    // Recibe el DTO validado por el controlador
    async create(dto: CreateSupervisorDTO): Promise<Supervisor> {
        // Normalizamos el DNI a mayúsculas por si el cliente envió minúscula
        const dni = dto.dni ? dto.dni.toUpperCase() : undefined;

        const supervisor: Supervisor = {
            id: this.nextId++,
            dni,
            createdAt: new Date().toISOString(),
        };

        // Lo metemos en la lista
        this.items.push(supervisor);
        // Devolvemos el objeto creado (simula lo que haría una BD)
        return supervisor;
    }

    // Devolver todos los supervisores
    async findAll(): Promise<Supervisor[]> {
        // Devolvemos la referencia directa (en un servicio real clonarías o usarías un repositorio)
        return this.items;
    }

    // Buscar uno por id
    async findOne(id: number): Promise<Supervisor | null> {
        const found = this.items.find((s) => s.id === id);
        return found ?? null; // si no existe, devolvemos null
    }

    // Actualizar parcialmente (PATCH)
    async update(id: number, dto: UpdateSupervisorDTO): Promise<Supervisor | null> {
        const idx = this.items.findIndex((s) => s.id === id);
        if (idx === -1) return null; // no existe

        const existing = this.items[idx];
        // Si el DTO trae dni, lo actualizamos (normalizamos a mayúsculas)
        if (dto.dni !== undefined) {
            existing.dni = dto.dni ? dto.dni.toUpperCase() : undefined;
        }
        existing.updatedAt = new Date().toISOString();

        // Guardamos el cambio en el array
        this.items[idx] = existing;
        return existing;
    }

    // Eliminar por id
    async remove(id: number): Promise<boolean> {
        const idx = this.items.findIndex((s) => s.id === id);
        if (idx === -1) return false; // no existía
        // Eliminamos del array
        this.items.splice(idx, 1);
        return true; // eliminado correctamente
    }
}

