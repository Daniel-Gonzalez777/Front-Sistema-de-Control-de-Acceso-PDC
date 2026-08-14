import { Routes } from '@angular/router';
import { ValidarIngresoComponent } from './pages/validar-ingreso/validar-ingreso.component';
import { ConcesionariosComponent } from './pages/concesionarios/concesionarios.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { AfiliacionesComponent } from './pages/afiliaciones/afiliaciones.component';
import { VisitasComponent } from './pages/visitas/visitas.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { HistorialVisitasComponent } from './pages/historial-visitas/historial-visitas.component';

export const routes: Routes = [
  { path: '', component: ValidarIngresoComponent },
  { path: 'concesionarios', component: ConcesionariosComponent },
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'afiliaciones', component: AfiliacionesComponent },
  { path: 'visitas', component: VisitasComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'historial-visitas', component: HistorialVisitasComponent },
  { path: '**', redirectTo: '' }
];