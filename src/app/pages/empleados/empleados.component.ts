import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { ConcesionarioService } from '../../services/concesionario.service';
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
      <div *ngIf="error" class="error-msg">{{ error }}</div>
    </div>

    <div class="card">
      <h2>Empleados registrados</h2>
      <table>
        <thead>
          <tr><th>Cédula</th><th>Nombre</th><th>Cargo</th><th>Área</th><th>Concesionario</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let e of empleados">
            <td>{{ e.cedula }}</td>
            <td>{{ e.nombre }}</td>
            <td>{{ e.cargo || '—' }}</td>
            <td>{{ e.area || '—' }}</td>
            <td>{{ nombreConcesionario(e) }}</td>
            <td class="acciones"><button class="danger" (click)="eliminar(e)">Eliminar</button></td>
          </tr>
          <tr *ngIf="!empleados.length"><td colspan="6">No hay empleados registrados todavía.</td></tr>
        </tbody>
      </table>
    </div>
  `
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  concesionarios: Concesionario[] = [];
  concesionarioId: number | null = null;
  form = { cedula: '', nombre: '', cargo: '', area: '' };
  error = '';

  constructor(
    private empleadoService: EmpleadoService,
    private concesionarioService: ConcesionarioService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.concesionarioService.listar().subscribe(data => this.concesionarios = data);
  }

  cargar(): void {
    this.empleadoService.listar().subscribe(data => this.empleados = data);
  }

  nombreConcesionario(e: Empleado): string {
    const c: any = e.concesionario;
    if (c?.nombre) return c.nombre;
    const encontrado = this.concesionarios.find(x => x.id === c?.id);
    return encontrado ? encontrado.nombre : ('ID ' + c?.id);
  }

  crear(): void {
    if (!this.concesionarioId) return;
    this.error = '';

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
        this.cargar();
      },
      error: (err) => this.error = 'No se pudo crear (¿cédula duplicada?): ' + (err.error?.message || err.message)
    });
  }

  eliminar(e: Empleado): void {
    if (!e.id) return;
    if (!confirm(`¿Eliminar a "${e.nombre}"? Esto puede fallar si ya tiene afiliaciones o visitas asociadas.`)) return;

    this.empleadoService.eliminar(e.id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error = 'No se pudo eliminar: ' + (err.error?.message || err.message)
    });
  }
}
