
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
        Escanee el código de barras o digite el número de cédula.
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

      <!-- Teclado numérico -->
      <div class="teclado-numerico">
        <button
            *ngFor="let numero of numeros"
            type="button"
            class="tecla"
            [disabled]="buscando"
            (click)="agregarNumero(numero)">
          {{ numero }}
        </button>

        <button
            type="button"
            class="tecla tecla-borrar"
            [disabled]="buscando"
            (click)="borrarTodo()">
          Borrar
        </button>

        <button
            type="button"
            class="tecla"
            [disabled]="buscando"
            (click)="agregarNumero('0')">
          0
        </button>

        <button
            type="button"
            class="tecla tecla-borrar"
            aria-label="Borrar último dígito"
            [disabled]="buscando"
            (click)="borrarUltimo()">
          ⌫
        </button>
      </div>

      <button
          type="button"
          (click)="validar()"
          [disabled]="buscando"
          class="btn-validar">
        {{ buscando ? 'Consultando...' : 'Validar ingreso' }}
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
          <strong>Concesionario:</strong>
          {{ resultado.concesionario }}
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
      margin-bottom: 16px;
    }

    .teclado-numerico {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      max-width: 330px;
      margin: 0 auto;
    }

    .tecla {
      min-height: 58px;
      border: 1px solid #d0d0d0;
      border-radius: 10px;
      background: #f5f5f5;
      color: #222;
      font-size: 24px;
      font-weight: 600;
      cursor: pointer;
      touch-action: manipulation;
    }

    .tecla:hover:not(:disabled) {
      background: #e5e5e5;
    }

    .tecla:active:not(:disabled) {
      transform: scale(0.97);
    }

    .tecla-borrar {
      font-size: 16px;
    }

    .btn-validar {
      margin-top: 16px;
      font-size: 18px;
      padding: 14px 24px;
      width: 100%;
      cursor: pointer;
    }

    .tecla:disabled,
    .btn-validar:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 400px) {
      .card-central {
        margin: 20px 10px;
      }

      .tecla {
        min-height: 52px;
      }
    }
  `]
})
export class ValidarIngresoComponent implements AfterViewInit {

  cedula = '';
  resultado: ResultadoValidacion | null = null;
  buscando = false;

  numeros = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9'
  ];

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
   * Extrae los caracteres de las posiciones 9 a 18
   * cuando se recibe el texto completo del código de barras.
   *
   * Si se digita manualmente, conserva solamente los números.
   * En ambos casos elimina los ceros iniciales.
   */
  private extraerCedula(texto: string): string {
    const textoLimpio = texto.trim().replace(/^[="'“”]+/, '');

    // Lectura completa del código de barras.
    if (textoLimpio.length >= 18) {
      const fragmento = textoLimpio.slice(8, 18);

      return fragmento
          .replace(/\D/g, '')
          .replace(/^0+/, '');
    }

    // Cédula digitada manualmente o ingresada con el teclado.
    return textoLimpio
        .replace(/\D/g, '')
        .replace(/^0+/, '');
  }

  agregarNumero(numero: string): void {
    if (this.buscando) return;

    this.cedula += numero;
    this.resultado = null;
    this.enfocarInput();
  }

  borrarUltimo(): void {
    if (this.buscando) return;

    this.cedula = this.cedula.slice(0, -1);
    this.resultado = null;
    this.enfocarInput();
  }

  borrarTodo(): void {
    if (this.buscando) return;

    this.cedula = '';
    this.resultado = null;
    this.enfocarInput();
  }

  validar(): void {
    if (this.buscando) return;

    const numeroCedula = this.extraerCedula(this.cedula);

    if (!numeroCedula) {
      this.toastService.error(
          'Ingrese o escanee un número de cédula válido.'
      );

      this.cedula = '';
      this.enfocarInput();
      return;
    }

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
            'No se pudo consultar el sistema. Verifica que el backend esté disponible.'
        );

        this.buscando = false;
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
    setTimeout(() => {
      this.inputCedula?.nativeElement.focus();
    }, 0);
  }
}
