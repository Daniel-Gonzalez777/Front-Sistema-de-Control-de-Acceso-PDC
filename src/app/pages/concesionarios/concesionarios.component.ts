import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConcesionarioService } from '../../services/concesionario.service';
import { Concesionario } from '../../models/concesionario.model';

@Component({
  selector: 'app-concesionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>{{ editandoId ? 'Editar concesionario' : 'Nuevo concesionario' }}</h2>
      <form class="inline-form" (ngSubmit)="guardar()" #f="ngForm">
        <div>
          <label>Nombre</label>
          <input type="text" name="nombre" [(ngModel)]="form.nombre" required>
        </div>
        <div>
          <label>NIT</label>
          <input type="text" name="nit" [(ngModel)]="form.nit" required>
        </div>
        <div>
          <label>Estado</label>
          <select name="activo" [(ngModel)]="form.activo">
            <option [ngValue]="true">Activo</option>
            <option [ngValue]="false">Inactivo</option>
          </select>
        </div>
        <div>
          <button type="submit" [disabled]="!f.valid">{{ editandoId ? 'Guardar cambios' : 'Crear' }}</button>
          <button type="button" class="secondary" *ngIf="editandoId" (click)="cancelarEdicion()">Cancelar</button>
        </div>
      </form>
      <div *ngIf="error" class="error-msg">{{ error }}</div>
    </div>

    <div class="card">
      <h2>Concesionarios registrados</h2>
      <table>
        <thead>
          <tr><th>Nombre</th><th>NIT</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of concesionarios">
            <td>{{ c.nombre }}</td>
            <td>{{ c.nit }}</td>
            <td><span class="badge" [class.ok]="c.activo" [class.no]="!c.activo">{{ c.activo ? 'Activo' : 'Inactivo' }}</span></td>
            <td class="acciones">
              <button (click)="editar(c)">Editar</button>
              <button class="danger" (click)="eliminar(c)">Eliminar</button>
            </td>
          </tr>
          <tr *ngIf="!concesionarios.length"><td colspan="4">No hay concesionarios registrados todavía.</td></tr>
        </tbody>
      </table>
    </div>
  `
})
export class ConcesionariosComponent implements OnInit {
  concesionarios: Concesionario[] = [];
  form: Concesionario = { nombre: '', nit: '', activo: true };
  editandoId: number | null = null;
  error = '';

  constructor(private concesionarioService: ConcesionarioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.concesionarioService.listar().subscribe(data => this.concesionarios = data);
  }

  guardar(): void {
    this.error = '';
    const accion = this.editandoId
      ? this.concesionarioService.actualizar(this.editandoId, this.form)
      : this.concesionarioService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargar();
      },
      error: (err) => this.error = 'No se pudo guardar: ' + (err.error?.message || err.message)
    });
  }

  editar(c: Concesionario): void {
    this.editandoId = c.id ?? null;
    this.form = { ...c };
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.form = { nombre: '', nit: '', activo: true };
  }

  eliminar(c: Concesionario): void {
    if (!c.id) return;
    if (!confirm(`¿Eliminar el concesionario "${c.nombre}"? Esto puede fallar si ya tiene empleados asociados.`)) return;

    this.concesionarioService.eliminar(c.id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error = 'No se pudo eliminar: ' + (err.error?.message || err.message)
    });
  }
}
