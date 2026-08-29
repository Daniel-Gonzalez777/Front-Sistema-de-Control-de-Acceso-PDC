import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitaService } from '../../services/visita.service';
import { EmpleadoService } from '../../services/empleado.service';
import { EmpleadoDirectoService } from '../../services/empleado-directo.service';
import { VisitanteService } from '../../services/visitante.service';
import { ConcesionarioService } from '../../services/concesionario.service';
import { RegistroVisita, Visitante } from '../../models/visita.model';
import { Empleado } from '../../models/empleado.model';
import { Concesionario } from '../../models/concesionario.model';
import { EmpleadoDirectoParque } from '../../models/empleado-directo.model';

@Component({
    selector: 'app-historial-visitas',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <!-- Historial de visitas RECIBIDAS por un empleado -->
        <div class="card">
            <h2>Historial de visitas por empleado</h2>

            <div class="inline-form" style="margin-bottom:16px;">
                <div>
                    <label>Tipo de empleado</label>
                    <select [(ngModel)]="tipoEmpleado" (ngModelChange)="onTipoEmpleadoChange()">
                        <option value="sistema">Empleado del sistema</option>
                        <option value="directo">Empleado directo del Parque</option>
                    </select>
                </div>

                <div *ngIf="tipoEmpleado === 'sistema'">
                    <label>Concesionario (empresa)</label>
                    <select [(ngModel)]="concesionarioFiltroId" (ngModelChange)="onConcesionarioFiltroChange()">
                        <option [ngValue]="null">Todas las empresas</option>
                        <option *ngFor="let c of concesionarios" [ngValue]="c.id">{{ c.nombre }}</option>
                    </select>
                </div>

                <div *ngIf="tipoEmpleado === 'sistema'">
                    <label>Empleado</label>
                    <select [(ngModel)]="empleadoSeleccionadoId" (ngModelChange)="cargarHistorialEmpleado()">
                        <option [ngValue]="null">Seleccione...</option>
                        <option *ngFor="let e of empleadosFiltrados" [ngValue]="e.id">{{ e.nombre }} ({{ e.cedula }})</option>
                    </select>
                </div>

                <div *ngIf="tipoEmpleado === 'directo'">
                    <label>Empleado directo</label>
                    <select [(ngModel)]="empleadoDirectoSeleccionadoId" (ngModelChange)="cargarHistorialEmpleadoDirecto()">
                        <option [ngValue]="null">Seleccione...</option>
                        <option *ngFor="let e of empleadosDirectos" [ngValue]="e.id">{{ e.nombre }} ({{ e.cedula }}) — {{ e.area }}</option>
                    </select>
                </div>
            </div>

            <div *ngIf="!huboBusquedaEmpleado" class="ayuda">
                Selecciona un empleado arriba para ver las visitas que ha recibido.
            </div>

            <table *ngIf="huboBusquedaEmpleado">
                <thead>
                <tr><th>Visitante</th><th>Documento</th><th>Motivo</th><th>Entrada</th><th>Salida</th><th>Vehiculo</th><th>Tipo</th><th>Placa</th></tr>
                </thead>
                <tbody>
                <tr *ngFor="let v of historialEmpleado">
                    <td>{{ v.visitante.nombre }}</td>
                    <td>{{ v.visitante.documento }}</td>
                    <td>{{ v.motivo || '—' }}</td>
                    <td>{{ v.fechaHoraEntrada | date:'short' }}</td>
                    <td>{{ v.fechaHoraSalida ? (v.fechaHoraSalida | date:'short') : '— sigue dentro —' }}</td>
                    <td>{{v.ingresaVehiculo ? 'Si' : 'No' }}</td>
                    <td>{{v.tipoVehiculo}}</td>
                    <td>{{v.placaVehiculo}}</td>
                </tr>
                <tr *ngIf="!historialEmpleado.length">
                    <td colspan="5">Este empleado no ha recibido visitas todavía.</td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- Historial de visitas HECHAS por un visitante -->
        <div class="card">
            <h2>Historial de visitas por visitante</h2>

            <div class="inline-form" style="margin-bottom:16px;">
                <div>
                    <label>Visitante</label>
                    <select [(ngModel)]="visitanteSeleccionadoId" (ngModelChange)="cargarHistorialVisitante()">
                        <option [ngValue]="null">Seleccione...</option>
                        <option *ngFor="let v of visitantes" [ngValue]="v.id">{{ v.nombre }} ({{ v.documento }})</option>
                    </select>
                </div>
            </div>

            <div *ngIf="!visitanteSeleccionadoId" class="ayuda">
                Selecciona un visitante arriba para ver todas las visitas que ha hecho al Parque.
            </div>

            <table *ngIf="visitanteSeleccionadoId">
                <thead>
                <tr><th>Visitó a</th><th>Motivo</th><th>Entrada</th><th>Salida</th><th>Vehiculo</th><th>Tipo</th><th>Placa</th></tr>
                </thead>
                <tbody>
                <tr *ngFor="let v of historialVisitante">
                    <td>{{ nombreVisitado(v) }}</td>
                    <td>{{ v.motivo || '—' }}</td>
                    <td>{{ v.fechaHoraEntrada | date:'short' }}</td>
                    <td>{{ v.fechaHoraSalida ? (v.fechaHoraSalida | date:'short') : '— sigue dentro —' }}</td>
                    <td>{{v.ingresaVehiculo ? 'Si' : 'No' }}</td>
                    <td>{{v.tipoVehiculo}}</td>
                    <td>{{v.placaVehiculo}}</td>
                </tr>
                <tr *ngIf="!historialVisitante.length">
                    <td colspan="4">Este visitante no tiene visitas registradas todavía.</td>
                </tr>
                </tbody>
            </table>
        </div>
    `
})
export class HistorialVisitasComponent implements OnInit {
    empleados: Empleado[] = [];
    empleadosDirectos: EmpleadoDirectoParque[] = [];
    visitantes: Visitante[] = [];
    concesionarios: Concesionario[] = [];

    tipoEmpleado: 'sistema' | 'directo' = 'sistema';
    concesionarioFiltroId: number | null = null;
    empleadoSeleccionadoId: number | null = null;
    empleadoDirectoSeleccionadoId: number | null = null;
    visitanteSeleccionadoId: number | null = null;

    historialEmpleado: RegistroVisita[] = [];
    historialVisitante: RegistroVisita[] = [];
    huboBusquedaEmpleado = false;

    constructor(
        private visitaService: VisitaService,
        private empleadoService: EmpleadoService,
        private empleadoDirectoService: EmpleadoDirectoService,
        private visitanteService: VisitanteService,
        private concesionarioService: ConcesionarioService
    ) {}

    ngOnInit(): void {
        this.empleadoService.listar().subscribe(data => this.empleados = data);
        this.empleadoDirectoService.listar().subscribe(data => this.empleadosDirectos = data);
        this.visitanteService.listar().subscribe(data => this.visitantes = data);
        this.concesionarioService.listar().subscribe(data => this.concesionarios = data);
    }

    // Solo los empleados de la empresa seleccionada (o todos, si no se eligió ninguna).
    get empleadosFiltrados(): Empleado[] {
        if (!this.concesionarioFiltroId) return this.empleados;
        return this.empleados.filter(e => e.concesionario?.id === this.concesionarioFiltroId);
    }

    onConcesionarioFiltroChange(): void {
        // Si el empleado que tenías elegido ya no pertenece a la empresa filtrada, se limpia.
        if (this.empleadoSeleccionadoId && !this.empleadosFiltrados.some(e => e.id === this.empleadoSeleccionadoId)) {
            this.empleadoSeleccionadoId = null;
            this.historialEmpleado = [];
            this.huboBusquedaEmpleado = false;
        }
    }

    onTipoEmpleadoChange(): void {
        this.concesionarioFiltroId = null;
        this.empleadoSeleccionadoId = null;
        this.empleadoDirectoSeleccionadoId = null;
        this.historialEmpleado = [];
        this.huboBusquedaEmpleado = false;
    }

    cargarHistorialEmpleado(): void {
        this.huboBusquedaEmpleado = !!this.empleadoSeleccionadoId;
        if (!this.empleadoSeleccionadoId) { this.historialEmpleado = []; return; }
        this.visitaService.historialPorEmpleado(this.empleadoSeleccionadoId)
            .subscribe(data => this.historialEmpleado = data);
    }

    cargarHistorialEmpleadoDirecto(): void {
        this.huboBusquedaEmpleado = !!this.empleadoDirectoSeleccionadoId;
        if (!this.empleadoDirectoSeleccionadoId) { this.historialEmpleado = []; return; }
        this.visitaService.historialPorEmpleadoDirecto(this.empleadoDirectoSeleccionadoId)
            .subscribe(data => this.historialEmpleado = data);
    }

    cargarHistorialVisitante(): void {
        if (!this.visitanteSeleccionadoId) { this.historialVisitante = []; return; }
        this.visitaService.historialPorVisitante(this.visitanteSeleccionadoId)
            .subscribe(data => this.historialVisitante = data);
    }

    nombreVisitado(v: RegistroVisita): string {
        if (v.empleadoVisitado?.nombre) return v.empleadoVisitado.nombre;
        if (v.empleadoDirecto?.nombre) return v.empleadoDirecto.nombre + ' (directo del parque)';
        return '—';
    }
}