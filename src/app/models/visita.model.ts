export interface Visitante {
  id?: number;
  nombre: string;
  documento: string;
}

export interface RegistroVisita {
  id?: number;
  visitante: Visitante;
  // Solo UNO de estos dos viene lleno, según a quién se visitó
  empleadoVisitado?: { id: number; nombre?: string } | null;
  empleadoDirecto?: { id: number; nombre?: string; area?: string } | null;
  area?: string | null;
  motivo?: string | null;
  fechaHoraEntrada?: string;
  fechaHoraSalida?: string | null;
  ingresaVehiculo: boolean;
  placaVehiculo?: string | null;
  tipoVehiculo?: string | null;
  zonaParqueo?: string | null;
}

// Lo que se envía al crear una visita (ver RegistroVisitaRequest.java del backend).
// Para el empleado a visitar, se manda SOLO uno de los dos bloques:
//  - empleadoVisitadoId (empleado ya existente en el sistema), o
//  - empleadoDirectoCedula/Nombre/Area (empleado directo del parque)
export interface RegistroVisitaRequest {
  nombreVisitante: string;
  documentoVisitante: string;

  empleadoVisitadoId?: number | null;

  empleadoDirectoCedula?: string;
  empleadoDirectoNombre?: string;
  empleadoDirectoArea?: string;

  motivo?: string;
  ingresaVehiculo: boolean;
  placaVehiculo?: string;
  tipoVehiculo?: string;
  zonaParqueo?: string;
}