import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoDirectoParque } from '../models/empleado-directo.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class EmpleadoDirectoService {
    private url = `${API_BASE}/empleados-directos`;

    constructor(private http: HttpClient) {}

    listar(): Observable<EmpleadoDirectoParque[]> {
        return this.http.get<EmpleadoDirectoParque[]>(this.url);
    }

    // Trae la lista oficial de áreas válidas directo del backend,
    // así nunca se desincroniza con lo que el servidor valida.
    areas(): Observable<string[]> {
        return this.http.get<string[]>(`${this.url}/areas`);
    }
}