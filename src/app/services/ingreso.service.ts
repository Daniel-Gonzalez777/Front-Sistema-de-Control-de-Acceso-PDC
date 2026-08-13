import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoValidacion, RegistroIngresoEmpleado } from '../models/registro-ingreso.model';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class IngresoService {
  private url = `${API_BASE}/ingreso`;

  constructor(private http: HttpClient) {}

  // Si la persona no está adentro, valida y registra su ENTRADA.
  // Si ya está adentro, este mismo llamado registra su SALIDA.
  validarCedula(cedula: string): Observable<ResultadoValidacion> {
    return this.http.get<ResultadoValidacion>(`${this.url}/validar/${cedula}`);
  }

  historial(): Observable<RegistroIngresoEmpleado[]> {
    return this.http.get<RegistroIngresoEmpleado[]>(`${this.url}/historial`);
  }

  quienesEstanDentro(): Observable<RegistroIngresoEmpleado[]> {
    return this.http.get<RegistroIngresoEmpleado[]>(`${this.url}/dentro`);
  }
}
