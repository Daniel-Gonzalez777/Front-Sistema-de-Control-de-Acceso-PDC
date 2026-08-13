import { Concesionario } from './concesionario.model';

export interface Empleado {
  id?: number;
  cedula: string;
  nombre: string;
  cargo?: string | null;
  area?: string | null;
  concesionario: { id: number } | Concesionario;
}
