import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { mensajesToCalendarEvents } from '../CalendarMessages';

const localizer = momentLocalizer(moment);

const MiniCard = ({ event }) => (
  <div className="bg-white border rounded shadow p-1 text-xs overflow-hidden">
    <div className="font-bold truncate">{event.title}</div>
    <div className="text-gray-500 truncate">{event.mensaje.descripcion || event.mensaje.mensaje || ''}</div>
  </div>
);

const CalendarView = ({ mensajes }) => {
  const events = mensajesToCalendarEvents(mensajes);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Calendario de Mensajes (por fecha de expiración)</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['month']}
        components={{ event: MiniCard }}
        messages={{
          month: 'Mes',
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
        }}
      />
    </div>
  );
};

export default CalendarView; 