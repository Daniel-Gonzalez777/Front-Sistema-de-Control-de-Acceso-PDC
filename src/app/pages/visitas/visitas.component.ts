import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitaService } from '../../services/visita.service';
import { EmpleadoService } from '../../services/empleado.service';
import { EmpleadoDirectoService } from '../../services/empleado-directo.service';
import { ConcesionarioService } from '../../services/concesionario.service';
import { ToastService } from '../../services/toast.service';
import { RegistroVisita, RegistroVisitaRequest } from '../../models/visita.model';
import { Empleado } from '../../models/empleado.model';
import { Concesionario } from '../../models/concesionario.model';

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
          <input type="text" name="nombreVisitante" [(ngModel)]="req.nombreVisitante" required>
        </div>
        <div>
          <label>Documento</label>
          <input type="text" name="documentoVisitante" [(ngModel)]="req.documentoVisitante" required>
        </div>
        <div>
          <label>Motivo</label>
          <input type="text" name="motivo" [(ngModel)]="req.motivo">
        </div>

        <!-- Tipo de empleado a visitar -->
        <div style="grid-column: 1 / -1; border-top: 1px solid #f1e6e1; margin-top:6px; padding-top:10px;">
          <label>¿A quién visita?</label>
          <select name="tipoEmpleado" [(ngModel)]="tipoEmpleado" (ngModelChange)="onTipoEmpleadoChange()">
            <option value="sistema">Empleado del sistema (de un concesionario)</option>
            <option value="directo">Empleado directo del Parque (aseo, jardinería, taquilla, etc.)</option>
          </select>
        </div>

        <!-- Caso: empleado del sistema -->
        <ng-container *ngIf="tipoEmpleado === 'sistema'">
          <div>
            <label>Concesionario</label>
            <select name="concesionarioIdFiltro" [(ngModel)]="concesionarioIdFiltro" (ngModelChange)="onConcesionarioFiltroChange()">
              <option [ngValue]="null">Todas las empresas</option>
              <option *ngFor="let c of concesionarios" [ngValue]="c.id">{{ c.nombre }}</option>
            </select>
          </div>
          <div>
            <label>Empleado a visitar</label>
            <select name="empleadoVisitadoId" [(ngModel)]="req.empleadoVisitadoId" [required]="tipoEmpleado === 'sistema'">
              <option [ngValue]="null" disabled>Seleccione...</option>
              <option *ngFor="let e of empleadosFiltrados" [ngValue]="e.id">{{ e.nombre }} ({{ e.cedula }})</option>
            </select>
          </div>
        </ng-container>

        <!-- Caso: empleado directo del parque -->
        <ng-container *ngIf="tipoEmpleado === 'directo'">
          <div>
            <label>Cédula del empleado</label>
            <input type="text" name="empleadoDirectoCedula" [(ngModel)]="req.empleadoDirectoCedula" [required]="tipoEmpleado === 'directo'">
          </div>
          <div>
            <label>Nombre del empleado</label>
            <input type="text" name="empleadoDirectoNombre" [(ngModel)]="req.empleadoDirectoNombre" [required]="tipoEmpleado === 'directo'">
          </div>
          <div>
            <label>Área</label>
            <select name="empleadoDirectoArea" [(ngModel)]="req.empleadoDirectoArea" [required]="tipoEmpleado === 'directo'">
              <option [ngValue]="null" disabled>Seleccione...</option>
              <option *ngFor="let a of areasDisponibles" [ngValue]="a">{{ a }}</option>
            </select>
          </div>
        </ng-container>

        <div>
          <label>¿Ingresa vehículo?</label>
          <select name="ingresaVehiculo" [(ngModel)]="req.ingresaVehiculo">
            <option [ngValue]="false">No</option>
            <option [ngValue]="true">Sí</option>
          </select>
        </div>
        <div *ngIf="req.ingresaVehiculo">
          <label>Placa</label>
          <input type="text" name="placaVehiculo" [(ngModel)]="req.placaVehiculo">
        </div>
        <div *ngIf="req.ingresaVehiculo">
          <label>Tipo de vehículo</label>
          <input type="text" name="tipoVehiculo" [(ngModel)]="req.tipoVehiculo">
        </div>
        <div *ngIf="req.ingresaVehiculo">
          <label>Zona de parqueo</label>
          <input type="text" name="zonaParqueo" [(ngModel)]="req.zonaParqueo">
        </div>

        <div>
          <button type="submit" [disabled]="!f.valid">Registrar ingreso</button>
        </div>
      </form>

    </div>

    <div class="card">
      <h2>Visitantes actualmente dentro del parque</h2>
      <table>
        <thead>
        <tr><th>Visitante</th><th>Documento</th><th>Visita a</th><th>Entrada</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        <tr *ngFor="let v of activas">
          <td>{{ v.visitante.nombre }}</td>
          <td>{{ v.visitante.documento }}</td>
          <td>{{ nombreVisitado(v) }}</td>
          <td>{{ v.fechaHoraEntrada | date:'short' }}</td>
          <td class="acciones">
            <button (click)="registrarSalida(v)">Registrar salida</button>
          </td>
        </tr>
        <tr *ngIf="!activas.length">
          <td colspan="5">No hay visitantes dentro del parque en este momento.</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Histórico de visitas</h2>
      <div class="tabla-scroll">
        <table>
          <thead>
          <tr><th>Visitante</th><th>Visita a</th><th>Entrada</th><th>Salida</th></tr>
          </thead>
          <tbody>
          <tr *ngFor="let v of todas">
            <td>{{ v.visitante.nombre }}</td>
            <td>{{ nombreVisitado(v) }}</td>
            <td>{{ v.fechaHoraEntrada | date:'short' }}</td>
            <td>{{ v.fechaHoraSalida ? (v.fechaHoraSalida | date:'short') : '— sigue dentro —' }}</td>
          </tr>
          <tr *ngIf="!todas.length">
            <td colspan="4">Sin registros todavía.</td>
          </tr>
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
export class VisitasComponent implements OnInit {
  activas: RegistroVisita[] = [];
  todas: RegistroVisita[] = [];
  empleados: Empleado[] = [];
  concesionarios: Concesionario[] = [];
  areasDisponibles: string[] = [];

