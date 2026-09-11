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
        <div class="login-page">

            <!-- =====================================================
                 FONDO (recortado exacto: la imagen y sus decoraciones
                 quedan encerradas en este contenedor con overflow:hidden,
                 así el zoom animado nunca se sale de la pantalla.
            ====================================================== -->

            <div class="fondo-contenedor">

                <div class="fondo-imagen"></div>
                <div class="fondo-overlay"></div>

                <!-- Decoraciones: hojas de línea, no emojis -->
                <svg class="hoja hoja-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>

                <svg class="hoja hoja-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>

                <div class="grano grano-1"></div>
                <div class="grano grano-2"></div>
                <div class="grano grano-3"></div>

            </div>


            <!-- =====================================================
                 CONTENIDO PRINCIPAL
            ====================================================== -->

            <div class="contenido">


                <!-- =================================================
                     INFORMACIÓN DEL PARQUE
                ================================================== -->

                <section class="presentacion">

                    <div class="logo-contenedor">

                        <img
                                src="https://parquedelcafe.co/wp-content/uploads/2021/05/Logo-Parque-Del-Cafe.png"
                                alt="Parque del Café"
                                class="logo"
                        >

                    </div>


                    <div class="texto-presentacion">

            <span class="etiqueta">
              SISTEMA INTERNO
            </span>

                        <h1>
                            Control de
                            <strong>Acceso</strong>
                        </h1>

                        <p>
                            Gestión segura de ingreso para colaboradores
                            y concesionarios del Parque del Café.
                        </p>

                        <div class="decoracion">
                            <span></span>

                            <svg class="icono-taza-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
                                <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/>
                                <path d="M6 2c0 1-1 1-1 2s1 1 1 2"/>
                                <path d="M10 2c0 1-1 1-1 2s1 1 1 2"/>
                            </svg>

                            <span></span>
                        </div>

                        

                    </div>


                    <div class="estado-sistema">

                        <span class="estado-punto"></span>

                        Sistema protegido

                    </div>

                </section>



                <!-- =================================================
                     LOGIN
                ================================================== -->

                <section class="login-card">


                    <!-- Encabezado -->

                    <div class="login-header">

                        <div class="icono-login">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
                                <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/>
                                <path d="M6 2c0 1-1 1-1 2s1 1 1 2"/>
                                <path d="M10 2c0 1-1 1-1 2s1 1 1 2"/>
                            </svg>
                        </div>

                        <h2>
                            ¡Bienvenido!
                        </h2>

                        <p>
                            Ingresa tus credenciales para continuar
                        </p>

                    </div>



                    <!-- Formulario -->

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

                            <div class="input-wrapper">

                                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <circle cx="12" cy="7" r="4"/>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                </svg>

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

                            <div class="input-wrapper">

                                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>

                                <input
                                        id="password"
                                        [type]="verContrasena ? 'text' : 'password'"
                                        name="password"
                                        [(ngModel)]="password"
                                        required
                                        [disabled]="cargando"
                                        autocomplete="current-password"
                                        placeholder="Ingresa tu contraseña"
                                >

                                <button
                                        type="button"
                                        class="boton-ver-contrasena"
                                        (click)="verContrasena = !verContrasena"
                                        [attr.aria-label]="verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                                        tabindex="-1"
                                >
                                    <svg *ngIf="!verContrasena" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    <svg *ngIf="verContrasena" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                </button>

                            </div>

                        </div>



                        <!-- Error -->

                        <div
                                *ngIf="error"
                                class="login-error"
                        >

              <span class="error-icon">
                !
              </span>

                            <span>
                {{ error }}
              </span>

                        </div>



                        <!-- Botón -->

                        <button
                                type="submit"
                                class="btn-ingresar"
                                [disabled]="cargando || !f.valid"
                        >

                            <ng-container *ngIf="!cargando">

                <span>
                  Ingresar al sistema
                </span>

                                <span class="flecha">
                  →
                </span>

                            </ng-container>


                            <ng-container *ngIf="cargando">

                                <span class="spinner"></span>

                                <span>
                  Verificando...
                </span>

                            </ng-container>

                        </button>

                    </form>



                    <!-- Separador -->

                    <div class="separador"></div>



                    <!-- Seguridad -->

                    <div class="seguridad">

                        <svg class="seguridad-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                            <path d="m9 12 2 2 4-4"/>
                        </svg>

                        <span>
              Acceso restringido a personal autorizado
            </span>

                    </div>

                </section>

            </div>



            <!-- =====================================================
                 PIE DE PÁGINA
            ====================================================== -->

            <footer>

                <svg class="footer-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
                    <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/>
                </svg>

                Sistema de Control de Acceso

                <span class="separador-footer">
          ·
        </span>

                Parque del Café

            </footer>

        </div>
    `,


    styles: [`

        /* =========================================================
           VARIABLES
        ========================================================= */

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            overflow-x: hidden;
        }


        :host {
            display: block;

            position: fixed;
            inset: 0;

            width: 100%;
            height: 100%;

            z-index: 9999;

            overflow: hidden;

            --verde-oscuro: #173d2b;
            --verde: #2f6545;
            --verde-claro: #668b58;

            --cafe: #683719;
            --cafe-claro: #9a542b;

            --dorado: #cda85b;

            --crema: #faf7ef;
            --blanco: #ffffff;

            --texto: #352b24;
            --texto-suave: #756b63;

            --borde: #e4ddd2;
        }



        /* =========================================================
           PÁGINA
        ========================================================= */

        .login-page {

            width: 100%;
            height: 100%;
            min-height: 100vh;
            min-height: 100dvh;

            position: relative;

            overflow-y: auto;
            overflow-x: hidden;

            display: flex;
            align-items: center;
            justify-content: center;

            box-sizing: border-box;

            padding: 35px 25px 65px;

            font-family:
                    Arial,
                    Helvetica,
                    sans-serif;
        }



        /* =========================================================
           CONTENEDOR DEL FONDO
        ========================================================= */

        .fondo-contenedor {

            position: absolute;

            inset: 0;

            width: 100%;
            height: 100%;

            overflow: hidden;

            z-index: 0;

            pointer-events: none;
        }



        /* =========================================================
           IMAGEN DE FONDO
        ========================================================= */

        .fondo-imagen {
            position: absolute;

            inset: 0;

            width: 100%;
            height: 100%;

            background-image: url('/assets/fondo-parque.png');

            background-size: cover;
            background-position: center center;

            z-index: 0;

            transform: scale(1.02);

            animation: zoom-fondo 18s ease-in-out infinite alternate;
        }


        @keyframes zoom-fondo {

            from {
                transform: scale(1.03);
            }

            to {
                transform: scale(1.08);
            }

        }



        /* =========================================================
           CAPA OSCURA
        ========================================================= */

        .fondo-overlay {
            position: absolute;

            inset: 0;

            width: 100%;
            height: 100%;

            z-index: 1;

            background:
                    linear-gradient(
                            90deg,
                            rgba(18, 55, 35, 0.78) 0%,
                            rgba(25, 65, 42, 0.58) 40%,
                            rgba(15, 40, 27, 0.30) 100%
                    );
        }



        /* =========================================================
           DECORACIONES (íconos SVG de línea, no emojis)
        ========================================================= */

        .hoja {

            position: absolute;

            width: 130px;
            height: 130px;

            z-index: 2;

            opacity: 0.16;

            color: var(--dorado);

            pointer-events: none;

            filter: blur(0.3px);

        }


        .hoja-1 {

            right: -20px;
            top: -15px;

            transform: rotate(-25deg);

            animation:
                    flotar 7s ease-in-out infinite;

        }


        .hoja-2 {

            width: 95px;
            height: 95px;

            left: -15px;
            bottom: 30px;

            transform: rotate(150deg);

            animation:
                    flotar 9s ease-in-out infinite reverse;

        }


        @keyframes flotar {

            0%, 100% {
                transform:
                        translateY(0)
                        rotate(-20deg);
            }

            50% {
                transform:
                        translateY(-15px)
                        rotate(-10deg);
            }

        }



        /* =========================================================
           GRANOS (silueta CSS, ya tenían buen estilo propio)
        ========================================================= */

        .grano {

            position: absolute;

            z-index: 2;

            width: 16px;
            height: 23px;

            border-radius: 50%;

            background:
                    linear-gradient(
                            135deg,
                            #4b2412,
                            #9b572d
                    );

            opacity: 0.35;

            transform: rotate(35deg);

        }


        .grano::after {

            content: '';

            position: absolute;

            width: 2px;

            height: 17px;

            background: rgba(255,255,255,0.25);

            left: 7px;
            top: 3px;

            border-radius: 50%;

        }


        .grano-1 {

            left: 8%;
            top: 15%;

            animation:
                    flotar-grano 6s infinite ease-in-out;

        }


        .grano-2 {

            left: 42%;
            bottom: 10%;

            transform: rotate(-25deg) scale(0.8);

            animation:
                    flotar-grano 8s infinite ease-in-out;

        }


        .grano-3 {

            right: 8%;
            top: 20%;

            transform:
                    rotate(45deg)
                    scale(0.7);

            animation:
                    flotar-grano 7s infinite ease-in-out;

        }


        @keyframes flotar-grano {

            0%, 100% {
                transform:
                        translateY(0)
                        rotate(35deg);
            }

            50% {
                transform:
                        translateY(-18px)
                        rotate(50deg);
            }

        }



        /* =========================================================
           CONTENIDO
        ========================================================= */

        .contenido {

            width: 100%;

            max-width: 1100px;

            position: relative;

            z-index: 2;

            display: grid;

            grid-template-columns:
        minmax(0, 1fr)
        minmax(360px, 430px);

            gap: 65px;

            align-items: center;

        }



        /* =========================================================
           PRESENTACIÓN
        ========================================================= */

        .presentacion {

            min-height: 520px;

            display: flex;

            flex-direction: column;

            justify-content: space-between;

            padding: 25px 0;

            box-sizing: border-box;

            animation:
                    aparecer-izquierda 0.8s ease-out;

        }


        @keyframes aparecer-izquierda {

            from {

                opacity: 0;

                transform:
                        translateX(-35px);

            }

            to {

                opacity: 1;

                transform:
                        translateX(0);

            }

        }



        /* =========================================================
           LOGO
        ========================================================= */

        .logo-contenedor {

            width: fit-content;

            background: rgba(255,255,255,0.95);

            padding: 9px 13px;

            border-radius: 10px;

            box-shadow:
                    0 8px 25px rgba(0,0,0,0.16);

        }


        .logo {

            display: block;

            width: 175px;

            height: auto;

        }



        /* =========================================================
           TEXTO
        ========================================================= */

        .texto-presentacion {

            max-width: 540px;

        }


        .etiqueta {

            display: inline-block;

            color: #e4c66f;

            font-size: 11px;

            font-weight: 700;

            letter-spacing: 2.5px;

            margin-bottom: 14px;

        }


        .texto-presentacion h1 {

            margin: 0;

            color: white;

            font-size: clamp(42px, 5vw, 64px);

            line-height: 1;

            letter-spacing: -2px;

            font-weight: 700;

        }


        .texto-presentacion h1 strong {

            display: block;

            color: #d8b866;

            font-weight: 700;

        }


        .texto-presentacion p {

            max-width: 440px;

            margin: 25px 0 0;

            color: rgba(255,255,255,0.82);

            font-size: 15px;

            line-height: 1.7;

        }



        /* =========================================================
           DECORACIÓN (línea + taza + línea)
        ========================================================= */

        .decoracion {

            display: flex;

            align-items: center;

            gap: 10px;

            width: 140px;

            margin-top: 25px;

        }


        .decoracion span {

            height: 1px;

            flex: 1;

            background:
                    rgba(220,190,105,0.65);

        }


        .icono-taza-mini {

            width: 18px;
            height: 18px;

            color: #e1bd62;

            flex-shrink: 0;

        }



        /* =========================================================
           UBICACIÓN
        ========================================================= */

        .ubicacion {

            display: flex;

            align-items: center;

            gap: 12px;

            margin-top: 28px;

        }


        .ubicacion-icono {

            width: 38px;
            height: 38px;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 10px;

            background:
                    rgba(255,255,255,0.12);

            border:
                    1px solid rgba(255,255,255,0.15);

            color: #e57a6a;

            flex-shrink: 0;

        }


        .ubicacion-icono svg {

            width: 18px;
            height: 18px;

        }


        .ubicacion strong {

            display: block;

            color: white;

            font-size: 13px;

        }


        .ubicacion small {

            display: block;

            margin-top: 3px;

            color: rgba(255,255,255,0.62);

            font-size: 11px;

        }



        /* =========================================================
           ESTADO
        ========================================================= */

        .estado-sistema {

            display: flex;

            align-items: center;

            gap: 8px;

            color: rgba(255,255,255,0.65);

            font-size: 11px;

        }


        .estado-punto {

            width: 7px;
            height: 7px;

            border-radius: 50%;

            background: #65c784;

            box-shadow:
                    0 0 12px #65c784;

            animation:
                    pulso 2s infinite;

        }


        @keyframes pulso {

            0%, 100% {
                opacity: 1;
            }

            50% {
                opacity: 0.4;
            }

        }



        /* =========================================================
           TARJETA LOGIN
        ========================================================= */

        .login-card {

            width: 100%;

            box-sizing: border-box;

            padding: 45px 40px;

            border-radius: 24px;

            background:
                    rgba(250,247,239,0.97);

            box-shadow:

                    0 30px 70px
                    rgba(0,0,0,0.30),

                    0 10px 25px
                    rgba(0,0,0,0.12);

            border:
                    1px solid rgba(255,255,255,0.6);

            animation:
                    aparecer-derecha 0.8s ease-out;

        }


        @keyframes aparecer-derecha {

            from {

                opacity: 0;

                transform:
                        translateX(35px)
                        scale(0.98);

            }

            to {

                opacity: 1;

                transform:
                        translateX(0)
                        scale(1);

            }

        }



        /* =========================================================
           HEADER LOGIN
        ========================================================= */

        .login-header {

            text-align: center;

            margin-bottom: 32px;

        }


        .icono-login {

            width: 62px;
            height: 62px;

            margin:
                    0 auto 17px;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 18px;

            background:
                    linear-gradient(
                            135deg,
                            var(--cafe),
                            var(--cafe-claro)
                    );

            color: white;

            box-shadow:
                    0 10px 22px
                    rgba(104,55,25,0.25);

            animation:
                    icono-flotar 3s ease-in-out infinite;

        }


        .icono-login svg {

            width: 28px;
            height: 28px;

        }


        @keyframes icono-flotar {

            0%, 100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-4px);
            }

        }


        .login-header h2 {

            margin: 0;

            color: var(--cafe);

            font-size: 27px;

            font-weight: 700;

        }


        .login-header p {

            margin:
                    8px 0 0;

            color: var(--texto-suave);

            font-size: 13px;

        }



        /* =========================================================
           CAMPOS
        ========================================================= */

        .campo {

            margin-bottom: 19px;

        }


        .campo label {

            display: block;

            margin-bottom: 8px;

            color: var(--texto);

            font-size: 13px;

            font-weight: 700;

        }


        .input-wrapper {

            position: relative;

        }


        .input-icon {

            position: absolute;

            left: 14px;

            top: 50%;

            transform:
                    translateY(-50%);

            width: 17px;
            height: 17px;

            color: var(--texto-suave);

            opacity: 0.7;

            z-index: 1;

            pointer-events: none;

        }


        .boton-ver-contrasena {

            position: absolute;

            right: 6px;

            top: 50%;

            transform: translateY(-50%);

            width: 34px;
            height: 34px;

            display: flex;

            align-items: center;
            justify-content: center;

            background: none;

            border: none;

            border-radius: 8px;

            color: var(--texto-suave);

            cursor: pointer;

            z-index: 1;

        }


        .boton-ver-contrasena:hover {

            background: rgba(0,0,0,0.05);

            color: var(--cafe);

        }


        .boton-ver-contrasena svg {

            width: 18px;
            height: 18px;

        }


        .campo input {

            width: 100%;

            height: 49px;

            box-sizing: border-box;

            padding:
                    0 40px 0 43px;

            border:
                    1px solid var(--borde);

            border-radius: 11px;

            background: white;

            color: var(--texto);

            font-size: 14px;

            transition:
                    border 0.2s ease,
                    box-shadow 0.2s ease,
                    transform 0.2s ease;

        }


        #username {
            padding-right: 14px;
        }


        .campo input::placeholder {

            color: #aaa;

        }


        .campo input:hover:not(:disabled) {

            border-color:
                    #c8bcae;

        }


        .campo input:focus {

            outline: none;

            border-color:
                    var(--verde);

            box-shadow:
                    0 0 0 4px
                    rgba(47,101,69,0.10);

            transform:
                    translateY(-1px);

        }


        .campo input:disabled {

            background:
                    #f1eee8;

            cursor:
                    not-allowed;

        }



        /* =========================================================
           ERROR
        ========================================================= */

        .login-error {

            display: flex;

            align-items: center;

            gap: 9px;

            padding:
                    11px 12px;

            margin:
                    0 0 17px;

            border-radius: 9px;

            background:
                    rgba(177,55,45,0.08);

            border:
                    1px solid rgba(177,55,45,0.16);

            color:
                    #a52f27;

            font-size: 12px;

            animation:
                    aparecer-error 0.3s ease-out;

        }


        @keyframes aparecer-error {

            from {

                opacity: 0;

                transform:
                        translateY(-5px);

            }

            to {

                opacity: 1;

                transform:
                        translateY(0);

            }

        }


        .error-icon {

            width: 19px;
            height: 19px;

            display: flex;

            align-items: center;
            justify-content: center;

            flex-shrink: 0;

            border-radius: 50%;

            background:
                    #a52f27;

            color: white;

            font-size: 11px;

            font-weight: bold;

        }



        /* =========================================================
           BOTÓN
        ========================================================= */

        .btn-ingresar {

            position: relative;

            width: 100%;

            height: 50px;

            display: flex;

            align-items: center;

            justify-content: center;

            border: none;

            border-radius: 11px;

            background:
                    linear-gradient(
                            135deg,
                            var(--cafe),
                            var(--cafe-claro)
                    );

            color: white;

            font-size: 14px;

            font-weight: 700;

            cursor: pointer;

            box-shadow:
                    0 9px 20px
                    rgba(104,55,25,0.22);

            transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;

        }


        .btn-ingresar:hover:not(:disabled) {

            transform:
                    translateY(-2px);

            box-shadow:
                    0 13px 27px
                    rgba(104,55,25,0.30);

        }


        .btn-ingresar:active:not(:disabled) {

            transform:
                    translateY(0);

        }


        .btn-ingresar:disabled {

            opacity: 0.6;

            cursor:
                    not-allowed;

            box-shadow: none;

        }


        .flecha {

            position: absolute;

            right: 17px;

            font-size: 20px;

            transition:
                    transform 0.2s ease;

        }


        .btn-ingresar:hover:not(:disabled)
        .flecha {

            transform:
                    translateX(4px);

        }



        /* =========================================================
           SPINNER
        ========================================================= */

        .spinner {

            width: 16px;
            height: 16px;

            margin-right: 9px;

            border:
                    2px solid
                    rgba(255,255,255,0.35);

            border-top-color:
                    white;

            border-radius: 50%;

            animation:
                    girar 0.7s linear infinite;

        }


        @keyframes girar {

            to {
                transform:
                        rotate(360deg);
            }

        }



        /* =========================================================
           SEGURIDAD
        ========================================================= */

        .separador {

            width: 100%;

            height: 1px;

            margin:
                    27px 0 17px;

            background:
                    var(--borde);

        }


        .seguridad {

            display: flex;

            justify-content: center;

            align-items: center;

            gap: 7px;

            color:
                    var(--texto-suave);

            font-size: 10px;

            text-align: center;

        }


        .seguridad-icon {

            width: 14px;
            height: 14px;

            flex-shrink: 0;

        }



        /* =========================================================
           FOOTER
        ========================================================= */

        footer {

            position: absolute;

            bottom: 17px;

            left: 0;
            right: 0;

            z-index: 3;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 6px;

            color:
                    rgba(255,255,255,0.55);

            font-size: 10px;

        }


        .footer-icono {

            width: 12px;
            height: 12px;

            flex-shrink: 0;

        }


        .separador-footer {

            margin:
                    0 5px;

        }



        /* =========================================================
           ESCRITORIO GRANDE
        ========================================================= */

        @media (min-width: 1400px) {

            .contenido {

                max-width: 1180px;

                gap: 90px;

            }

        }



        /* =========================================================
           TABLETS
        ========================================================= */

        @media (max-width: 900px) {

            .login-page {

                padding:
                        25px 20px 55px;

            }


            .contenido {

                max-width: 620px;

                grid-template-columns: 1fr;

                gap: 25px;

            }


            .presentacion {

                min-height: auto;

                padding:
                        5px 0;

                align-items: center;

                text-align: center;

            }


            .texto-presentacion {

                max-width: 600px;

            }


            .texto-presentacion h1 {

                font-size: 42px;

            }


            .texto-presentacion h1 strong {

                display: inline;

                margin-left: 8px;

            }


            .texto-presentacion p {

                margin:
                        15px auto 0;

            }


            .decoracion {

                margin:
                        20px auto 0;

            }


            .ubicacion {

                justify-content: center;

                margin-top: 18px;

            }


            .estado-sistema {

                display: none;

            }


            .login-card {

                max-width: 430px;

                margin:
                        0 auto;

            }

        }



        /* =========================================================
           TABLET PEQUEÑA / CELULAR
        ========================================================= */

        @media (max-width: 600px) {

            .login-page {

                align-items: flex-start;

                padding:
                        20px 14px 45px;

            }


            .contenido {

                width: 100%;

            }


            .presentacion {

                padding: 0;

                gap: 20px;

            }


            .logo {

                width: 145px;

            }


            .texto-presentacion h1 {

                font-size: 34px;

                letter-spacing: -1px;

            }


            .texto-presentacion p {

                font-size: 13px;

                line-height: 1.5;

            }


            .ubicacion {

                margin-top: 15px;

            }


            .login-card {

                padding:
                        32px 24px;

                border-radius: 20px;

            }


            .login-header {

                margin-bottom: 27px;

            }


            .icono-login {

                width: 55px;
                height: 55px;

            }


            .icono-login svg {

                width: 24px;
                height: 24px;

            }


            .login-header h2 {

                font-size: 24px;

            }


            .campo input {

                height: 50px;

                font-size: 16px;

            }


            .btn-ingresar {

                height: 51px;

            }


            .hoja,
            .grano {

                display: none;

            }


            footer {

                display: none;

            }

        }



        /* =========================================================
           CELULARES MUY PEQUEÑOS
        ========================================================= */

        @media (max-width: 380px) {

            .login-page {

                padding:
                        15px 10px 25px;

            }


            .logo {

                width: 125px;

            }


            .texto-presentacion h1 {

                font-size: 30px;

            }


            .texto-presentacion p {

                font-size: 12px;

            }


            .login-card {

                padding:
                        27px 19px;

            }


            .login-header {

                margin-bottom: 23px;

            }

        }



        /* =========================================================
           PANTALLAS ALTAS
        ========================================================= */

        @media (min-height: 800px) and (min-width: 901px) {

            .login-page {

                padding-bottom: 55px;

            }


            .presentacion {

                min-height: 570px;

            }

        }



        /* =========================================================
           CELULAR EN HORIZONTAL
        ========================================================= */

        @media (max-height: 480px) and (orientation: landscape) {

            .login-page {

                align-items: flex-start;

                padding: 14px;

            }


            .presentacion {

                display: none;

            }


            .contenido {

                grid-template-columns: 1fr;

                max-width: 420px;

                margin: 0 auto;

            }


            .login-card {

                padding: 22px 24px;

            }


            .login-header {

                margin-bottom: 16px;

            }


            .icono-login {

                width: 44px;
                height: 44px;

                margin-bottom: 10px;

            }


            .icono-login svg {

                width: 20px;
                height: 20px;

            }


            footer {

                display: none;

            }

        }

    `]
})
export class LoginComponent {

    username = '';
    password = '';
    verContrasena = false;

    cargando = false;
    error = '';


    constructor(
        private authService: AuthService,
        private router: Router
    ) {}


    ingresar(): void {

        this.cargando = true;

        this.error = '';

        this.authService
            .login(this.username, this.password)
            .subscribe({

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