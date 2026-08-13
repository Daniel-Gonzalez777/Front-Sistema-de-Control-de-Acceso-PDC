export interface ErrorFila {
  fila: number;
  cedula: string | null;
  mensaje: string;
}

export interface ResultadoCarga {
  totalFilas: number;
  filasExitosas: number;
  filasConError: number;
  empleadosCreados: number;
  empleadosActualizados: number;
  errores: ErrorFila[];
}
