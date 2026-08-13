import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AfiliacionService } from '../../services/afiliacion.service';
import { EmpleadoService } from '../../services/empleado.service';
import { ConcesionarioService } from '../../services/concesionario.service';
import { Afiliacion } from '../../models/afiliacion.model';
import { Empleado } from '../../models/empleado.model';
import { Concesionario } from '../../models/concesionario.model';
import { ResultadoCarga } from '../../models/resultado-carga.model';

@Component({
  selector: 'app-afiliaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- CARGA MASIVA -->
    <div class="card">
      <h2>Cargar plantilla mensual (Excel)</h2>
      <p class="ayuda">
        El concesionario sube su archivo <code>.xlsx</code> del mes. El sistema crea o
        actualiza automáticamente sus empleados y la afiliación de Salud, Pensión y ARL
        del mes actual.
      </p>

      <form class="inline-form" (ngSubmit)="subirPlantilla()">
        <div>
          <label>Concesionario</label>
          <select name="concesionarioIdCarga" [(ngModel)]="concesionarioIdCarga" required>
            <option [ngValue]="null" disabled>Seleccione...</option>
            <option *ngFor="let c of concesionarios" [ngValue]="c.id">{{ c.nombre }} ({{ c.nit }})</option>
          </select>
        </div>
        <div>
          <label>Archivo Excel (.xlsx)</label>
          <input
              type="file"
              id="archivoExcel"
              accept=".xlsx"
              (change)="onArchivoSeleccionado($event)"
              hidden>
          <label for="archivoExcel" class="btn-archivo">
            📎 {{ archivoSeleccionado ? archivoSeleccionado.name : 'Elegir archivo' }}
          </label>
        </div>
        <div>
          <button type="submit" [disabled]="!concesionarioIdCarga || !archivoSeleccionado || subiendo">
            {{ subiendo ? 'Procesando...' : 'Subir y procesar' }}
          </button>
        </div>
      </form>

      <div *ngIf="errorCarga" class="error-msg">{{ errorCarga }}</div>

      <div *ngIf="resultadoCarga" class="resumen-carga">
        <div class="resumen-badges">
          <span class="badge ok">{{ resultadoCarga.filasExitosas }} filas OK</span>
          <span class="badge" [class.no]="resultadoCarga.filasConError > 0">{{ resultadoCarga.filasConError }} con error</span>
          <span class="badge info">{{ resultadoCarga.empleadosCreados }} empleados nuevos</span>
          <span class="badge info">{{ resultadoCarga.empleadosActualizados }} actualizados</span>
        </div>
        <table *ngIf="resultadoCarga.errores.length">
          <thead><tr><th>Fila</th><th>Cédula</th><th>Problema</th></tr></thead>
          <tbody>
          <tr *ngFor="let e of resultadoCarga.errores">
            <td>{{ e.fila }}</td><td>{{ e.cedula || '(vacía)' }}</td><td>{{ e.mensaje }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CARGA MANUAL -->
    <div class="card">
      <h2>Cargar afiliación manual (caso puntual)</h2>
      <form class="inline-form" (ngSubmit)="crear()" #f="ngForm">
        <div>
          <label>Empleado</label>
          <select name="empleadoId" [(ngModel)]="empleadoId" required>
            <option [ngValue]="null" disabled>Seleccione...</option>
            <option *ngFor="let e of empleados" [ngValue]="e.id">{{ e.nombre }} ({{ e.cedula }})</option>
          </select>
        </div>
        <div><label>Año</label><input type="number" name="anio" [(ngModel)]="anio" required></div>
        <div><label>Mes</label><input type="number" name="mes" min="1" max="12" [(ngModel)]="mes" required></div>

        <div>
          <label>Afiliado Salud (EPS)</label>
          <select name="afiliadoSalud" [(ngModel)]="afiliadoSalud">
            <option [ngValue]="true">Sí</option><option [ngValue]="false">No</option>
          </select>
        </div>
        <div><label>Nombre EPS</label><input type="text" name="eps" [(ngModel)]="eps" [disabled]="!afiliadoSalud" placeholder="Ej: Sanitas EPS"></div>
        <div><label>Fecha afiliación Salud</label><input type="date" name="fechaSalud" [(ngModel)]="fechaAfiliacionSalud" [disabled]="!afiliadoSalud"></div>

        <div>
          <label>Afiliado Pensión (AFP)</label>
          <select name="afiliadoPension" [(ngModel)]="afiliadoPension">
            <option [ngValue]="true">Sí</option><option [ngValue]="false">No</option>
          </select>
        </div>
        <div><label>Nombre AFP</label><input type="text" name="afp" [(ngModel)]="afp" [disabled]="!afiliadoPension" placeholder="Ej: Porvenir"></div>
        <div><label>Fecha afiliación Pensión</label><input type="date" name="fechaPension" [(ngModel)]="fechaAfiliacionPension" [disabled]="!afiliadoPension"></div>

        <div>
          <label>Afiliado ARL</label>
          <select name="afiliadoARL" [(ngModel)]="afiliadoARL">
            <option [ngValue]="true">Sí</option><option [ngValue]="false">No</option>
          </select>
        </div>
        <div><label>Nombre ARL</label><input type="text" name="arl" [(ngModel)]="arl" [disabled]="!afiliadoARL" placeholder="Ej: ARL SURA"></div>
        <div><label>Fecha afiliación ARL</label><input type="date" name="fechaARL" [(ngModel)]="fechaAfiliacionARL" [disabled]="!afiliadoARL"></div>

        <div><button type="submit" [disabled]="!f.valid">Guardar</button></div>
      </form>
      <div *ngIf="error" class="error-msg">{{ error }}</div>
    </div>

    <!-- LISTADO -->
    <div class="card">
      <h2>Afiliaciones cargadas</h2>
      <table>
        <thead>
        <tr>
          <th>Empleado</th><th>Año</th><th>Mes</th>
          <th>Salud</th><th>EPS</th><th>Pensión</th><th>AFP</th><th>ARL</th><th>Nombre ARL</th><th>Cargado</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let a of afiliaciones">
          <td>{{ nombreEmpleado(a) }}</td>
          <td>{{ a.anio }}</td>
          <td>{{ a.mes }}</td>
          <td><span class="badge" [class.ok]="a.afiliadoSalud" [class.no]="!a.afiliadoSalud">{{ a.afiliadoSalud ? 'Sí' : 'No' }}</span></td>
          <td>{{ a.eps || '—' }}</td>
          <td><span class="badge" [class.ok]="a.afiliadoPension" [class.no]="!a.afiliadoPension">{{ a.afiliadoPension ? 'Sí' : 'No' }}</span></td>
          <td>{{ a.afp || '—' }}</td>
          <td><span class="badge" [class.ok]="a.afiliadoARL" [class.no]="!a.afiliadoARL">{{ a.afiliadoARL ? 'Sí' : 'No' }}</span></td>
          <td>{{ a.arl || '—' }}</td>
          <td>{{ a.fechaCarga | date:'short' }}</td>
        </tr>
        <tr *ngIf="!afiliaciones.length"><td colspan="10">No hay afiliaciones cargadas todavía.</td></tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .resumen-carga { margin-top: 16px; }
    .resumen-badges { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }

    .btn-archivo {
      display: block;
      background: white;
      color: #D3131C;
      border: 1.5px dashed #D3131C;
      padding: 8px 14px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .btn-archivo:hover {
      background: #D3131C;
      color: white;
    }
  `]
})
export class AfiliacionesComponent implements OnInit {
  afiliaciones: Afiliacion[] = [];
  empleados: Empleado[] = [];
  concesionarios: Concesionario[] = [];

  concesionarioIdCarga: number | null = null;
  archivoSeleccionado: File | null = null;
  subiendo = false;
  resultadoCarga: ResultadoCarga | null = null;
  errorCarga = '';

  empleadoId: number | null = null;
  anio = new Date().getFullYear();
  mes = new Date().getMonth() + 1;

  afiliadoSalud = true;
  eps = '';
  fechaAfiliacionSalud = '';
  afiliadoPension = true;
  afp = '';
  fechaAfiliacionPension = '';
  afiliadoARL = true;
  arl = '';
  fechaAfiliacionARL = '';

  error = '';

  constructor(
      private afiliacionService: AfiliacionService,
      private empleadoService: EmpleadoService,
      private concesionarioService: ConcesionarioService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.empleadoService.listar().subscribe(data => this.empleados = data);
    this.concesionarioService.listar().subscribe(data => this.concesionarios = data);
  }

  cargar(): void {
    this.afiliacionService.listar().subscribe(data => this.afiliaciones = data);
  }

  nombreEmpleado(a: Afiliacion): string {
    const e: any = a.empleado;
    if (e?.nombre) return e.nombre;
    const encontrado = this.empleados.find(x => x.id === e?.id);
    return encontrado ? encontrado.nombre : ('ID ' + e?.id);
  }

  onArchivoSeleccionado(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.archivoSeleccionado = input.files?.length ? input.files[0] : null;
  }

  subirPlantilla(): void {
    if (!this.concesionarioIdCarga || !this.archivoSeleccionado) return;

    this.subiendo = true;
    this.errorCarga = '';
    this.resultadoCarga = null;

    this.afiliacionService.cargarPlantilla(this.concesionarioIdCarga, this.archivoSeleccionado).subscribe({
      next: (res) => {
        this.resultadoCarga = res;
        this.subiendo = false;
        this.archivoSeleccionado = null;
        this.cargar();
      },
      error: (err) => {
        this.errorCarga = 'No se pudo procesar el archivo: ' + (err.error?.message || err.message);
        this.subiendo = false;
      }
    });
  }

  crear(): void {
    this.error = '';
    if (!this.empleadoId) return;

    const nueva: Afiliacion = {
      empleado: { id: this.empleadoId },
      anio: this.anio,
      mes: this.mes,
      afiliadoSalud: this.afiliadoSalud,
      eps: this.afiliadoSalud ? (this.eps || null) : null,
      fechaAfiliacionSalud: this.afiliadoSalud ? (this.fechaAfiliacionSalud || null) : null,
      afiliadoPension: this.afiliadoPension,
      afp: this.afiliadoPension ? (this.afp || null) : null,
      fechaAfiliacionPension: this.afiliadoPension ? (this.fechaAfiliacionPension || null) : null,
      afiliadoARL: this.afiliadoARL,
      arl: this.afiliadoARL ? (this.arl || null) : null,
      fechaAfiliacionARL: this.afiliadoARL ? (this.fechaAfiliacionARL || null) : null
    };

    this.afiliacionService.crear(nueva).subscribe({
      next: () => {
        this.empleadoId = null;
        this.eps = ''; this.fechaAfiliacionSalud = '';
        this.afp = ''; this.fechaAfiliacionPension = '';
        this.arl = ''; this.fechaAfiliacionARL = '';
        this.cargar();
      },
      error: (err) => this.error = 'No se pudo guardar (revisa si ya existe una afiliación para ese empleado/mes): ' + (err.error?.error || err.message)
    });
  }
}