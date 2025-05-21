// Helper para transformar mensajes a eventos para react-big-calendar
export function mensajesToCalendarEvents(mensajes) {
  if (!Array.isArray(mensajes)) return [];
  return mensajes
    .filter(m => m.expiration_date)
    .map(m => ({
      id: m.id,
      title: m.nombre || m.mensaje || 'Mensaje',
      start: new Date(m.expiration_date),
      end: new Date(m.expiration_date),
      mensaje: m
    }));
} 