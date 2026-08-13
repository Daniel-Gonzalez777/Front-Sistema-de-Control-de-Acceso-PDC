import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private url = `${API_BASE}/empleados`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.url);
  }

  // Trae solo los empleados del concesionario indicado.
  listarPorConcesionario(concesionarioId: number): Observable<Empleado[]> {
    const params = new HttpParams().set('concesionarioId', concesionarioId);
    return this.http.get<Empleado[]>(this.url, { params });
  }

  crear(e: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.url, e);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}