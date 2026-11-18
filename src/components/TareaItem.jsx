// ============================================================
// Componente TareaItem: dibuja UNA fila de la lista de tareas.
//
// Muestra: casilla de completada, texto, categoría, distintivo
// de prioridad con color y fecha límite (en rojo si venció).
//
// Edición en línea: con doble clic sobre el texto o con el
// botón "Editar" el texto se convierte en un campo editable.
// - Enter o botón Guardar  -> confirma el cambio (avisa a App)
// - Escape o botón Cancelar -> descarta el cambio
//
// Recibe por "props":
//   - tarea:     el objeto completo de la tarea
//   - onAlternar: marca/desmarca la tarea como completada
//   - onBorrar:   elimina la tarea
//   - onEditar:   guarda el nuevo texto de la tarea
// ============================================================
import { useState } from 'react'
import { esVencida, formatearFecha } from '../utils/tareas.js'

// Texto bonito para cada prioridad (el color lo pone el CSS
// con la clase prioridad-alta / prioridad-media / prioridad-baja)
const ETIQUETA_PRIORIDAD = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export default function TareaItem({ tarea, onAlternar, onBorrar, onEditar }) {
  // Estado local de edición: ¿estamos editando? ¿qué texto hay?
  const [editando, setEditando] = useState(false)
  const [textoEditado, setTextoEditado] = useState(tarea.texto)

  const vencida = esVencida(tarea)

  // Entra en modo edición copiando el texto actual al campo
  function empezarEdicion() {
    setTextoEditado(tarea.texto)
    setEditando(true)
  }

  // Guarda si el texto no quedó vacío; si quedó vacío, cancela
  function guardarEdicion() {
    const textoLimpio = textoEditado.trim()
    if (textoLimpio === '') {
      cancelarEdicion()
      return
    }
    onEditar(tarea.id, textoLimpio)
    setEditando(false)
  }

  function cancelarEdicion() {
    setTextoEditado(tarea.texto)
    setEditando(false)
  }

  // Atajos de teclado dentro del campo de edición
  function manejarTecla(evento) {
    if (evento.key === 'Enter') guardarEdicion()
    if (evento.key === 'Escape') cancelarEdicion()
  }

  // Clases del <li>: completada y/o vencida cambian su aspecto
  const clases = [tarea.completada ? 'completada' : '', vencida ? 'vencida' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <li className={clases}>
      <input
        type="checkbox"
        checked={tarea.completada}
        onChange={() => onAlternar(tarea.id)}
        aria-label={`Marcar "${tarea.texto}" como completada`}
      />

      <div className="tarea-cuerpo">
        {editando ? (
          // ---- Modo edición: campo + Guardar / Cancelar ----
          <div className="edicion">
            <input
              type="text"
              className="input-edicion"
              value={textoEditado}
              onChange={(e) => setTextoEditado(e.target.value)}
              onKeyDown={manejarTecla}
              autoFocus
              aria-label="Editar texto de la tarea"
            />
            <button type="button" className="btn-guardar" onClick={guardarEdicion}>
              Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={cancelarEdicion}>
              Cancelar
            </button>
          </div>
        ) : (
          // ---- Modo normal: texto (doble clic para editar) ----
          <span
            className="texto"
            onDoubleClick={empezarEdicion}
            title="Doble clic para editar"
          >
            {tarea.texto}
          </span>
        )}

        {/* Metadatos: categoría, prioridad y fecha límite */}
        {!editando && (
          <div className="tarea-meta">
            <span className="insignia insignia-categoria">{tarea.categoria}</span>
            <span className={`insignia prioridad-${tarea.prioridad}`}>
              {ETIQUETA_PRIORIDAD[tarea.prioridad] || tarea.prioridad}
            </span>
            {tarea.fechaLimite && (
              <span className={`fecha-limite ${vencida ? 'fecha-vencida' : ''}`}>
                📅 {formatearFecha(tarea.fechaLimite)}
                {vencida && ' · ¡Vencida!'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Acciones de la fila (no se muestran mientras se edita) */}
      {!editando && (
        <div className="tarea-acciones">
          <button
            type="button"
            className="btn-editar"
            title="Editar tarea"
            onClick={empezarEdicion}
          >
            ✎
          </button>
          <button
            type="button"
            className="btn-borrar"
            title="Borrar tarea"
            onClick={() => onBorrar(tarea.id)}
          >
            ✕
          </button>
        </div>
      )}
    </li>
  )
}
