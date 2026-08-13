import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitaService } from '../../services/visita.service';
import { EmpleadoService } from '../../services/empleado.service';
import { RegistroVisita, RegistroVisitaRequest } from '../../models/visita.model';
import { Empleado } from '../../models/empleado.model';

@Component({
  selector: 'app-visitas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Registrar ingreso de visitante</h2>
      <form class="inline-form" (ngSubmit)="registrarIngreso()" #f="ngForm">
        <div>
          <label>Nombre del visitante</label>
          <input type="text" name="nombreVisitante" [(ngModel)]="form.nombreVisitante" required>
        </div>
        <div>
          <label>Documento</label>
          <input type="text" name="documentoVisitante" [(ngModel)]="form.documentoVisitante" required>
        </div>
        <div>
          <label>Empleado que visita</label>
          <select name="empleadoVisitadoId" [(ngModel)]="form.empleadoVisitadoId" required>
            <option [ngValue]="null" disabled>Seleccione...</option>
            <option *ngFor="let e of empleados" [ngValue]="e.id">{{ e.nombre }} — {{ e.area || 'sin área' }}</option>
          </select>
        </div>
        <div>
          <label>Motivo de la visita</label>
          <input type="text" name="motivo" [(ngModel)]="form.motivo">
        </div>
        <div>
          <label>¿Ingresa con vehículo?</label>
          <select name="ingresaVehiculo" [(ngModel)]="form.ingresaVehiculo">
            <option [ngValue]="false">No</option>
            <option [ngValue]="true">Sí</option>
          </select>
        </div>
        <ng-container *ngIf="form.ingresaVehiculo">
          <div><label>Placa</label><input type="text" name="placaVehiculo" [(ngModel)]="form.placaVehiculo"></div>
          <div><label>Tipo de vehículo</label><input type="text" name="tipoVehiculo" [(ngModel)]="form.tipoVehiculo" placeholder="Carro, moto..."></div>
          <div><label>Zona de parqueo</label><input type="text" name="zonaParqueo" [(ngModel)]="form.zonaParqueo"></div>
        </ng-container>
        <div><button type="submit" [disabled]="!f.valid || !form.empleadoVisitadoId">Registrar ingreso</button></div>
      </form>
      <div *ngIf="error" class="error-msg">{{ error }}</div>
    </div>

    <div class="card">
      <h2>Visitantes actualmente dentro del Parque</h2>
      <table>
        <thead>
          <tr><th>Visitante</th><th>Documento</th><th>Visita a</th><th>Área</th><th>Entrada</th><th>Vehículo</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let v of activas">
            <td>{{ v.visitante.nombre }}</td>
            <td>{{ v.visitante.documento }}</td>
            <td>{{ v.empleadoVisitado.nombre || ('ID ' + v.empleadoVisitado.id) }}</td>
            <td>{{ v.area || '—' }}</td>
            <td>{{ v.fechaHoraEntrada | date:'short' }}</td>
            <td>{{ v.ingresaVehiculo ? (v.placaVehiculo || 'Sí') : 'No' }}</td>
            <td class="acciones"><button (click)="registrarSalida(v)">Registrar salida</button></td>
          </tr>
          <tr *ngIf="!activas.length"><td colspan="7">No hay visitantes dentro del Parque en este momento.</td></tr>
        </tbody>
      </table>
    </div>
  `
})
export class VisitasComponent implements OnInit {
  empleados: Empleado[] = [];
  activas: RegistroVisita[] = [];
  error = '';

  form: RegistroVisitaRequest = {
    nombreVisitante: '',
    documentoVisitante: '',
    empleadoVisitadoId: 0,
    motivo: '',
    ingresaVehiculo: false,
    placaVehiculo: '',
    tipoVehiculo: '',
    zonaParqueo: ''
  };

  constructor(
    private visitaService: VisitaService,
    private empleadoService: EmpleadoService
  ) {
    (this.form as any).empleadoVisitadoId = null;
  }

  ngOnInit(): void {
    this.cargarActivas();
    this.empleadoService.listar().subscribe(data => this.empleados = data);
  }

  cargarActivas(): void {
    this.visitaService.activas().subscribe(data => this.activas = data);
  }

  registrarIngreso(): void {
    this.error = '';
    this.visitaService.registrarIngreso(this.form).subscribe({
      next: () => {
        this.form = {
          nombreVisitante: '', documentoVisitante: '',
          empleadoVisitadoId: null as any, motivo: '',
          ingresaVehiculo: false, placaVehiculo: '', tipoVehiculo: '', zonaParqueo: ''
        };
        this.cargarActivas();
      },
      error: (err) => this.error = 'No se pudo registrar: ' + (err.error?.message || err.message)
    });
  }

  registrarSalida(v: RegistroVisita): void {
    if (!v.id) return;
    this.visitaService.registrarSalida(v.id).subscribe({
      next: () => this.cargarActivas(),
      error: (err) => this.error = 'No se pudo registrar la salida: ' + (err.error?.message || err.message)
    });
  }
}
