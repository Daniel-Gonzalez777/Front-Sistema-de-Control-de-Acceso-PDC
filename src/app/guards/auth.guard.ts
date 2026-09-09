import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, Rol } from '../services/auth.service';

/**
 * Se ejecuta antes de entrar a cualquier ruta protegida.
 *   1) Si no hay sesión -> manda a /login.
 *   2) Si hay sesión pero el rol no está en la lista de "roles" de esa
 *      ruta (definida en app.routes.ts) -> lo manda a SU propia pantalla
 *      de inicio, en vez de dejarlo entrar a algo que no le corresponde.
 */
export const authGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.estaAutenticado()) {
        router.navigate(['/login']);
        return false;
    }

    const rolesPermitidos = route.data['roles'] as Rol[] | undefined;
    if (rolesPermitidos && !authService.tieneRol(...rolesPermitidos)) {
        router.navigate([authService.rutaInicioSegunRol()]);
        return false;
    }

    return true;
};