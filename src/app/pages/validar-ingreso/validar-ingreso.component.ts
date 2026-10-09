
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngresoService } from '../../services/ingreso.service';
import { ResultadoValidacion } from '../../models/registro-ingreso.model';
import { ToastService } from '../../services/toast.service';

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
          class="input-cedula"
          autocomplete="off">

      <button
          type="button"
          (click)="validar()"
          [disabled]="buscando"
          class="btn-validar">
        {{ buscando ? 'Consultando...' : 'Validar' }}
      </button>

      <p *ngIf="buscando" class="ayuda">
        Consultando...
      </p>

      <div
          *ngIf="resultado"
          class="resultado"
          [ngClass]="claseResultado()">

        <h3>{{ tituloResultado() }}</h3>

        <p *ngIf="resultado.nombre">
          <strong>Nombre:</strong> {{ resultado.nombre }}
        </p>

        <p *ngIf="resultado.concesionario">
          <strong>Concesionario:</strong> {{ resultado.concesionario }}
        </p>

        <p>
          <strong>Motivo:</strong> {{ resultado.motivo }}
        </p>
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

  @ViewChild('inputCedula')
  inputCedula!: ElementRef<HTMLInputElement>;

  constructor(
      private ingresoService: IngresoService,
      private toastService: ToastService
  ) {}

  ngAfterViewInit(): void {
    this.enfocarInput();
  }

  /**
   * Extrae la cédula del texto completo del código de barras.
   * Toma las posiciones 9 a 18 y elimina los ceros iniciales.
   */
  private extraerCedula(texto: string): string {
    let textoLimpio = texto.trim();

    // Elimina posibles signos de apertura si vienen en la lectura.
    textoLimpio = textoLimpio.replace(/^[="'“”]+/, '');

    // Si el lector entregó el texto completo de la cédula.
    if (textoLimpio.length >= 18) {
      const fragmento = textoLimpio.slice(8, 18);

      // Elimina únicamente los ceros que estén al comienzo.
      const numero = fragmento.replace(/^0+/, '');

      return numero;
    }

    // Permite digitar manualmente una cédula.
    return textoLimpio.replace(/\D/g, '').replace(/^0+/, '');
  }

  validar(): void {
    if (this.buscando) return;

    const numeroCedula = this.extraerCedula(this.cedula);

    if (!numeroCedula) {
      this.toastService.error(
          'No se encontró un número de cédula válido.'
      );
      this.cedula = '';
      this.enfocarInput();
      return;
    }

    this.cedula = numeroCedula;
    this.buscando = true;
    this.resultado = null;

    this.ingresoService.validarCedula(numeroCedula).subscribe({
      next: (res) => {
        this.resultado = res;
        this.buscando = false;
        this.cedula = '';
        this.enfocarInput();
      },
      error: () => {
        this.toastService.error(
            'No se pudo consultar el sistema. Verifica que el backend esté corriendo.'
        );

        this.buscando = false;
        this.cedula = '';
        this.enfocarInput();
      }
    });
  }

  tituloResultado(): string {
    if (!this.resultado) return '';

    if (this.resultado.tipoMovimiento === 'SALIDA') {
      return 'SALIDA REGISTRADA';
    }

    return this.resultado.autorizado
        ? 'INGRESO AUTORIZADO'
        : 'INGRESO NO PERMITIDO';
  }

  claseResultado(): string {
    if (!this.resultado) return '';

    if (this.resultado.tipoMovimiento === 'SALIDA') {
      return 'salida';
    }

    return this.resultado.autorizado
        ? 'autorizado'
        : 'no-autorizado';
  }

  private enfocarInput(): void {
    setTimeout(() => this.inputCedula?.nativeElement.focus(), 0);
  }
}