import { Empleado } from './empleado.model';

export interface Afiliacion {
  id?: number;
  empleado: { id: number } | Empleado;
  anio: number;
  mes: number;

  afiliadoSalud: boolean;
  eps?: string | null;
  fechaAfiliacionSalud?: string | null;

  afiliadoPension: boolean;
  afp?: string | null;
  fechaAfiliacionPension?: string | null;

  afiliadoARL: boolean;
  arl?: string | null;
  fechaAfiliacionARL?: string | null;

  fechaCarga?: string;
}
