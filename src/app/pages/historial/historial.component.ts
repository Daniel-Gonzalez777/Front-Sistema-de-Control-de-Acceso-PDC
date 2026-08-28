import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresoService } from '../../services/ingreso.service';
import { RegistroIngresoEmpleado } from '../../models/registro-ingreso.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Empleados dentro del Parque ahora mismo</h2>
      <table>
        <thead><tr><th>Cédula</th><th>Nombre</th><th>Empresa</th><th>Cargo</th><th>Área</th><th>Hora de ingreso</th></tr></thead>
        <tbody>
        <tr *ngFor="let r of dentro">
          <td>{{ r.cedulaConsultada }}</td>
          <td>{{ r.empleado?.nombre || '—' }}</td>
          <td>{{ r.empleado?.concesionario?.nombre || '—' }}</td>
          <td>{{ r.empleado?.cargo || '—' }}</td>
          <td>{{ r.empleado?.area || '—' }}</td>
          <td>{{ r.fechaHora | date:'short' }}</td>
        </tr>
        <tr *ngIf="!dentro.length"><td colspan="6">No hay nadie registrado como "dentro" en este momento.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Historial completo de movimientos</h2>
      <p class="ayuda">Se conservan automáticamente los últimos 14 días (los registros más viejos se eliminan solos, excepto el último movimiento de cada empleado).</p>
      <div class="tabla-scroll">
        <table>
          <thead><tr><th>Cédula</th><th>Empleado</th><th>Empresa</th><th>Movimiento</th><th>Resultado</th><th>Motivo</th><th>Fecha y hora</th></tr></thead>
          <tbody>
          <tr *ngFor="let r of historial">
            <td>{{ r.cedulaConsultada }}</td>
            <td>{{ r.empleado?.nombre || 'No registrado' }}</td>
            <td>{{ r.empleado?.concesionario?.nombre || '—' }}</td>
            <td>
                <span class="badge" [class.info]="r.tipoMovimiento === 'SALIDA'" [class.ok]="r.tipoMovimiento === 'ENTRADA'">
                  {{ r.tipoMovimiento }}
                </span>
            </td>
            <td>
                <span class="badge" [class.ok]="r.resultado === 'AUTORIZADO'" [class.no]="r.resultado === 'NO_AUTORIZADO'">
                  {{ r.resultado === 'AUTORIZADO' ? 'Autorizado' : 'No autorizado' }}
                </span>
            </td>
            <td>{{ r.motivo }}</td>
            <td>{{ r.fechaHora | date:'short' }}</td>
          </tr>
          <tr *ngIf="!historial.length"><td colspan="7">Todavía no hay movimientos registrados.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .tabla-scroll {
      max-height: 480px;
      overflow-y: auto;
      border: 1px solid var(--pdc-borde, #e6dac8);
      border-radius: 8px;
    }
    .tabla-scroll table { margin: 0; }
    .tabla-scroll thead th {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  `]
})
export class HistorialComponent implements OnInit {
  dentro: RegistroIngresoEmpleado[] = [];
  historial: RegistroIngresoEmpleado[] = [];

  constructor(private ingresoService: IngresoService) {}

  ngOnInit(): void {
    this.ingresoService.quienesEstanDentro().subscribe(data => this.dentro = data);
    this.ingresoService.historial().subscribe(data => this.historial = data);
  }
}