  tipoEmpleado: 'sistema' | 'directo' = 'sistema';
  concesionarioIdFiltro: number | null = null;

  req: RegistroVisitaRequest = {
    nombreVisitante: '',
    documentoVisitante: '',
    empleadoVisitadoId: null,
    motivo: '',
    ingresaVehiculo: false,
    placaVehiculo: '',
    tipoVehiculo: '',
    zonaParqueo: ''
  };

  constructor(
      private visitaService: VisitaService,
      private empleadoService: EmpleadoService,
      private empleadoDirectoService: EmpleadoDirectoService,
      private concesionarioService: ConcesionarioService,
      private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.empleadoService.listar().subscribe(data => this.empleados = data);
    this.empleadoDirectoService.areas().subscribe(data => this.areasDisponibles = data);
    this.concesionarioService.listar().subscribe(data => this.concesionarios = data);
  }

  // Solo los empleados de la empresa elegida en el filtro (o todos, si
  // no se ha elegido ninguna) -- para no tener que buscar entre todos los
  // empleados de todos los concesionarios mezclados.
  get empleadosFiltrados(): Empleado[] {
    if (!this.concesionarioIdFiltro) return this.empleados;
    return this.empleados.filter(e => (e.concesionario as any)?.id === this.concesionarioIdFiltro);
  }

  onConcesionarioFiltroChange(): void {
    if (this.req.empleadoVisitadoId && !this.empleadosFiltrados.some(e => e.id === this.req.empleadoVisitadoId)) {
      this.req.empleadoVisitadoId = null;
    }
  }

  onTipoEmpleadoChange(): void {
    // Limpia lo que se hubiera llenado del otro tipo, para no mandar los dos a la vez.
    this.req.empleadoVisitadoId = null;
    this.req.empleadoDirectoCedula = '';
    this.req.empleadoDirectoNombre = '';
    this.req.empleadoDirectoArea = undefined;
    this.concesionarioIdFiltro = null;
  }

  nombreVisitado(v: RegistroVisita): string {
    if (v.empleadoVisitado?.nombre) return v.empleadoVisitado.nombre;
    if (v.empleadoDirecto?.nombre) return v.empleadoDirecto.nombre + ' (directo del parque)';
    return '—';
  }

  cargar(): void {
    this.visitaService.activas().subscribe(data => this.activas = data);
    this.visitaService.listarTodas().subscribe(data => this.todas = data);
  }

  registrarIngreso(): void {
    this.visitaService.registrarIngreso(this.req).subscribe({
      next: () => {
        this.req = {
          nombreVisitante: '', documentoVisitante: '', empleadoVisitadoId: null,
          motivo: '', ingresaVehiculo: false, placaVehiculo: '', tipoVehiculo: '', zonaParqueo: ''
        };
        this.tipoEmpleado = 'sistema';
        this.concesionarioIdFiltro = null;
        this.toastService.exito('Ingreso de visitante registrado.');
        this.cargar();
      },
      error: (err) => this.toastService.error('No se pudo registrar: ' + (err.error?.message || err.message))
    });
  }

  registrarSalida(v: RegistroVisita): void {
    if (!v.id) return;
    this.visitaService.registrarSalida(v.id).subscribe({
      next: () => {
        this.toastService.exito('Salida registrada.');
        this.cargar();
      },
      error: (err) => this.toastService.error('No se pudo registrar la salida: ' + (err.error?.message || err.message))
    });
  }
}