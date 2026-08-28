import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarioMensual } from '../models/calendario.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class CalendarioService {
  private url = `${API_BASE}/ingreso/calendario`;

  constructor(private http: HttpClient) {}

  obtener(concesionarioId: number, anio: number, mes: number): Observable<CalendarioMensual> {
    return this.http.get<CalendarioMensual>(this.url, {
      params: { concesionarioId, anio, mes }
    });
  }

  // Descarga el Excel y devuelve el archivo crudo (blob) para guardarlo.
  exportar(concesionarioId: number, anio: number, mes: number): Observable<Blob> {
    return this.http.get(`${this.url}/exportar`, {
      params: { concesionarioId, anio, mes },
      responseType: 'blob'
    });
  }
}
