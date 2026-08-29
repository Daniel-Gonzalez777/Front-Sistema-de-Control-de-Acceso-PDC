import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
          *ngFor="let m of toastService.mensajes()"
          class="toast"
          [class.error]="m.tipo === 'error'"
          [class.exito]="m.tipo === 'exito'"
          [class.info]="m.tipo === 'info'"
          (click)="toastService.cerrar(m.id)">
        <span class="icono">{{ m.tipo === 'error' ? '⚠' : m.tipo === 'exito' ? '✓' : 'ℹ' }}</span>
        <span class="texto">{{ m.texto }}</span>
        <span class="cerrar">✕</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      z-index: 9999;
      width: min(92vw, 440px);
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 10px;
      color: white;
      box-shadow: 0 8px 20px rgba(0,0,0,0.28);
      cursor: pointer;
      animation: toast-subir 0.25s ease-out;
      font-size: 14px;
      line-height: 1.4;
      pointer-events: auto;
    }
    .toast.error { background: #B3261E; }
    .toast.exito { background: #2E7D32; }
    .toast.info  { background: #37474F; }

    .icono { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
    .texto { flex: 1; }
    .cerrar { opacity: 0.75; font-size: 13px; flex-shrink: 0; margin-top: 2px; }

    @keyframes toast-subir {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .toast-container { bottom: 12px; width: 94vw; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
