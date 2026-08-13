import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concesionario } from '../models/concesionario.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class ConcesionarioService {
  private url = `${API_BASE}/concesionarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Concesionario[]> {
    return this.http.get<Concesionario[]>(this.url);
  }

  crear(c: Concesionario): Observable<Concesionario> {
    return this.http.post<Concesionario>(this.url, c);
  }

  actualizar(id: number, c: Concesionario): Observable<Concesionario> {
    return this.http.put<Concesionario>(`${this.url}/${id}`, c);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
