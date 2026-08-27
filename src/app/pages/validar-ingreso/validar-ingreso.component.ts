import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngresoService } from '../../services/ingreso.service';
import { ResultadoValidacion } from '../../models/registro-ingreso.model';

@Component({
  selector: 'app-validar-ingreso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card card-central">
      <h2>Validar cédula</h2>
      <p class="ayuda">
        Digite o escanee la cédula.
      </p>

      <input
          #inputCedula
          type="text"
          placeholder="Número de cédula"
          [(ngModel)]="cedula"
          (keyup.enter)="validar()"
          [disabled]="buscando"
          class="input-cedula">

      <button
          type="button"
          (click)="validar()"
          [disabled]="buscando"
          class="btn-validar">
        {{ buscando ? 'Consultando...' : 'Validar' }}
      </button>

      <p *ngIf="buscando" class="ayuda">Consultando...</p>
      <p *ngIf="error" class="error-msg">{{ error }}</p>

      <div *ngIf="resultado" class="resultado" [ngClass]="claseResultado()">
        <h3>{{ tituloResultado() }}</h3>
        <p *ngIf="resultado.nombre"><strong>Nombre:</strong> {{ resultado.nombre }}</p>
        <p *ngIf="resultado.concesionario"><strong>Concesionario:</strong> {{ resultado.concesionario }}</p>
        <p><strong>Motivo:</strong> {{ resultado.motivo }}</p>
      </div>
    </div>
  `,
  styles: [`
    .card-central {
      max-width: 480px;
      margin: 40px auto;
      text-align: center;
    }
    .input-cedula {
      font-size: 22px;
      padding: 14px;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .btn-validar {
      margin-top: 12px;
      font-size: 18px;
      padding: 12px 24px;
      width: 100%;
      cursor: pointer;
    }
  `]
})
export class ValidarIngresoComponent implements AfterViewInit {
  cedula = '';
  resultado: ResultadoValidacion | null = null;
  buscando = false;
  error = '';

  @ViewChild('inputCedula') inputCedula!: ElementRef<HTMLInputElement>;

  constructor(private ingresoService: IngresoService) {}

  ngAfterViewInit(): void {
    this.enfocarInput();
  }

  validar(): void {
    if (!this.cedula.trim()) return;

    this.buscando = true;
    this.error = '';
    this.resultado = null;

    this.ingresoService.validarCedula(this.cedula.trim()).subscribe({
      next: (res) => {
        this.resultado = res;
        this.buscando = false;
        this.cedula = '';
        this.enfocarInput();
      },
      error: () => {
        this.error = 'No se pudo consultar el sistema. Verifica que el backend esté corriendo.';
        this.buscando = false;
        this.enfocarInput();
      }
    });
  }

  tituloResultado(): string {
    if (!this.resultado) return '';
    if (this.resultado.tipoMovimiento === 'SALIDA') return 'SALIDA REGISTRADA';
    return this.resultado.autorizado ? 'INGRESO AUTORIZADO' : 'INGRESO NO PERMITIDO';
  }

  claseResultado(): string {
    if (!this.resultado) return '';
    if (this.resultado.tipoMovimiento === 'SALIDA') return 'salida';
    return this.resultado.autorizado ? 'autorizado' : 'no-autorizado';
  }

  private enfocarInput(): void {
    setTimeout(() => this.inputCedula?.nativeElement.focus(), 0);
  }
}