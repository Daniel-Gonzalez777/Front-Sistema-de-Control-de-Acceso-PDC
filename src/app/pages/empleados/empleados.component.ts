import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { ConcesionarioService } from '../../services/concesionario.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Empleado } from '../../models/empleado.model';
import { Concesionario } from '../../models/concesionario.model';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>{{ editandoId ? 'Editar empleado' : 'Nuevo empleado' }}</h2>
      <form class="inline-form" (ngSubmit)="guardar()" #f="ngForm">
        <div>
          <label>Cédula</label>
          <input type="text" name="cedula" [(ngModel)]="form.cedula" required>
        </div>
        <div>
          <label>Nombre</label>
          <input type="text" name="nombre" [(ngModel)]="form.nombre" required>
        </div>
        <div>
          <label>Cargo</label>
          <input type="text" name="cargo" [(ngModel)]="form.cargo">
        </div>
        <div>
          <label>Área</label>
          <input type="text" name="area" [(ngModel)]="form.area">
        </div>
        <div>
          <label>Concesionario</label>
          <select name="concesionarioId" [(ngModel)]="concesionarioId" required>
            <option [ngValue]="null" disabled>Seleccione...</option>
            <option *ngFor="let c of concesionarios" [ngValue]="c.id">{{ c.nombre }}</option>
          </select>
        </div>
        <div *ngIf="editandoId">
          <label>Estado</label>
          <select name="activo" [(ngModel)]="form.activo">
            <option [ngValue]="true">Activo</option>
            <option [ngValue]="false">Inactivo</option>
          </select>
        </div>
        <div>
          <button type="submit" [disabled]="!f.valid || !concesionarioId">{{ editandoId ? 'Guardar cambios' : 'Crear' }}</button>
          <button type="button" class="secondary" *ngIf="editandoId" (click)="cancelarEdicion()">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="card">
      <h2>Empleados por concesionario</h2>

      <div style="max-width:320px; margin-bottom:16px;">
        <label>Ver empleados de</label>
        <select [(ngModel)]="filtroConcesionarioId" (ngModelChange)="onFiltroChange()" name="filtroConcesionarioId">
          <option [ngValue]="null">Seleccione un concesionario...</option>
          <option *ngFor="let c of concesionarios" [ngValue]="c.id">{{ c.nombre }}</option>
        </select>
      </div>

      <div *ngIf="!filtroConcesionarioId" class="ayuda">
        Selecciona un concesionario para ver su lista de empleados.
      </div>

      <table *ngIf="filtroConcesionarioId">
        <thead>
        <tr><th>Cédula</th><th>Nombre</th><th>Cargo</th><th>Área</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        <tr *ngFor="let e of empleados">
          <td>{{ e.cedula }}</td>
          <td>{{ e.nombre }}</td>
          <td>{{ e.cargo || '—' }}</td>
          <td>{{ e.area || '—' }}</td>
          <td>
            <span class="badge" [class.ok]="e.activo !== false" [class.no]="e.activo === false">
              {{ e.activo === false ? 'Inactivo' : 'Activo' }}
            </span>
          </td>
          <td class="acciones">
            <ng-container *ngIf="esAdmin">
              <button (click)="editar(e)">Editar</button>
            </ng-container>
            <span *ngIf="!esAdmin">—</span>
          </td>
        </tr>
        <tr *ngIf="!empleados.length"><td colspan="6">Este concesionario no tiene empleados registrados todavía.</td></tr>
        </tbody>
      </table>
    </div>
  `
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  concesionarios: Concesionario[] = [];
  concesionarioId: number | null = null;
  filtroConcesionarioId: number | null = null;
  editandoId: number | null = null;

  form: { cedula: string; nombre: string; cargo: string; area: string; activo: boolean } = {
    cedula: '', nombre: '', cargo: '', area: '', activo: true
  };

  constructor(
      private empleadoService: EmpleadoService,
      private concesionarioService: ConcesionarioService,
      private toastService: ToastService,
      private authService: AuthService
  ) {}

  // Solo Admin puede editar o eliminar empleados. Concesionario sigue
  // pudiendo crear uno nuevo desde el formulario de arriba.
  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  ngOnInit(): void {
    this.concesionarioService.listar().subscribe(data => this.concesionarios = data);
  }

  onFiltroChange(): void {
    this.cargar();
  }

  cargar(): void {
    if (!this.filtroConcesionarioId) {
      this.empleados = [];
      return;
    }
    this.empleadoService.listarPorConcesionario(this.filtroConcesionarioId)
        .subscribe(data => this.empleados = data);
  }

  guardar(): void {
    if (!this.concesionarioId) return;

    const datos: Empleado = {
      cedula: this.form.cedula,
      nombre: this.form.nombre,
      cargo: this.form.cargo || null,
      area: this.form.area || null,
      concesionario: { id: this.concesionarioId },
      activo: this.form.activo
    };

    const esEdicion = !!this.editandoId;
    const accion = this.editandoId
        ? this.empleadoService.actualizar(this.editandoId, datos)
        : this.empleadoService.crear(datos);

    accion.subscribe({
      next: () => {
        this.toastService.exito(esEdicion ? 'Empleado actualizado.' : 'Empleado creado.');
        this.cancelarEdicion();
        this.cargar();
      },
      error: (err) => this.toastService.error(
          (esEdicion ? 'No se pudo actualizar: ' : 'No se pudo crear (¿cédula duplicada?): ')
          + (err.error?.message || err.message)
      )
    });
  }

  editar(e: Empleado): void {
    this.editandoId = e.id ?? null;
    this.concesionarioId = e.concesionario?.id ?? null;
    this.form = {
      cedula: e.cedula,
      nombre: e.nombre,
      cargo: e.cargo || '',
      area: e.area || '',
      activo: e.activo !== false
    };
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.concesionarioId = null;
    this.form = { cedula: '', nombre: '', cargo: '', area: '', activo: true };
  }

  eliminar(e: Empleado): void {
    if (!e.id) return;
    if (!confirm(`¿Eliminar a "${e.nombre}"? Esto puede fallar si ya tiene afiliaciones o visitas asociadas.`)) return;

    this.empleadoService.eliminar(e.id).subscribe({
      next: () => {
        this.toastService.exito('Empleado eliminado.');
        this.cargar();
      },
      error: (err) => this.toastService.error('No se pudo eliminar: ' + (err.error?.message || err.message))
    });
  }
}