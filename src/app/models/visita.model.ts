export interface Visitante {
  id?: number;
  nombre: string;
  documento: string;
}

export interface RegistroVisita {
  id?: number;
  visitante: Visitante;
  empleadoVisitado: { id: number; nombre?: string };
  area?: string | null;
  motivo?: string | null;
  fechaHoraEntrada?: string;
  fechaHoraSalida?: string | null;
  ingresaVehiculo: boolean;
  placaVehiculo?: string | null;
  tipoVehiculo?: string | null;
  zonaParqueo?: string | null;
}

// Lo que se envía al crear una visita (ver RegistroVisitaRequest.java del backend)
export interface RegistroVisitaRequest {
  nombreVisitante: string;
  documentoVisitante: string;
  empleadoVisitadoId: number;
  motivo?: string;
  ingresaVehiculo: boolean;
  placaVehiculo?: string;
  tipoVehiculo?: string;
  zonaParqueo?: string;
}
