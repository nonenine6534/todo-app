# App de Tareas — React

Aplicación de lista de tareas (to-do) construida con **React y Vite**.
Las tareas se guardan en el navegador con **localStorage**, así que
sobreviven al cerrar y reabrir la página.

## Características

- **Añadir** tareas con el botón o con Enter.
- **Completar** tareas con una casilla de verificación (se ven tachadas).
- **Filtrar** la vista: Todas / Activas / Completadas.
- **Borrar** tareas una a una, o todas las completadas de una vez.
- Contador de tareas pendientes.
- **Persistencia** automática en `localStorage` tras cada cambio.

## Cómo ejecutarla

Requisitos: tener instalado **Node.js 18 o superior**.

```bash
npm install     # instala las dependencias (solo la primera vez)
npm run dev     # arranca el servidor de desarrollo
```

Después abre en el navegador la dirección que muestra Vite
(normalmente http://localhost:5173).

Para generar la versión de producción:

```bash
npm run build   # crea la carpeta dist/ lista para publicar
```

## Estructura del proyecto

```
todo-app/
├── index.html            # HTML base: aquí se monta la app (div#root)
├── package.json          # dependencias y scripts de npm
├── vite.config.js        # configuración de Vite + plugin de React
└── src/
    ├── main.jsx          # punto de entrada: monta <App />
    ├── App.jsx           # estado de la lista y toda la lógica
    ├── App.css           # estilos de los componentes
    ├── index.css         # estilos globales
    └── components/
        └── TareaItem.jsx # una fila de la lista (recibe props)
```

## Tecnologías y conceptos de React usados

- **React 18** con componentes funcionales y JSX.
- **Vite 5** como herramienta de desarrollo y empaquetado.
- **useState** con inicialización perezosa: la lista se lee de
  `localStorage` solo en el primer dibujo.
- **useEffect**: guarda la lista en `localStorage` cada vez que cambia.
- Actualización **inmutable** del estado con `.map()` y `.filter()`
  (crear arreglos nuevos en vez de modificar el existente).
- **Props** y funciones como props (`onAlternar`, `onBorrar`) para que
  el componente hijo avise al padre.
- Renderizado condicional (mensaje de lista vacía) y de listas con `key`.
