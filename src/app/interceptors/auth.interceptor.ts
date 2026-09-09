import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Se ejecuta en TODA petición que sale hacia el backend. Si hay una sesión
 * guardada, le pega el token en el header Authorization automáticamente --
 * así ningún servicio (afiliaciones, empleados, etc.) tiene que preocuparse
 * por agregarlo a mano.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.obtenerToken();

    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(req);
};