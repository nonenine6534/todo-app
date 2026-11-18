# App de Tareas — React

Aplicación de lista de tareas (to-do) construida con **React y Vite**, pensada como proyecto de portafolio: no es solo un CRUD básico, sino una app completa con categorías, prioridades, fechas límite, estadísticas, filtros combinados y respaldo en JSON. Las tareas se guardan en el navegador con **localStorage**, así que sobreviven al cerrar y reabrir la página.

Cada tarea es un objeto con esta forma:

```js
{
  id: 1730000000000,          // número único (Date.now())
  texto: "Estudiar React",
  completada: false,
  categoria: "Estudio",       // Estudio | Personal | Trabajo | Otra
  prioridad: "alta",          // alta | media | baja
  fechaLimite: "2026-11-20"   // "AAAA-MM-DD" o "" si no tiene
}
```

## Características

- **Crear tareas completas:** texto, categoría (Estudio, Personal, Trabajo, Otra), prioridad (alta, media o baja) y fecha límite opcional.
- **Prioridades con colores:** distintivo rojo para alta, ámbar para media y verde para baja, visible en cada fila.
- **Fecha límite y vencidas:** cada tarea puede mostrar su fecha; si ya pasó y no está completada, se marca en rojo con el aviso «¡Vencida!».
- **Editar en línea:** doble clic sobre el texto o botón ✎ para convertirlo en un campo editable. Enter o «Guardar» confirma; Escape o «Cancelar» descarta.
- **Completar y borrar:** casilla para marcar como completada (se ve tachada), borrado individual y botón para borrar todas las completadas.
- **Panel de estadísticas:** total, completadas, pendientes y porcentaje completado, con barra de progreso visual.
- **Filtros combinados:** estado (todas / pendientes / completadas) + categoría + búsqueda por texto, aplicados a la vez.
- **Exportar a JSON:** descarga la lista actual como archivo `tareas.json`.
- **Importar desde JSON:** carga un archivo exportado antes (u otro con el mismo formato), con validación básica: debe ser un arreglo de objetos con un campo `texto` no vacío; si el formato falla, se muestra un mensaje de error y la lista no se toca.
- **Persistencia automática:** cada cambio se guarda en `localStorage` y se recupera al abrir la app. Los datos de versiones anteriores se normalizan solos (se completan los campos que falten).

## Tecnologías

- **React 18** — componentes funcionales, JSX, props y hooks (`useState`, `useEffect`, `useMemo`).
- **Vite 5** — servidor de desarrollo y empaquetado para producción.
- **JavaScript (ES Modules)** y **CSS** propio, sin librerías externas de interfaz.
- **APIs del navegador:** `localStorage`, `Blob` + `URL.createObjectURL` (descarga de archivos) y `FileReader` (lectura del archivo importado).

## Cómo ejecutarlo

Requisitos: tener instalado **Node.js 18 o superior**.

```bash
npm install     # instala las dependencias (solo la primera vez)
npm run dev     # arranca el servidor de desarrollo
```

Después abre en el navegador la dirección que muestra Vite (normalmente http://localhost:5173).

Para generar la versión de producción:

```bash
npm run build   # crea la carpeta dist/ lista para publicar
npm run preview # opcional: sirve esa versión de producción en local
```

## Estructura de carpetas

```
todo-app/
├── index.html              # HTML base: aquí se monta la app (div#root)
├── package.json            # dependencias y scripts de npm
├── vite.config.js          # configuración de Vite + plugin de React
└── src/
    ├── main.jsx            # punto de entrada: monta <App />
    ├── App.jsx             # estado principal, operaciones y datos derivados
    ├── App.css             # estilos de todos los componentes
    ├── index.css           # estilos globales
    ├── components/
    │   ├── FormularioTarea.jsx  # formulario de creación (texto, categoría, prioridad, fecha)
    │   ├── TareaItem.jsx        # una fila de la lista, con edición en línea
    │   ├── Estadisticas.jsx     # panel de totales y barra de progreso
    │   └── Filtros.jsx          # filtros combinados + exportar / importar JSON
    └── utils/
        └── tareas.js       # constantes, localStorage, fechas y validación de importación
```

La idea de la estructura: **App** guarda el estado y coordina; los **componentes** solo muestran datos y avisan hacia arriba con funciones recibidas por props; y las **utilidades** concentran la lógica que no es interfaz (fechas, almacenamiento, validación), para poder explicarla y probarla por separado.

## Qué practica este proyecto

- **Estado en React con `useState`**, incluida la inicialización perezosa para leer `localStorage` solo una vez.
- **`useEffect`** para sincronizar el estado con un recurso externo (guardar en `localStorage` tras cada cambio).
- **`useMemo`** para memorizar cálculos derivados (estadísticas y lista filtrada) y no repetirlos en cada dibujo.
- **Actualización inmutable** del estado con `.map()`, `.filter()` y propagación de objetos (`{ ...tarea }`).
- **Componentes y props:** dividir la interfaz en piezas con responsabilidad única y comunicar hijo → padre mediante funciones como props (`onAgregar`, `onEditar`, `onImportar`…).
- **Estado local vs. estado global de la app:** el formulario y la edición en línea guardan su propio estado temporal; la lista vive en App.
- **Formularios controlados** y manejo de eventos: envío, teclado (Enter/Escape), doble clic y cambio de archivos.
- **Renderizado condicional y de listas** con `key`, y mensajes distintos según haya lista vacía o filtros sin resultados.
- **Trabajo con fechas en JavaScript:** comparación de fechas en formato `AAAA-MM-DD`, detección de tareas vencidas y formato legible con `toLocaleDateString`.
- **Archivos en el navegador:** generar una descarga con `Blob` y leer un archivo del usuario con `FileReader`, validando su contenido antes de usarlo.
- **Compatibilidad de datos:** normalizar objetos incompletos para que la app no se rompa con datos guardados por versiones anteriores.
