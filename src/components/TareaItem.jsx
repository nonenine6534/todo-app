// Componente TareaItem: dibuja UNA fila de la lista de tareas.
//
// Recibe por "props":
//   - tarea:     el objeto { id, texto, completada }
//   - onAlternar: función que marca/desmarca la tarea como completada
//   - onBorrar:   función que elimina la tarea
// El componente no guarda estado propio: solo muestra datos y
// avisa hacia arriba (a App) cuando el usuario actúa.
export default function TareaItem({ tarea, onAlternar, onBorrar }) {
  return (
    <li className={tarea.completada ? 'completada' : ''}>
      <input
        type="checkbox"
        checked={tarea.completada}
        onChange={() => onAlternar(tarea.id)}
      />
      <span className="texto">{tarea.texto}</span>
      <button
        type="button"
        className="btn-borrar"
        title="Borrar tarea"
        onClick={() => onBorrar(tarea.id)}
      >
        ✕
      </button>
    </li>
  )
}
