import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="topbar-marca">
        <img
          class="logo"
          src="https://parquedelcafe.co/wp-content/uploads/2021/05/Logo-Parque-Del-Cafe.png"
          alt="Logo Parque del Café">
        <h1>Control de Acceso</h1>
      </div>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Validar ingreso</a>
        <a routerLink="/visitas" routerLinkActive="active">Visitantes</a>
        <a routerLink="/afiliaciones" routerLinkActive="active">Afiliaciones</a>
        <a routerLink="/empleados" routerLinkActive="active">Empleados</a>
        <a routerLink="/concesionarios" routerLinkActive="active">Concesionarios</a>
        <a routerLink="/historial" routerLinkActive="active">Historial</a>
        <a routerLink="/historial-visitas" routerLinkActive="active">Historial visitas</a>
        <a routerLink="/calendario" routerLinkActive="active">Calendario</a>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      Sistema interno de control de acceso — Parque del Café
    </footer>
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
    .footer {
      text-align: center;
      color: var(--pdc-texto-suave);
      font-size: 12px;
      padding: 20px;
    }
  `]
})
export class AppComponent {}
