import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Afiliacion } from '../models/afiliacion.model';
import { ResultadoCarga } from '../models/resultado-carga.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class AfiliacionService {
  private url = `${API_BASE}/afiliaciones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Afiliacion[]> {
    return this.http.get<Afiliacion[]>(this.url);
  }

  crear(a: Afiliacion): Observable<Afiliacion> {
    return this.http.post<Afiliacion>(this.url, a);
  }

  actualizar(id: number, a: Afiliacion): Observable<Afiliacion> {
    return this.http.put<Afiliacion>(`${this.url}/${id}`, a);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Sube el Excel mensual de un concesionario (multipart/form-data).
  cargarPlantilla(concesionarioId: number, archivo: File): Observable<ResultadoCarga> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('concesionarioId', concesionarioId.toString());
    return this.http.post<ResultadoCarga>(`${this.url}/cargar-plantilla`, formData);
  }
}
