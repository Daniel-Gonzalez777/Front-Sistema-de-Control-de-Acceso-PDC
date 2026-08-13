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
        <thead><tr><th>Cédula</th><th>Nombre</th><th>Cargo</th><th>Área</th><th>Hora de ingreso</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of dentro">
            <td>{{ r.cedulaConsultada }}</td>
            <td>{{ r.empleado?.nombre || '—' }}</td>
            <td>{{ r.empleado?.cargo || '—' }}</td>
            <td>{{ r.empleado?.area || '—' }}</td>
            <td>{{ r.fechaHora | date:'short' }}</td>
          </tr>
          <tr *ngIf="!dentro.length"><td colspan="5">No hay nadie registrado como "dentro" en este momento.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Historial completo de movimientos</h2>
      <table>
        <thead><tr><th>Cédula</th><th>Empleado</th><th>Movimiento</th><th>Resultado</th><th>Motivo</th><th>Fecha y hora</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of historial">
            <td>{{ r.cedulaConsultada }}</td>
            <td>{{ r.empleado?.nombre || 'No registrado' }}</td>
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
          <tr *ngIf="!historial.length"><td colspan="6">Todavía no hay movimientos registrados.</td></tr>
        </tbody>
      </table>
    </div>
  `
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
