// ============================================================
// Componente FormularioTarea: el formulario para crear tareas
//
// Guarda su propio estado local (los campos que el usuario está
// escribiendo) y, al enviar, avisa a App con onAgregar(datos).
// App es quien realmente añade la tarea a la lista principal.
//
// Campos: texto, categoría, prioridad y fecha límite.
// ============================================================
import { useState } from 'react'
import { CATEGORIAS, PRIORIDADES } from '../utils/tareas.js'

export default function FormularioTarea({ onAgregar }) {
  // Estado local del formulario: un estado por cada campo
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('Estudio')
  const [prioridad, setPrioridad] = useState('media')
  const [fechaLimite, setFechaLimite] = useState('')

  // Al enviar el formulario (botón "Añadir" o tecla Enter)
  function manejarEnvio(evento) {
    evento.preventDefault()
    const textoLimpio = texto.trim()
    if (textoLimpio === '') return

    // Entregamos los datos a App y limpiamos los campos
    onAgregar({
      texto: textoLimpio,
      categoria,
      prioridad,
      fechaLimite,
    })
    setTexto('')
    setFechaLimite('')
    // Categoría y prioridad se dejan como están: es cómodo si
    // el usuario va a añadir varias tareas parecidas seguidas.
  }

  return (
    <form className="form-tarea" onSubmit={manejarEnvio}>
      {/* Fila principal: texto de la tarea + botón */}
      <div className="form-fila-principal">
        <input
          type="text"
          placeholder="¿Qué tienes que hacer?"
          autoComplete="off"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Texto de la nueva tarea"
        />
        <button type="submit">Añadir</button>
      </div>

      {/* Fila de opciones: categoría, prioridad y fecha límite */}
      <div className="form-opciones">
        <label>
          Categoría
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prioridad
          <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
            {PRIORIDADES.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha límite
          <input
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />
        </label>
      </div>
    </form>
  )
}
