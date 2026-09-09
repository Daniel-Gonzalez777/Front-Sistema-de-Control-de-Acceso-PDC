import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],

    template: `
        <div class="login-fondo">

            <!-- Fondo decorativo -->
            <div class="circulo circulo-1"></div>
            <div class="circulo circulo-2"></div>
            <div class="circulo circulo-3"></div>

            <div class="login-contenedor">

                <!-- Panel izquierdo -->
                <div class="panel-informacion">

                    <div class="marca">
                        <img
                                src="https://parquedelcafe.co/wp-content/uploads/2021/05/Logo-Parque-Del-Cafe.png"
                                alt="Parque del Café">
                    </div>

                    <div class="informacion-centro">
                        <span class="etiqueta">SISTEMA INTERNO</span>

                        <h1>
                            Control de<br>
                            <span>Acceso</span>
                        </h1>

                        <p>
                            Gestión segura de ingreso para colaboradores
                            y concesionarios del Parque del Café.
                        </p>

                        <div class="linea-decorativa"></div>
                    </div>

                    <div class="informacion-pie">
                        <span class="punto"></span>
                        Sistema protegido
                    </div>

                </div>


                <!-- Tarjeta de login -->
                <div class="login-card">

                    <div class="login-header">

                        <div class="icono-login">
                            <span>🔐</span>
                        </div>

                        <h2>Bienvenido</h2>

                        <p>
                            Ingresa tus credenciales para continuar
                        </p>

                    </div>


                    <form
                            (ngSubmit)="ingresar()"
                            #f="ngForm"
                            autocomplete="off"
                    >

                        <!-- Usuario -->
                        <div class="campo">

                            <label for="username">
                                Usuario
                            </label>

                            <div class="input-contenedor">

                <span class="input-icono">
                  👤
                </span>

                                <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        [(ngModel)]="username"
                                        required
                                        [disabled]="cargando"
                                        autocomplete="username"
                                        placeholder="Ingresa tu usuario"
                                        autofocus
                                >

                            </div>

                        </div>


                        <!-- Contraseña -->
                        <div class="campo">

                            <label for="password">
                                Contraseña
                            </label>

                            <div class="input-contenedor">

                <span class="input-icono">
                  🔑
                </span>

                                <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        [(ngModel)]="password"
                                        required
                                        [disabled]="cargando"
                                        autocomplete="current-password"
                                        placeholder="Ingresa tu contraseña"
                                >

                            </div>

                        </div>


                        <!-- Error -->
                        <div
                                *ngIf="error"
                                class="login-error"
                        >
                            <span class="error-icono">!</span>
                            <span>{{ error }}</span>
                        </div>


                        <!-- Botón -->
                        <button
                                type="submit"
                                [disabled]="cargando || !f.valid"
                                class="btn-ingresar"
                        >

              <span *ngIf="!cargando">
                Ingresar al sistema
              </span>

                            <span
                                    *ngIf="cargando"
                                    class="cargando"
                            >
                <span class="spinner"></span>
                Verificando...
              </span>

                            <span
                                    *ngIf="!cargando"
                                    class="flecha"
                            >
                →
              </span>

                        </button>

                    </form>


                    <div class="separador"></div>


                    <div class="login-footer">

                        <span class="candado">🔒</span>

                        <span>
              Acceso restringido a personal autorizado
            </span>

                    </div>

                </div>

            </div>


            <!-- Pie de página -->
            <div class="copyright">
                Sistema de Control de Acceso · Parque del Café
            </div>

        </div>
    `,

    styles: [`

        /* =========================================================
           CONTENEDOR PRINCIPAL
        ========================================================= */

        .login-fondo {
            min-height: 100vh;
            width: 100%;
            position: relative;
            overflow: hidden;

            display: flex;
            align-items: center;
            justify-content: center;

            box-sizing: border-box;

            padding: 40px 25px;

            background:
                    radial-gradient(
                            circle at 15% 20%,
                            rgba(207, 166, 86, 0.18),
                            transparent 30%
                    ),
                    radial-gradient(
                            circle at 85% 80%,
                            rgba(166, 67, 47, 0.22),
                            transparent 35%
                    ),
                    linear-gradient(
                            135deg,
                            #32130e 0%,
                            var(--pdc-cafe-rojo) 45%,
                            var(--pdc-cafe-medio) 100%
                    );
        }


        /* =========================================================
           CÍRCULOS DECORATIVOS
        ========================================================= */

        .circulo {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;

            filter: blur(1px);

            animation: flotar 8s ease-in-out infinite;
        }

        .circulo-1 {
            width: 420px;
            height: 420px;

            top: -220px;
            left: -180px;

            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.025);
        }

        .circulo-2 {
            width: 300px;
            height: 300px;

            right: -130px;
            bottom: -100px;

            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.025);

            animation-delay: -3s;
        }

        .circulo-3 {
            width: 160px;
            height: 160px;

            right: 15%;
            top: 10%;

            border: 1px solid rgba(255,255,255,0.06);

            animation-delay: -5s;
        }


        @keyframes flotar {

            0%, 100% {
                transform: translateY(0) rotate(0deg);
            }

            50% {
                transform: translateY(-18px) rotate(5deg);
            }

        }


        /* =========================================================
           CONTENEDOR
        ========================================================= */

        .login-contenedor {
            position: relative;
            z-index: 2;

            width: 100%;
            max-width: 1050px;

            display: grid;
            grid-template-columns: 1fr 430px;

            border-radius: 26px;

            overflow: hidden;

            background: rgba(255,255,255,0.08);

            border: 1px solid rgba(255,255,255,0.18);

            box-shadow:
                    0 35px 80px rgba(0,0,0,0.38),
                    0 10px 25px rgba(0,0,0,0.15);

            backdrop-filter: blur(14px);

            animation: aparecer 0.8s ease-out;
        }


        @keyframes aparecer {

            from {
                opacity: 0;
                transform: translateY(25px) scale(0.98);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

        }


        /* =========================================================
           PANEL IZQUIERDO
        ========================================================= */

        .panel-informacion {
            min-height: 560px;

            padding: 45px;

            display: flex;
            flex-direction: column;
            justify-content: space-between;

            box-sizing: border-box;

            background:
                    linear-gradient(
                            145deg,
                            rgba(47, 19, 14, 0.72),
                            rgba(117, 48, 35, 0.55)
                    );
        }


        .marca img {
            width: 170px;
            height: auto;

            background: white;

            border-radius: 10px;

            padding: 8px 12px;

            box-sizing: border-box;

            box-shadow:
                    0 8px 20px rgba(0,0,0,0.15);
        }


        .informacion-centro {
            max-width: 430px;

            animation: aparecerTexto 1s ease-out 0.2s both;
        }


        @keyframes aparecerTexto {

            from {
                opacity: 0;
                transform: translateX(-20px);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }

        }


        .etiqueta {
            display: inline-block;

            color: #e5c36e;

            font-size: 11px;

            font-weight: 700;

            letter-spacing: 2px;

            margin-bottom: 15px;
        }


        .informacion-centro h1 {
            margin: 0;

            color: white;

            font-size: 52px;

            line-height: 1.05;

            font-weight: 700;

            letter-spacing: -1.5px;
        }


        .informacion-centro h1 span {
            color: #e3bd63;
        }


        .informacion-centro p {
            margin: 25px 0 0;

            color: rgba(255,255,255,0.72);

            font-size: 15px;

            line-height: 1.7;

            max-width: 390px;
        }


        .linea-decorativa {
            width: 65px;
            height: 3px;

            margin-top: 28px;

            border-radius: 10px;

            background: #d5ad55;
        }


        .informacion-pie {
            display: flex;
            align-items: center;
            gap: 8px;

            color: rgba(255,255,255,0.55);

            font-size: 12px;
        }


        .punto {
            width: 7px;
            height: 7px;

            border-radius: 50%;

            background: #67c587;

            box-shadow: 0 0 10px rgba(103,197,135,0.7);
        }


        /* =========================================================
           TARJETA LOGIN
        ========================================================= */

        .login-card {
            background: var(--pdc-crema-carta);

            padding: 50px 42px;

            display: flex;
            flex-direction: column;
            justify-content: center;

            box-sizing: border-box;
        }


        .login-header {
            text-align: center;

            margin-bottom: 34px;
        }


        .icono-login {
            width: 62px;
            height: 62px;

            margin: 0 auto 18px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 18px;

            background:
                    linear-gradient(
                            145deg,
                            var(--pdc-cafe-rojo),
                            var(--pdc-terracota)
                    );

            box-shadow:
                    0 10px 22px rgba(116,48,35,0.25);

            animation: pulso 3s ease-in-out infinite;
        }


        .icono-login span {
            font-size: 27px;
        }


        @keyframes pulso {

            0%, 100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-4px);
            }

        }


        .login-header h2 {
            margin: 0;

            color: var(--pdc-cafe-rojo);

            font-size: 27px;

            font-weight: 700;
        }


        .login-header p {
            margin: 8px 0 0;

            color: var(--pdc-texto-suave);

            font-size: 13px;
        }


        /* =========================================================
           CAMPOS
        ========================================================= */

        .campo {
            margin-bottom: 20px;
        }


        .campo label {
            display: block;

            margin-bottom: 8px;

            color: var(--pdc-texto);

            font-size: 13px;

            font-weight: 700;
        }


        .input-contenedor {
            position: relative;
        }


        .input-icono {
            position: absolute;

            left: 14px;
            top: 50%;

            transform: translateY(-50%);

            font-size: 16px;

            opacity: 0.65;

            z-index: 1;
        }


        .campo input {
            width: 100%;

            height: 48px;

            padding: 0 14px 0 45px;

            box-sizing: border-box;

            border: 1px solid var(--pdc-borde);

            border-radius: 11px;

            background: #fff;

            color: var(--pdc-texto);

            font-size: 14px;

            transition:
                    border-color 0.2s ease,
                    box-shadow 0.2s ease,
                    transform 0.2s ease;
        }


        .campo input::placeholder {
            color: #aaa;
        }


        .campo input:hover:not(:disabled) {
            border-color: #c9bcae;
        }


        .campo input:focus {
            outline: none;

            border-color: var(--pdc-cafe-rojo);

            box-shadow:
                    0 0 0 4px rgba(116,48,35,0.09);

            transform: translateY(-1px);
        }


        .campo input:disabled {
            background: #f5f3f0;

            cursor: not-allowed;
        }


        /* =========================================================
           ERROR
        ========================================================= */

        .login-error {
            display: flex;
            align-items: center;
            gap: 9px;

            padding: 11px 12px;

            margin-bottom: 17px;

            border-radius: 9px;

            background: rgba(180, 50, 50, 0.08);

            border: 1px solid rgba(180, 50, 50, 0.15);

            color: var(--pdc-rojo-cereza);

            font-size: 12px;

            animation: errorEntrada 0.3s ease-out;
        }


        @keyframes errorEntrada {

            from {
                opacity: 0;
                transform: translateY(-5px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }

        }


        .error-icono {
            width: 19px;
            height: 19px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background: var(--pdc-rojo-cereza);

            color: white;

            font-size: 11px;

            font-weight: bold;

            flex-shrink: 0;
        }


        /* =========================================================
           BOTÓN
        ========================================================= */

        .btn-ingresar {
            width: 100%;

            height: 50px;

            display: flex;
            align-items: center;
            justify-content: center;

            position: relative;

            border: none;

            border-radius: 11px;

            background:
                    linear-gradient(
                            135deg,
                            var(--pdc-cafe-rojo),
                            var(--pdc-terracota)
                    );

            color: white;

            font-size: 14px;

            font-weight: 700;

            cursor: pointer;

            box-shadow:
                    0 8px 18px rgba(116,48,35,0.22);

            transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease,
                    opacity 0.2s ease;
        }


        .btn-ingresar:hover:not(:disabled) {
            transform: translateY(-2px);

            box-shadow:
                    0 12px 25px rgba(116,48,35,0.32);
        }


        .btn-ingresar:active:not(:disabled) {
            transform: translateY(0);
        }


        .btn-ingresar:disabled {
            opacity: 0.6;

            cursor: not-allowed;

            box-shadow: none;
        }


        .flecha {
            position: absolute;

            right: 18px;

            font-size: 20px;

            transition: transform 0.2s ease;
        }


        .btn-ingresar:hover:not(:disabled) .flecha {
            transform: translateX(4px);
        }


        /* =========================================================
           SPINNER
        ========================================================= */

        .cargando {
            display: flex;
            align-items: center;
            gap: 9px;
        }


        .spinner {
            width: 16px;
            height: 16px;

            border: 2px solid rgba(255,255,255,0.35);

            border-top-color: white;

            border-radius: 50%;

            animation: girar 0.7s linear infinite;
        }


        @keyframes girar {

            to {
                transform: rotate(360deg);
            }

        }


        /* =========================================================
           FOOTER LOGIN
        ========================================================= */

        .separador {
            width: 100%;

            height: 1px;

            margin: 28px 0 18px;

            background: var(--pdc-borde);
        }


        .login-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 7px;

            color: var(--pdc-texto-suave);

            font-size: 10px;

            text-align: center;
        }


        .candado {
            font-size: 11px;
        }


        /* =========================================================
           COPYRIGHT
        ========================================================= */

        .copyright {
            position: absolute;

            bottom: 14px;

            left: 0;
            right: 0;

            text-align: center;

            color: rgba(255,255,255,0.42);

            font-size: 10px;

            z-index: 3;
        }


        /* =========================================================
           TABLET / PANTALLAS MEDIANAS
        ========================================================= */

        @media (max-width: 850px) {

            .login-contenedor {
                max-width: 500px;

                grid-template-columns: 1fr;
            }


            .panel-informacion {
                min-height: auto;

                padding: 30px 35px;

                gap: 35px;
            }


            .informacion-centro h1 {
                font-size: 40px;
            }


            .informacion-centro p {
                margin-top: 15px;
            }


            .login-card {
                padding: 38px 35px;
            }

        }


        /* =========================================================
           CELULARES
        ========================================================= */

        @media (max-width: 520px) {

            .login-fondo {
                padding: 20px 14px;
            }


            .login-contenedor {
                border-radius: 20px;
            }


            .panel-informacion {
                padding: 25px;

                gap: 25px;
            }


            .marca img {
                width: 145px;
            }


            .informacion-centro h1 {
                font-size: 34px;
            }


            .informacion-centro p {
                font-size: 13px;
            }


            .login-card {
                padding: 35px 25px;
            }


            .login-header {
                margin-bottom: 28px;
            }


            .copyright {
                display: none;
            }

        }

    `]
})
export class LoginComponent {

    username = '';
    password = '';

    cargando = false;
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}


    ingresar(): void {

        this.cargando = true;
        this.error = '';

        this.authService.login(this.username, this.password).subscribe({

            next: (sesion) => {

                this.cargando = false;

                this.router.navigate([
                    this.authService.rutaInicioSegunRol()
                ]);

            },

            error: (err) => {

                this.cargando = false;

                this.error =
                    err.error?.message ||
                    'Usuario o contraseña incorrectos.';

            }

        });

    }

}