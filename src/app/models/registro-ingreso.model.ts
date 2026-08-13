export type TipoMovimiento = 'ENTRADA' | 'SALIDA';
export type ResultadoIngresoTipo = 'AUTORIZADO' | 'NO_AUTORIZADO';

export interface ResultadoValidacion {
  autorizado: boolean;
  nombre: string | null;
  concesionario: string | null;
  motivo: string;
  tipoMovimiento: TipoMovimiento;
}

// Refleja RegistroIngresoEmpleado.java: una fila del historial
export interface RegistroIngresoEmpleado {
  id: number;
  cedulaConsultada: string;
  empleado: { id: number; nombre: string; cargo?: string; area?: string } | null;
  resultado: ResultadoIngresoTipo;
  tipoMovimiento: TipoMovimiento;
  motivo: string;
  fechaHora: string;
}
