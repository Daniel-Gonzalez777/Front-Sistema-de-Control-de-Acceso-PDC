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

  // Públicas: las 4 pantallas de portería, sin necesidad de iniciar sesión.
  { path: '', component: ValidarIngresoComponent },
  { path: 'visitas', component: VisitasComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'historial-visitas', component: HistorialVisitasComponent },

  // Exclusivas de Admin.
  { path: 'afiliaciones', component: AfiliacionesComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'empleados', component: EmpleadosComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'concesionarios', component: ConcesionariosComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'calendario', component: CalendarioComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },

  { path: '**', redirectTo: '' }
];
