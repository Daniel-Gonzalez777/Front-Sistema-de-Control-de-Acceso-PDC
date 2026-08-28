export interface MovimientoCalendario {
  nombreEmpleado: string | null;
  cedula: string;
  hora: string; // "HH:mm:ss"
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  resultado: 'AUTORIZADO' | 'NO_AUTORIZADO';
  motivo: string | null;
}

export interface DiaCalendario {
  dia: number;
  movimientos: MovimientoCalendario[];
}

export interface CalendarioMensual {
  concesionarioId: number;
  concesionarioNombre: string;
  anio: number;
  mes: number;
  dias: DiaCalendario[];
}
