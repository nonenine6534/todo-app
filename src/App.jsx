import { useState, useEffect } from 'react'
import TareaItem from './components/TareaItem.jsx'
import './App.css'

// ============================================================
// App de Tareas en React, con guardado en localStorage
//
// Cada tarea es un objeto: { id, texto, completada }
// El estado vive en App; el componente TareaItem solo dibuja
// cada fila y avisa cuando el usuario la toca.
// ============================================================

const CLAVE = 'todo-app-tareas'

// Lee las tareas guardadas en el navegador. Si no hay nada
// guardado o el dato está dañado, devuelve una lista vacía.
function cargarTareas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

// Opciones de filtro que se muestran como botones
const FILTROS = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'activas', etiqueta: 'Activas' },
  { valor: 'completadas', etiqueta: 'Completadas' },
]

export default function App() {
  // useState con función inicializadora ("inicialización perezosa"):
  // cargarTareas solo se ejecuta en el primer dibujo de la app.
  const [tareas, setTareas] = useState(cargarTareas)

  // Texto del campo "nueva tarea" y filtro seleccionado
  const [nuevaTarea, setNuevaTarea] = useState('')
  const [filtro, setFiltro] = useState('todas')

  // useEffect: cada vez que cambia la lista de tareas,
  // se guarda automáticamente en localStorage.
  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(tareas))
  }, [tareas])

  // Añade una tarea nueva al enviar el formulario (botón o Enter)
  function agregarTarea(evento) {
    evento.preventDefault()
    const texto = nuevaTarea.trim()
    if (texto === '') return

    // Date.now() da un número único que sirve como identificador
    setTareas((previas) => [...previas, { id: Date.now(), texto, completada: false }])
    setNuevaTarea('')
  }

  // Marca o desmarca una tarea como completada.
  // Se usa .map() creando un objeto nuevo solo para esa tarea:
  // en React el estado no se modifica directamente, se reemplaza.
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

  // Lista según el filtro activo y contador de pendientes
  const visibles = tareas.filter((tarea) => {
    if (filtro === 'activas') return !tarea.completada
    if (filtro === 'completadas') return tarea.completada
    return true
  })
  const pendientes = tareas.filter((tarea) => !tarea.completada).length

  return (
    <main className="app">
      <h1>Mis tareas</h1>

      <form className="form-tarea" onSubmit={agregarTarea}>
        <input
          type="text"
          placeholder="¿Qué tienes que hacer?"
          autoComplete="off"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
        />
        <button type="submit">Añadir</button>
      </form>

      <div className="filtros">
        {FILTROS.map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            className={filtro === opcion.valor ? 'activo' : ''}
            onClick={() => setFiltro(opcion.valor)}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>

      <ul className="lista">
        {visibles.map((tarea) => (
          <TareaItem
            key={tarea.id}
            tarea={tarea}
            onAlternar={alternarTarea}
            onBorrar={borrarTarea}
          />
        ))}
      </ul>

      {visibles.length === 0 && (
        <p className="sin-tareas">No hay tareas en esta vista. ¡Añade la primera!</p>
      )}

      <footer className="app-pie">
        <span>
          {pendientes === 1 ? '1 tarea pendiente' : `${pendientes} tareas pendientes`}
        </span>
        <button type="button" id="borrar-completadas" onClick={borrarCompletadas}>
          Borrar completadas
        </button>
      </footer>
    </main>
  )
}
