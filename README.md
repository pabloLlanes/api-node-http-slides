# Presentaciones CRUD · HTTP paso a paso

Presentaciones hechas con [impress.js](https://github.com/impress/impress.js) que
recorren, paso a paso, qué pasa cuando el frontend llama a una API de Node/Express:
el protocolo HTTP y el código de cada momento, de React a MongoDB y de vuelta.

Es un proyecto separado (hermano de `fullstack-art`), con los mismos estilos pero
**solo** la parte de presentaciones.

## Las 4 presentaciones

Desde el menú de inicio se elige un método HTTP:

- **CREATE** — `POST /api/users`
- **READ** — `GET /api/users?page=1&limit=2`
- **UPDATE** — `PUT /api/users/:id`
- **DELETE** — `DELETE /api/users/:id`

Cada una incluye el camino feliz completo (cliente → red → servidor → base → vuelta)
y 2 variantes con errores típicos (400, 404, 409, caché 304...).

## Layout de cada diapositiva

- **Izquierda:** el detalle del paso ("Qué pasa") y el panel del **protocolo HTTP**.
- **Derecha:** el **código**, en una columna más ancha y con fuente más grande.

## Navegación

- `→` / barra espaciadora: avanzar · `←`: volver.
- Botón **Ver todo**: aleja la cámara y muestra el recorrido completo.
- Botón **EN/ES**: cambia el idioma (mantiene el paso actual).

> impress.js escala cada diapositiva para que entre en la ventana, así que está
> pensado para pantalla de computadora o proyector, no para celular.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run lint
```

## Estructura

- `src/slides/` — el contenido de cada presentación (bilingüe). Para cambiar un
  texto, mover una estación (`slot`) o agregar un paso, se edita acá:
  - `shared.js` — zonas, colores y posiciones (`SLOT_POS`) en el lienzo.
  - `createSlides.js`, `readSlides.js`, `updateSlides.js`, `deleteSlides.js`.
  - `index.js` — junta las 4 y arma el menú.
- `src/components/Presentation/` — el componente que monta impress.js.
- `src/components/Menu/` — el menú de inicio.
