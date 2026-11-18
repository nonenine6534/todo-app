// ============================================================
// Utilidades de las tareas
//
// Aquí vive todo lo que NO es un componente de React:
// constantes (categorías y prioridades), lectura/escritura en
// localStorage, fechas y validación del archivo importado.
// Así App.jsx queda más limpio y cada función se puede
// explicar por separado en una entrevista.
// ============================================================

// Clave con la que se guarda la lista en localStorage
export const CLAVE_STORAGE = 'todo-app-tareas'

// Categorías disponibles para clasificar cada tarea
export const CATEGORIAS = ['Estudio', 'Personal', 'Trabajo', 'Otra']

// Prioridades disponibles. El "valor" se guarda en la tarea y
// la "etiqueta" es lo que se muestra en pantalla.
export const PRIORIDADES = [
  { valor: 'alta', etiqueta: 'Alta' },
  { valor: 'media', etiqueta: 'Media' },
  { valor: 'baja', etiqueta: 'Baja' },
]

// Valores por defecto: se usan cuando una tarea vieja (guardada
// antes de esta versión) no trae categoría, prioridad o fecha.
export const CATEGORIA_POR_DEFECTO = 'Otra'
export const PRIORIDAD_POR_DEFECTO = 'media'

// ------------------------------------------------------------
// Normalizar una tarea
// ------------------------------------------------------------
// Recibe un objeto cualquiera y devuelve una tarea "completa"
// y segura: si falta un campo, pone el valor por defecto.
// Esto permite que la app siga funcionando con datos guardados
// por versiones anteriores o con archivos importados a medias.
export function normalizarTarea(tarea) {
  return {
    id: tarea.id ?? Date.now() + Math.random(),
    texto: typeof tarea.texto === 'string' ? tarea.texto : '',
    completada: Boolean(tarea.completada),
    categoria: CATEGORIAS.includes(tarea.categoria)
      ? tarea.categoria
      : CATEGORIA_POR_DEFECTO,
    prioridad: PRIORIDADES.some((p) => p.valor === tarea.prioridad)
      ? tarea.prioridad
      : PRIORIDAD_POR_DEFECTO,
    // La fecha límite se guarda como texto "AAAA-MM-DD" o "" si no hay
    fechaLimite: typeof tarea.fechaLimite === 'string' ? tarea.fechaLimite : '',
  }
}

// ------------------------------------------------------------
// Persistencia en localStorage
// ------------------------------------------------------------

// Lee las tareas guardadas en el navegador.
// Si no hay nada guardado o el dato está dañado, devuelve [].
export function cargarTareas() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE))
    if (!Array.isArray(datos)) return []
    // Normalizamos cada tarea por si viene de una versión anterior
    return datos.map(normalizarTarea)
  } catch {
    return []
  }
}

// Guarda la lista completa en localStorage (como texto JSON)
export function guardarTareas(tareas) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas))
}

// ------------------------------------------------------------
// Fechas
// ------------------------------------------------------------

// Devuelve la fecha de hoy como texto "AAAA-MM-DD".
// Se construye con la hora LOCAL del navegador (no con UTC),
// para que "hoy" sea realmente hoy para el usuario.
export function fechaDeHoy() {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// Una tarea está vencida si tiene fecha límite, esa fecha ya
// pasó y todavía NO está completada.
// Como las fechas están en formato "AAAA-MM-DD", se pueden
// comparar directamente como textos (orden alfabético = orden cronológico).
export function esVencida(tarea) {
  if (!tarea.fechaLimite || tarea.completada) return false
  return tarea.fechaLimite < fechaDeHoy()
}

// Convierte "2026-11-20" en un texto más amable: "20 nov 2026".
// Si no hay fecha, devuelve cadena vacía.
export function formatearFecha(fechaLimite) {
  if (!fechaLimite) return ''
  // Se crea la fecha al mediodía para evitar problemas de zona horaria
  const fecha = new Date(`${fechaLimite}T12:00:00`)
  if (Number.isNaN(fecha.getTime())) return fechaLimite
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ------------------------------------------------------------
// Exportar / importar en formato JSON
// ------------------------------------------------------------

// Crea el contenido de texto que se va a descargar como archivo.
// Se usa JSON.stringify con sangría de 2 espacios para que el
// archivo se pueda leer y editar a mano si hace falta.
export function tareasAJSON(tareas) {
  return JSON.stringify(tareas, null, 2)
}

// Valida el texto leído de un archivo importado.
// Devuelve { ok: true, tareas } si el formato es correcto,
// o { ok: false, error } con un mensaje claro si no lo es.
//
// Formato esperado: un arreglo de objetos, cada uno con al
// menos un campo "texto" de tipo cadena no vacía.
export function validarTareasImportadas(textoArchivo) {
  let datos
  try {
    datos = JSON.parse(textoArchivo)
  } catch {
    return { ok: false, error: 'El archivo no contiene JSON válido.' }
  }

  if (!Array.isArray(datos)) {
    return { ok: false, error: 'El JSON debe ser una lista (arreglo) de tareas.' }
  }

  const algunaInvalida = datos.some(
    (item) =>
      !item ||
      typeof item !== 'object' ||
      typeof item.texto !== 'string' ||
      item.texto.trim() === ''
  )
  if (algunaInvalida) {
    return {
      ok: false,
      error: 'Cada tarea debe ser un objeto con un campo "texto" no vacío.',
    }
  }

  // Si todo está bien, normalizamos: completamos los campos que
  // falten y generamos un id nuevo si el importado se repite o falta.
  const idsUsados = new Set()
  const tareas = datos.map((item, indice) => {
    const tarea = normalizarTarea(item)
    if (idsUsados.has(tarea.id)) {
      tarea.id = Date.now() + indice
    }
    idsUsados.add(tarea.id)
    return tarea
  })

  return { ok: true, tareas }
}
