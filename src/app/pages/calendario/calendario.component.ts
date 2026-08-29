import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarioService } from '../../services/calendario.service';
import { ConcesionarioService } from '../../services/concesionario.service';
import { Concesionario } from '../../models/concesionario.model';
import { CalendarioMensual, DiaCalendario, MovimientoCalendario } from '../../models/calendario.model';
import { ToastService } from '../../services/toast.service';

const NOMBRES_MES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const NOMBRES_DIA_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Una celda de la cuadrícula: puede estar vacía (relleno antes del día 1
// o después del último día) o corresponder a un día real del mes.
interface CeldaCalendario {
  dia: number | null;
  totalEntradas: number;
  totalSalidas: number;
  totalNoAutorizados: number;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Calendario de accesos por empresa</h2>
      <p class="ayuda">
        Selecciona la empresa (concesionario) y el mes. La información nunca se
        mezcla entre empresas distintas.
      </p>

      <div class="controles">
        <div>
          <label>Empresa</label>
          <select [(ngModel)]="concesionarioId" (ngModelChange)="cargar()">
            <option [ngValue]="null" disabled>Seleccione...</option>
            <option *ngFor="let c of concesionarios" [ngValue]="c.id">{{ c.nombre }} ({{ c.nit }})</option>
          </select>
        </div>

        <div class="navegacion-mes">
          <button type="button" (click)="mesAnterior()">‹</button>
          <span class="mes-actual">{{ nombreMesActual() }} {{ anio }}</span>
          <button type="button" (click)="mesSiguiente()">›</button>
        </div>

        <div>
          <button type="button" [disabled]="!concesionarioId || exportando" (click)="exportar()">
            {{ exportando ? 'Generando...' : '⬇ Exportar Excel' }}
          </button>
        </div>
      </div>

      <p *ngIf="cargando" class="ayuda">Cargando calendario...</p>

      <div *ngIf="!cargando && concesionarioId" class="grid-calendario">
        <div class="celda-encabezado" *ngFor="let nombreDia of NOMBRES_DIA_SEMANA">{{ nombreDia }}</div>

        <div
            *ngFor="let celda of celdas"
            class="celda-dia"
            [class.vacia]="celda.dia === null"
            [class.seleccionada]="celda.dia === diaSeleccionado"
            [class.tiene-movimientos]="celda.dia !== null && (celda.totalEntradas + celda.totalSalidas) > 0"
            (click)="celda.dia !== null && seleccionarDia(celda.dia)">
          <ng-container *ngIf="celda.dia !== null">
            <div class="numero-dia">{{ celda.dia }}</div>
            <div class="resumen-dia" *ngIf="celda.totalEntradas + celda.totalSalidas > 0">
              <span class="badge-mini ok" *ngIf="celda.totalEntradas">{{ celda.totalEntradas }}↓</span>
              <span class="badge-mini salida" *ngIf="celda.totalSalidas">{{ celda.totalSalidas }}↑</span>
              <span class="badge-mini no" *ngIf="celda.totalNoAutorizados">{{ celda.totalNoAutorizados }}✕</span>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Detalle del día seleccionado -->
      <div *ngIf="diaSeleccionado && movimientosDelDiaSeleccionado.length" class="detalle-dia">
        <h3>{{ diaSeleccionado }} de {{ nombreMesActual() }} — {{ movimientosDelDiaSeleccionado.length }} movimiento(s)</h3>
        <table>
          <thead>
          <tr><th>Hora</th><th>Empleado</th><th>Cédula</th><th>Movimiento</th><th>Resultado</th><th>Motivo</th></tr>
          </thead>
          <tbody>
          <tr *ngFor="let m of movimientosDelDiaSeleccionado">
            <td>{{ m.hora.substring(0, 5) }}</td>
            <td>{{ m.nombreEmpleado || '(no registrado)' }}</td>
            <td>{{ m.cedula }}</td>
            <td>{{ m.tipoMovimiento }}</td>
            <td>
              <span class="badge" [class.ok]="m.resultado === 'AUTORIZADO'" [class.no]="m.resultado === 'NO_AUTORIZADO'">
                {{ m.resultado === 'AUTORIZADO' ? 'Autorizado' : 'No autorizado' }}
              </span>
            </td>
            <td>{{ m.motivo || '—' }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!cargando && concesionarioId && diaSeleccionado && !movimientosDelDiaSeleccionado.length" class="ayuda">
        Ese día no tuvo movimientos.
      </p>
    </div>
  `,
  styles: [`
    .controles {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: flex-end;
      margin-bottom: 20px;
    }
    .navegacion-mes {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .navegacion-mes button {
      font-size: 18px;
      padding: 4px 12px;
      cursor: pointer;
    }
    .mes-actual {
      font-weight: bold;
      min-width: 160px;
      text-align: center;
    }

    .grid-calendario {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }
    .celda-encabezado {
      text-align: center;
      font-weight: bold;
      padding: 6px 0;
      color: #D3131C;
    }
    .celda-dia {
      min-height: 70px;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 6px;
      box-sizing: border-box;
    }
    .celda-dia.vacia {
      border-color: transparent;
    }
    .celda-dia.tiene-movimientos {
      cursor: pointer;
      background: #fff7f7;
    }
    .celda-dia.tiene-movimientos:hover {
      background: #ffecec;
    }
    .celda-dia.seleccionada {
      outline: 2px solid #D3131C;
    }
    .numero-dia {
      font-size: 13px;
      font-weight: 600;
      color: #444;
    }
    .resumen-dia {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      margin-top: 4px;
    }
    .badge-mini {
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 8px;
      color: white;
    }
    .badge-mini.ok { background: #2e7d32; }
    .badge-mini.salida { background: #1565c0; }
    .badge-mini.no { background: #c62828; }

    .detalle-dia {
      margin-top: 24px;
    }
  `]
})
export class CalendarioComponent implements OnInit {
  NOMBRES_DIA_SEMANA = NOMBRES_DIA_SEMANA;

  concesionarios: Concesionario[] = [];
  concesionarioId: number | null = null;

  anio = new Date().getFullYear();
  mes = new Date().getMonth() + 1; // 1-12

  calendario: CalendarioMensual | null = null;
  celdas: CeldaCalendario[] = [];

  diaSeleccionado: number | null = null;
  movimientosDelDiaSeleccionado: MovimientoCalendario[] = [];

  cargando = false;
  exportando = false;

  constructor(
      private calendarioService: CalendarioService,
      private concesionarioService: ConcesionarioService,
      private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.concesionarioService.listar().subscribe(data => this.concesionarios = data);
  }

  nombreMesActual(): string {
    return NOMBRES_MES[this.mes - 1];
  }

  mesAnterior(): void {
    this.mes--;
    if (this.mes < 1) { this.mes = 12; this.anio--; }
    this.cargar();
  }

  mesSiguiente(): void {
    this.mes++;
    if (this.mes > 12) { this.mes = 1; this.anio++; }
    this.cargar();
  }

  cargar(): void {
    if (!this.concesionarioId) return;

    this.cargando = true;
    this.diaSeleccionado = null;
    this.movimientosDelDiaSeleccionado = [];

    this.calendarioService.obtener(this.concesionarioId, this.anio, this.mes).subscribe({
      next: (data) => {
        this.calendario = data;
        this.construirCeldas();
        this.cargando = false;
      },
      error: (err) => {
        this.toastService.error('No se pudo cargar el calendario: ' + (err.error?.message || err.message));
        this.cargando = false;
      }
    });
  }

  private construirCeldas(): void {
    this.celdas = [];
    if (!this.calendario) return;

    const primerDiaSemana = new Date(this.anio, this.mes - 1, 1).getDay(); // 0=Dom
    const diasEnMes = new Date(this.anio, this.mes, 0).getDate();

    const movimientosPorDia = new Map<number, DiaCalendario>();
    for (const d of this.calendario.dias) {
      movimientosPorDia.set(d.dia, d);
    }

    // Relleno antes del día 1
    for (let i = 0; i < primerDiaSemana; i++) {
      this.celdas.push({ dia: null, totalEntradas: 0, totalSalidas: 0, totalNoAutorizados: 0 });
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const diaData = movimientosPorDia.get(dia);
      let totalEntradas = 0, totalSalidas = 0, totalNoAutorizados = 0;

      if (diaData) {
        for (const m of diaData.movimientos) {
          if (m.resultado === 'NO_AUTORIZADO') { totalNoAutorizados++; continue; }
          if (m.tipoMovimiento === 'ENTRADA') totalEntradas++;
          else totalSalidas++;
        }
      }

      this.celdas.push({ dia, totalEntradas, totalSalidas, totalNoAutorizados });
    }
  }

  seleccionarDia(dia: number): void {
    this.diaSeleccionado = dia;
    const diaData = this.calendario?.dias.find(d => d.dia === dia);
    this.movimientosDelDiaSeleccionado = diaData ? diaData.movimientos : [];
  }

  exportar(): void {
    if (!this.concesionarioId) return;

    this.exportando = true;
    this.calendarioService.exportar(this.concesionarioId, this.anio, this.mes).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const nombreEmpresa = this.concesionarios.find(c => c.id === this.concesionarioId)?.nombre || 'empresa';
        a.href = url;
        a.download = `calendario_${nombreEmpresa}_${this.anio}_${String(this.mes).padStart(2, '0')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.exportando = false;
        this.toastService.exito('Calendario exportado.');
      },
      error: (err) => {
        this.toastService.error('No se pudo exportar: ' + (err.error?.message || err.message));
        this.exportando = false;
      }
    });
  }
}
