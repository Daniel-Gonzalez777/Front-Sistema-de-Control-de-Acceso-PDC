import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE } from './api-base';

export type Rol = 'ADMIN' | 'PORTERIA' | 'CONCESIONARIO';

export interface SesionUsuario {
    token: string;
    rol: Rol;
    nombreMostrar: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly CLAVE_STORAGE = 'pdc_sesion';

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<SesionUsuario> {
        return this.http.post<SesionUsuario>(`${API_BASE}/auth/login`, { username, password })
            .pipe(tap(sesion => this.guardarSesion(sesion)));
    }

    logout(): void {
        localStorage.removeItem(this.CLAVE_STORAGE);
    }

    estaAutenticado(): boolean {
        return !!this.obtenerSesion();
    }

    obtenerSesion(): SesionUsuario | null {
        const raw = localStorage.getItem(this.CLAVE_STORAGE);
        return raw ? JSON.parse(raw) : null;
    }

    obtenerToken(): string | null {
        return this.obtenerSesion()?.token ?? null;
    }

    obtenerRol(): Rol | null {
        return this.obtenerSesion()?.rol ?? null;
    }

    obtenerNombreMostrar(): string | null {
        return this.obtenerSesion()?.nombreMostrar ?? null;
    }

    tieneRol(...roles: Rol[]): boolean {
        const rol = this.obtenerRol();
        return !!rol && roles.includes(rol);
    }

    // A dónde debe ir cada rol justo después de iniciar sesión (o cuando
    // intenta entrar a una pantalla que no le corresponde).
    rutaInicioSegunRol(): string {
        return this.obtenerRol() === 'CONCESIONARIO' ? '/afiliaciones' : '/';
    }

    private guardarSesion(sesion: SesionUsuario): void {
        localStorage.setItem(this.CLAVE_STORAGE, JSON.stringify(sesion));
    }
}