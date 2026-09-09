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
        <a *ngIf="tieneRol('ADMIN','PORTERIA')" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Validar ingreso</a>
        <a *ngIf="tieneRol('ADMIN','PORTERIA')" routerLink="/visitas" routerLinkActive="active">Visitantes</a>
        <a *ngIf="tieneRol('ADMIN','CONCESIONARIO')" routerLink="/afiliaciones" routerLinkActive="active">Afiliaciones</a>
        <a *ngIf="tieneRol('ADMIN','CONCESIONARIO')" routerLink="/empleados" routerLinkActive="active">Empleados</a>
        <a *ngIf="tieneRol('ADMIN','CONCESIONARIO')" routerLink="/concesionarios" routerLinkActive="active">Concesionarios</a>
        <a routerLink="/historial" routerLinkActive="active">Historial</a>
        <a *ngIf="tieneRol('ADMIN','PORTERIA')" routerLink="/historial-visitas" routerLinkActive="active">Historial visitas</a>
        <a *ngIf="tieneRol('ADMIN','CONCESIONARIO')" routerLink="/calendario" routerLinkActive="active">Calendario</a>
      </nav>

      <div class="topbar-usuario">
        <span class="usuario-nombre">{{ authService.obtenerNombreMostrar() }}</span>
        <button type="button" (click)="cerrarSesion()">Cerrar sesión</button>
      </div>
    </header>

    <main [class.sin-topbar]="enPantallaLogin">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer" *ngIf="!enPantallaLogin">
      Sistema interno de control de acceso — Parque del Café
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

  tieneRol(...roles: ('ADMIN' | 'PORTERIA' | 'CONCESIONARIO')[]): boolean {
    return this.authService.tieneRol(...roles);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}