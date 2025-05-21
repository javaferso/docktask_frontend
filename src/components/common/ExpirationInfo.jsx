import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { CalendarIcon } from '@heroicons/react/24/outline/index.js';

const ExpirationInfo = ({ expirationDate, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(
    expirationDate ? new Date(expirationDate) : null
  );

  const handleDateChange = (date) => {
    console.log('ExpirationInfo - Fecha recibida del DatePicker:', date);
    console.log('ExpirationInfo - Tipo de fecha:', typeof date);
    console.log('ExpirationInfo - Es instancia de Date:', date instanceof Date);
    
    setSelectedDate(date);
    
    if (!onDateChange) {
      console.error('ExpirationInfo - onDateChange no está definido');
      return;
    }

    if (!date) {
      console.log('ExpirationInfo - Enviando fecha null');
      onDateChange(null);
      return;
    }

    try {
      // Formatear la fecha en formato YYYY-MM-DDTHH:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      console.log('ExpirationInfo - Fecha formateada a enviar:', formattedDate);
      if (formattedDate) {
        // Asegurarnos de que la fecha se pasa como string
        const fechaString = String(formattedDate);
        console.log('ExpirationInfo - Fecha como string:', fechaString);
        onDateChange(fechaString);
      } else {
        console.error('ExpirationInfo - Error al formatear la fecha');
      }
    } catch (error) {
      console.error('ExpirationInfo - Error al formatear fecha:', error);
      console.error('ExpirationInfo - Fecha que causó el error:', date);
    }
  };

  const getExpirationStatus = (date) => {
    if (!date) return { type: 'info', message: 'Sin fecha de expiración' };
    
    const now = new Date();
    const expiration = new Date(date);
    
    if (isNaN(expiration.getTime())) {
      return { type: 'error', message: 'Fecha inválida' };
    }

    const diffDays = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { type: 'error', message: 'Expirado' };
    } else if (diffDays <= 7) {
      return { type: 'warning', message: `Expira en ${diffDays} días` };
    } else {
      return { 
        type: 'success', 
        message: `Expira el ${expiration.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`
      };
    }
  };

  const status = getExpirationStatus(selectedDate);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center text-sm">
        <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
        <div className="flex-grow">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            locale={es}
            dateFormat="dd/MM/yyyy HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Hora"
            placeholderText="Seleccionar fecha y hora"
            isClearable
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            customInput={
              <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            }
          />
        </div>
      </div>
      
      {selectedDate && (
        <div className={`text-sm ${
          status.type === 'error' ? 'text-red-500' :
          status.type === 'warning' ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default ExpirationInfo;
