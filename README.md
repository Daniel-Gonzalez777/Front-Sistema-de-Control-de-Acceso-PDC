# parque-front — Frontend completo (Angular 18)

Este es un proyecto Angular **completo y estándar** (generado a mano, archivo por archivo, con la misma estructura que produce `ng new`) — incluye `tsconfig.app.json`, que fue justo lo que te faltó la vez pasada.

## Cómo correrlo

```bash
npm install
ng serve
```

Ábrelo en `http://localhost:4200`. Necesitas el backend corriendo en `http://localhost:8080` (así está configurado en `src/app/services/api-base.ts` — si tu backend corre en otro puerto, ese es el único archivo que hay que tocar).

## Qué trae

| Página | Ruta | Qué hace |
|---|---|---|
| Validar ingreso | `/` | Pantalla principal de portería. Digitas/escaneas la cédula: si la persona no está adentro, valida su entrada; si ya está adentro, registra su salida automáticamente. |
| Visitantes | `/visitas` | Registrar ingreso de un visitante (con o sin vehículo) y ver quién sigue dentro, con botón de salida. |
| Afiliaciones | `/afiliaciones` | Carga masiva del Excel mensual por concesionario, carga manual puntual, y listado de afiliaciones (Salud/EPS, Pensión/AFP, ARL). |
| Empleados | `/empleados` | Alta manual de empleados (normalmente se crean solos al subir el Excel) y listado. |
| Concesionarios | `/concesionarios` | CRUD completo de concesionarios. |
| Historial | `/historial` | Quién está dentro del Parque ahora mismo, y el historial completo de entradas/salidas. |

## Sobre el estilo visual

- **Logo:** se está usando el logo oficial directo desde el sitio del Parque del Café (`https://parquedelcafe.co/wp-content/uploads/.../Logo-Parque-Del-Cafe.png`), referenciado por URL en `app.component.ts` — no lo descargué ni lo modifiqué, así que se ve exactamente como en su sitio. Si prefieres tenerlo empaquetado localmente (para que funcione sin depender de que su sitio esté disponible), descárgalo tú mismo y ponlo en `src/assets/logo.png`, luego cambia el `src` del `<img>` en `app.component.ts`.
- **Colores:** en `src/styles.css` hay una paleta inspirada en la identidad cafetera (marrón, terracota, dorado, crema, verde cafeto) usando variables CSS (`--pdc-*`). **No son el hex exacto** de la hoja de estilos oficial del Parque del Café — no fue posible extraerlo automáticamente desde aquí. Si quieres el match exacto, abre `parquedelcafe.co` con F12 → pestaña "Elements" o "Computed", busca los colores que usan en botones/encabezados, y reemplaza los valores en `:root` al inicio de `styles.css`. Es literalmente cambiar unos hex, no toca nada más del proyecto.

## Si te vuelve a salir un error de `tsconfig`

Este proyecto tiene los 3 archivos que Angular necesita (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`) en la raíz. Si al comprimirlo para subirlo a Git algún zip/herramienta se los llega a saltar, revisa que los 3 sigan ahí antes de subirlo.
