import { useState, useEffect, useMemo } from 'react'
import FormularioTarea from './components/FormularioTarea.jsx'
import TareaItem from './components/TareaItem.jsx'
import Estadisticas from './components/Estadisticas.jsx'
import Filtros from './components/Filtros.jsx'
import {
  cargarTareas,
  guardarTareas,
  tareasAJSON,
  validarTareasImportadas,
} from './utils/tareas.js'
import './App.css'

// ============================================================
// App de Tareas en React — versión completa
//
// El estado principal (la lista de tareas) vive aquí, en App.
// Los componentes hijos solo muestran datos y avisan hacia
// arriba con funciones pasadas por props:
//
//   App
//   ├── FormularioTarea  -> crear tareas (categoría, prioridad, fecha)
//   ├── Estadisticas     -> totales y barra de progreso
//   ├── Filtros          -> estado + categoría + búsqueda, exportar/importar
//   └── TareaItem (xN)   -> cada fila, con edición en línea
//
// Cada tarea es un objeto:
//   { id, texto, completada, categoria, prioridad, fechaLimite }
// ============================================================

export default function App() {
  // useState con función inicializadora ("inicialización perezosa"):
  // cargarTareas solo se ejecuta en el primer dibujo de la app.
  const [tareas, setTareas] = useState(cargarTareas)

  // Estado de los tres filtros (funcionan combinados)
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  // Mensaje breve tras importar (éxito o error), para el usuario
  const [mensaje, setMensaje] = useState(null)

  // useEffect: cada vez que cambia la lista de tareas,
  // se guarda automáticamente en localStorage.
  useEffect(() => {
    guardarTareas(tareas)
  }, [tareas])

  // ----------------------------------------------------------
  // Operaciones sobre la lista (siempre de forma inmutable:
  // se crea un arreglo/objeto nuevo, nunca se modifica el actual)
  // ----------------------------------------------------------

  // Añade una tarea nueva con los datos que trae el formulario
  function agregarTarea({ texto, categoria, prioridad, fechaLimite }) {
    const nueva = {
      id: Date.now(),
      texto,
      completada: false,
      categoria,
      prioridad,
      fechaLimite,
    }
    setTareas((previas) => [...previas, nueva])
  }

  // Marca o desmarca una tarea como completada
  function alternarTarea(id) {
    setTareas((previas) =>
      previas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    )
  }

  function borrarTarea(id) {
    setTareas((previas) => previas.filter((tarea) => tarea.id !== id))
  }

  function borrarCompletadas() {
    setTareas((previas) => previas.filter((tarea) => !tarea.completada))
  }

  // Guarda el nuevo texto de una tarea editada en línea
  function editarTarea(id, nuevoTexto) {
    setTareas((previas) =>
      previas.map((tarea) => (tarea.id === id ? { ...tarea, texto: nuevoTexto } : tarea))
    )
  }

  // ----------------------------------------------------------
  // Exportar / importar JSON
  // ----------------------------------------------------------

  // Descarga la lista actual como archivo "tareas.json".
  // Truco clásico: se crea un Blob con el texto, una URL temporal
  // para ese Blob y un enlace <a> invisible que se pulsa solo.
  function exportarTareas() {
    const blob = new Blob([tareasAJSON(tareas)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = 'tareas.json'
    enlace.click()
    URL.revokeObjectURL(url)
  }

  // Recibe el texto del archivo elegido, lo valida y, si está
  // bien, REEMPLAZA la lista actual por la importada.
  function importarTareas(textoArchivo) {
    const resultado = validarTareasImportadas(textoArchivo)
    if (!resultado.ok) {
      setMensaje({ tipo: 'error', texto: `No se pudo importar: ${resultado.error}` })
      return
    }
    setTareas(resultado.tareas)
    setMensaje({
      tipo: 'ok',
      texto: `Importación correcta: ${resultado.tareas.length} tarea(s) cargada(s).`,
    })
  }

  // ----------------------------------------------------------
  // Datos derivados: estadísticas y lista visible
  // useMemo memoriza el cálculo y solo lo repite si cambian
  // las tareas o los filtros (optimización sencilla de entender).
  // ----------------------------------------------------------

  const estadisticas = useMemo(() => {
    const total = tareas.length
    const completadas = tareas.filter((t) => t.completada).length
    const pendientes = total - completadas
    // Evitamos dividir entre cero cuando no hay tareas
    const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100)
    return { total, completadas, pendientes, porcentaje }
  }, [tareas])

  // Los tres filtros se aplican a la vez con && (todos deben cumplirse)
  const visibles = useMemo(() => {
    const textoBuscado = busqueda.trim().toLowerCase()
    return tareas.filter((tarea) => {
      const cumpleEstado =
        filtroEstado === 'todas' ||
        (filtroEstado === 'pendientes' && !tarea.completada) ||
        (filtroEstado === 'completadas' && tarea.completada)

      const cumpleCategoria =
        filtroCategoria === 'todas' || tarea.categoria === filtroCategoria

      const cumpleBusqueda =
        textoBuscado === '' || tarea.texto.toLowerCase().includes(textoBuscado)

      return cumpleEstado && cumpleCategoria && cumpleBusqueda
    })
  }, [tareas, filtroEstado, filtroCategoria, busqueda])

  const hayFiltrosActivos =
    filtroEstado !== 'todas' || filtroCategoria !== 'todas' || busqueda.trim() !== ''

  return (
    <main className="app">
      <h1>Mis tareas</h1>

      <FormularioTarea onAgregar={agregarTarea} />

      <Estadisticas
        total={estadisticas.total}
        completadas={estadisticas.completadas}
        pendientes={estadisticas.pendientes}
        porcentaje={estadisticas.porcentaje}
      />

      <Filtros
        filtroEstado={filtroEstado}
        onCambiarEstado={setFiltroEstado}
        filtroCategoria={filtroCategoria}
        onCambiarCategoria={setFiltroCategoria}
        busqueda={busqueda}
        onCambiarBusqueda={setBusqueda}
        onExportar={exportarTareas}
        onImportar={importarTareas}
      />

      {/* Mensaje de resultado de la importación */}
      {mensaje && (
        <p className={`mensaje mensaje-${mensaje.tipo}`} role="status">
          {mensaje.texto}
        </p>
      )}

      <ul className="lista">
        {visibles.map((tarea) => (
          <TareaItem
            key={tarea.id}
            tarea={tarea}
            onAlternar={alternarTarea}
            onBorrar={borrarTarea}
            onEditar={editarTarea}
          />
        ))}
      </ul>

      {visibles.length === 0 && (
        <p className="sin-tareas">
          {tareas.length === 0
            ? 'Todavía no tienes tareas. ¡Añade la primera arriba!'
            : hayFiltrosActivos
              ? 'Ninguna tarea coincide con los filtros actuales.'
              : 'No hay tareas en esta vista.'}
        </p>
      )}

      <footer className="app-pie">
        <span>
          Mostrando {visibles.length} de {estadisticas.total} ·{' '}
          {estadisticas.pendientes === 1
            ? '1 pendiente'
            : `${estadisticas.pendientes} pendientes`}
        </span>
        <button type="button" id="borrar-completadas" onClick={borrarCompletadas}>
          Borrar completadas
        </button>
      </footer>
    </main>
  )
}
