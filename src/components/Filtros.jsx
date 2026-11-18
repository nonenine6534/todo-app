// ============================================================
// Componente Filtros: controles para filtrar la lista y para
// exportar / importar tareas en formato JSON.
//
// Los tres filtros (estado, categoría y búsqueda por texto)
// funcionan A LA VEZ: App combina los tres al calcular la
// lista visible. Este componente solo muestra los controles
// y avisa a App de cada cambio mediante las props.
//
// También incluye los botones de Exportar e Importar:
// - Exportar: App genera y descarga el archivo JSON.
// - Importar: aquí se lee el archivo elegido con FileReader
//   y se entrega su texto a App, que lo valida y lo aplica.
// ============================================================
import { CATEGORIAS } from '../utils/tareas.js'

// Opciones del filtro por estado
const FILTROS_ESTADO = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'pendientes', etiqueta: 'Pendientes' },
  { valor: 'completadas', etiqueta: 'Completadas' },
]

export default function Filtros({
  filtroEstado,
  onCambiarEstado,
  filtroCategoria,
  onCambiarCategoria,
  busqueda,
  onCambiarBusqueda,
  onExportar,
  onImportar,
}) {
  // Cuando el usuario elige un archivo, lo leemos como texto
  // y pasamos ese texto a App para que lo valide.
  function manejarArchivo(evento) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return

    const lector = new FileReader()
    lector.onload = () => onImportar(String(lector.result || ''))
    lector.readAsText(archivo)

    // Limpiamos el input para poder importar el mismo archivo otra vez
    evento.target.value = ''
  }

  return (
    <section className="panel-filtros" aria-label="Filtros y datos">
      {/* Búsqueda por texto */}
      <input
        type="search"
        className="buscador"
        placeholder="Buscar tareas por texto…"
        value={busqueda}
        onChange={(e) => onCambiarBusqueda(e.target.value)}
        aria-label="Buscar tareas por texto"
      />

      <div className="filtros-fila">
        {/* Filtro por estado: botones tipo "píldora" */}
        <div className="filtros" role="group" aria-label="Filtrar por estado">
          {FILTROS_ESTADO.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={filtroEstado === opcion.valor ? 'activo' : ''}
              onClick={() => onCambiarEstado(opcion.valor)}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>

        {/* Filtro por categoría */}
        <label className="filtro-categoria">
          Categoría
          <select
            value={filtroCategoria}
            onChange={(e) => onCambiarCategoria(e.target.value)}
          >
            <option value="todas">Todas</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Exportar / Importar en JSON */}
      <div className="datos-acciones">
        <button type="button" className="btn-datos" onClick={onExportar}>
          Exportar JSON
        </button>
        {/* El input de archivo real está oculto; la etiqueta
            con forma de botón es lo que el usuario pulsa */}
        <label className="btn-datos btn-importar">
          Importar JSON
          <input type="file" accept="application/json,.json" onChange={manejarArchivo} hidden />
        </label>
      </div>
    </section>
  )
}
