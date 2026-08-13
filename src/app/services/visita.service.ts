import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroVisita, RegistroVisitaRequest } from '../models/visita.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class VisitaService {
  private url = `${API_BASE}/visitas`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<RegistroVisita[]> {
    return this.http.get<RegistroVisita[]>(this.url);
  }

  activas(): Observable<RegistroVisita[]> {
    return this.http.get<RegistroVisita[]>(`${this.url}/activas`);
  }

  registrarIngreso(request: RegistroVisitaRequest): Observable<RegistroVisita> {
    return this.http.post<RegistroVisita>(`${this.url}/ingreso`, request);
  }

  registrarSalida(id: number): Observable<RegistroVisita> {
    return this.http.post<RegistroVisita>(`${this.url}/${id}/salida`, {});
  }
}
