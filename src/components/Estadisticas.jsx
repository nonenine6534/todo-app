// ============================================================
// Componente Estadisticas: panel con el resumen de la lista
//
// Recibe por props los números ya calculados en App
// (total, completadas, pendientes y porcentaje) y solo se
// encarga de mostrarlos, incluida la barra de progreso.
// Es un componente "de presentación": no tiene estado propio.
// ============================================================

export default function Estadisticas({ total, completadas, pendientes, porcentaje }) {
  return (
    <section className="estadisticas" aria-label="Estadísticas de tareas">
      <div className="estadisticas-cifras">
        <div className="cifra">
          <span className="cifra-numero">{total}</span>
          <span className="cifra-etiqueta">Total</span>
        </div>
        <div className="cifra">
          <span className="cifra-numero">{completadas}</span>
          <span className="cifra-etiqueta">Completadas</span>
        </div>
        <div className="cifra">
          <span className="cifra-numero">{pendientes}</span>
          <span className="cifra-etiqueta">Pendientes</span>
        </div>
        <div className="cifra">
          <span className="cifra-numero">{porcentaje}%</span>
          <span className="cifra-etiqueta">Completado</span>
        </div>
      </div>

      {/* Barra de progreso: el ancho interior refleja el % */}
      <div
        className="barra-progreso"
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Progreso: ${porcentaje}% completado`}
      >
        <div className="barra-progreso-relleno" style={{ width: `${porcentaje}%` }} />
      </div>
    </section>
  )
}
