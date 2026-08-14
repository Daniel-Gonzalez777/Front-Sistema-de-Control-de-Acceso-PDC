import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visitante } from '../models/visita.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class VisitanteService {
    private url = `${API_BASE}/visitantes`;

    constructor(private http: HttpClient) {}

    listar(): Observable<Visitante[]> {
        return this.http.get<Visitante[]>(this.url);
    }
}