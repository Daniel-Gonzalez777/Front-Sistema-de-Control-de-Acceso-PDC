import { Injectable, signal } from '@angular/core';

export interface ToastMensaje {
  id: number;
  texto: string;
  tipo: 'error' | 'exito' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private contador = 0;
  mensajes = signal<ToastMensaje[]>([]);

  private mostrar(texto: string, tipo: ToastMensaje['tipo'], duracionMs: number): void {
    const id = ++this.contador;
    this.mensajes.update(lista => [...lista, { id, texto, tipo }]);
    setTimeout(() => this.cerrar(id), duracionMs);
  }

  error(texto: string): void {
    this.mostrar(texto, 'error', 6000);
  }

  exito(texto: string): void {
    this.mostrar(texto, 'exito', 3500);
  }

  info(texto: string): void {
    this.mostrar(texto, 'info', 4000);
  }

  cerrar(id: number): void {
    this.mensajes.update(lista => lista.filter(m => m.id !== id));
  }
}
