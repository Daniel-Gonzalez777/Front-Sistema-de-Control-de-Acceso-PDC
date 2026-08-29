import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { ConcesionarioService } from '../../services/concesionario.service';
import { ToastService } from '../../services/toast.service';
import { Empleado } from '../../models/empleado.model';
import { Concesionario } from '../../models/concesionario.model';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Nuevo empleado</h2>
      <p class="ayuda">Normalmente los empleados se crean solos al cargar la plantilla Excel mensual (ver la sección Afiliaciones). Usa esto solo para casos puntuales.</p>
      <form class="inline-form" (ngSubmit)="crear()" #f="ngForm">
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
        <div>
          <button type="submit" [disabled]="!f.valid || !concesionarioId">Crear</button>
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
        Selecciona un concesionario arriba para ver su lista de empleados.
      </div>

      <table *ngIf="filtroConcesionarioId">
        <thead>
        <tr><th>Cédula</th><th>Nombre</th><th>Cargo</th><th>Área</th><th>Acciones</th></tr>
        </thead>
        <tbody>
        <tr *ngFor="let e of empleados">
          <td>{{ e.cedula }}</td>
          <td>{{ e.nombre }}</td>
          <td>{{ e.cargo || '—' }}</td>
          <td>{{ e.area || '—' }}</td>
          <td class="acciones"><button class="danger" (click)="eliminar(e)">Eliminar</button></td>
        </tr>
        <tr *ngIf="!empleados.length"><td colspan="5">Este concesionario no tiene empleados registrados todavía.</td></tr>
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
  form = { cedula: '', nombre: '', cargo: '', area: '' };

  constructor(
      private empleadoService: EmpleadoService,
      private concesionarioService: ConcesionarioService,
      private toastService: ToastService
  ) {}

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

  crear(): void {
    if (!this.concesionarioId) return;

    const nuevo: Empleado = {
      cedula: this.form.cedula,
      nombre: this.form.nombre,
      cargo: this.form.cargo || null,
      area: this.form.area || null,
      concesionario: { id: this.concesionarioId }
    };

    this.empleadoService.crear(nuevo).subscribe({
      next: () => {
        this.form = { cedula: '', nombre: '', cargo: '', area: '' };
        this.concesionarioId = null;
        this.toastService.exito('Empleado creado.');
        this.cargar();
      },
      error: (err) => this.toastService.error('No se pudo crear (¿cédula duplicada?): ' + (err.error?.message || err.message))
    });
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