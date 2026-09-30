import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <header class="topbar" *ngIf="!enPantallaLogin">
      <div class="topbar-marca">
        <img
            class="logo"
            src="https://parquedelcafe.co/wp-content/uploads/2021/05/Logo-Parque-Del-Cafe.png"
            alt="Logo Parque del Café">
        <h1>Control de Acceso</h1>
      </div>

      <nav>
        <!-- Las 4 pantallas públicas: siempre visibles, sin login. -->
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Validar ingreso</a>
        <a routerLink="/visitas" routerLinkActive="active">Visitantes</a>
        <a routerLink="/historial" routerLinkActive="active">Historial</a>
        <a routerLink="/historial-visitas" routerLinkActive="active">Historial visitas</a>

        <!-- Exclusivas de Admin: solo aparecen con sesión iniciada. -->
        <ng-container *ngIf="authService.estaAutenticado()">
          <a routerLink="/afiliaciones" routerLinkActive="active">Afiliaciones</a>
          <a routerLink="/empleados" routerLinkActive="active">Empleados</a>
          <a routerLink="/concesionarios" routerLinkActive="active">Concesionarios</a>
          <a routerLink="/calendario" routerLinkActive="active">Calendario</a>
        </ng-container>
      </nav>

      <div class="topbar-usuario" *ngIf="authService.estaAutenticado()">
        <span class="usuario-nombre">{{ authService.obtenerNombreMostrar() }}</span>
        <button type="button" (click)="cerrarSesion()">Cerrar sesión</button>
      </div>
    </header>

    <main [class.sin-topbar]="enPantallaLogin">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer" *ngIf="!enPantallaLogin">
      Sistema interno de control de acceso — Parque del Café
      <a *ngIf="!authService.estaAutenticado()" routerLink="/login" class="enlace-admin">Admin</a>
    </footer>

    <app-toast></app-toast>
  `,
  styles: [`
    .topbar-marca {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo {
      height: 40px;
      width: auto;
      background: #fff;
      border-radius: 6px;
      padding: 3px 6px;
    }
    .topbar-usuario {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .usuario-nombre {
      font-size: 13px;
      font-weight: 600;
    }
    .topbar-usuario button {
      background: rgba(255,255,255,0.15);
      color: white;
      border: 1px solid rgba(255,255,255,0.4);
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
    }
    .topbar-usuario button:hover {
      background: rgba(255,255,255,0.28);
    }
    main.sin-topbar {
      padding: 0 !important;
    }
    .footer {
      text-align: center;
      color: var(--pdc-texto-suave);
      font-size: 12px;
      padding: 20px;
      position: relative;
    }
    /* Enlace discreto al login: mismo tono apagado que el resto del pie
       de página, sin subrayado ni color llamativo -- a propósito, para
       que no sea el primer elemento en el que alguien se fije. */
    .enlace-admin {
      margin-left: 10px;
      color: inherit;
      opacity: 0.55;
      text-decoration: none;
      font-size: 11px;
    }
    .enlace-admin:hover {
      opacity: 0.9;
      text-decoration: underline;
    }
  `]
})
export class AppComponent {
  enPantallaLogin = false;

  constructor(
      public authService: AuthService,
      private router: Router
  ) {
    this.enPantallaLogin = this.router.url === '/login';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.enPantallaLogin = event.urlAfterRedirects === '/login';
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
