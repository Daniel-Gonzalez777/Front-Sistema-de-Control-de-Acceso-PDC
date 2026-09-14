import { Routes } from '@angular/router';
import { ValidarIngresoComponent } from './pages/validar-ingreso/validar-ingreso.component';
import { ConcesionariosComponent } from './pages/concesionarios/concesionarios.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { AfiliacionesComponent } from './pages/afiliaciones/afiliaciones.component';
import { VisitasComponent } from './pages/visitas/visitas.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { HistorialVisitasComponent } from './pages/historial-visitas/historial-visitas.component';
import { CalendarioComponent } from './pages/calendario/calendario.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Portería (y Admin)
  { path: '', component: ValidarIngresoComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'PORTERIA'] } },
  { path: 'visitas', component: VisitasComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'PORTERIA'] } },
  { path: 'historial-visitas', component: HistorialVisitasComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'PORTERIA'] } },

  // Concesionario (y Admin)
  { path: 'afiliaciones', component: AfiliacionesComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'CONCESIONARIO'] } },
  { path: 'empleados', component: EmpleadosComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'CONCESIONARIO'] } },
  { path: 'concesionarios', component: ConcesionariosComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'CONCESIONARIO'] } },
  { path: 'calendario', component: CalendarioComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },

  // Compartida entre los 3 roles
  { path: 'historial', component: HistorialComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'PORTERIA', 'CONCESIONARIO'] } },

  { path: '**', redirectTo: '' }
];