import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMensajesQuery } from '../../hooks/useMensajesQuery';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import MessagesBoardView from '../views/MessagesBoardView';
import CalendarView from '../../views/CalendarView';
import ViewSwitcher from '../common/ViewSwitcher';
import GanttBoard from '../GanttBoard';
const MessagesContainer = ({ token }) => {
  const navigate = useNavigate();
  const { mensajes = [], isLoading, error, eliminarMensaje, cambiarEstado, duplicarMensaje, actualizarFechaExpiracion } = useMensajesQuery(token);
  const [draggedMensaje, setDraggedMensaje] = useState(null);
  const [currentDroppableId, setCurrentDroppableId] = useState(null);
  const [activeView, setActiveView] = useState('board');

  useEffect(() => {
    if (error) {
      console.error('Error en MessagesContainer:', error);
      toast.error('Error al cargar los mensajes');
    }
  }, [error]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el mensaje de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await eliminarMensaje.mutateAsync(id);
        toast.success('Mensaje eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar el mensaje:', error);
        toast.error('Error al eliminar el mensaje');
      }
    }
  };

  const handleEdit = (mensaje) => {
    navigate(`/edit/${mensaje.id}`);
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await cambiarEstado.mutateAsync({ id, estado: nuevoEstado });
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDuplicar = async (mensaje) => {
    try {
      await duplicarMensaje.mutateAsync(mensaje.id);
      toast.success('Mensaje duplicado correctamente');
    } catch (error) {
      console.error('Error al duplicar el mensaje:', error);
      toast.error('Error al duplicar el mensaje');
    }
  };

  const handleFechaExpiracionChange = async (id, fecha) => {
    try {
      console.log('MessagesContainer - Parámetros recibidos:', { id, fecha });
      console.log('MessagesContainer - ID recibido:', id);
      console.log('MessagesContainer - Fecha recibida:', fecha);
      console.log('MessagesContainer - Tipo de fecha:', typeof fecha);

      if (!id) {
        console.error('MessagesContainer - ID no proporcionado');
        throw new Error('ID del mensaje es requerido');
      }

      if (fecha === undefined || fecha === null) {
        console.error('MessagesContainer - Fecha no proporcionada');
        throw new Error('La fecha es requerida');
      }

      // Validar formato de fecha
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!dateRegex.test(fecha)) {
        console.error('MessagesContainer - Formato de fecha inválido:', fecha);
        throw new Error('Formato de fecha inválido');
      }

      console.log('MessagesContainer - Enviando al servidor:', { id, fecha });
      const response = await actualizarFechaExpiracion.mutateAsync({ 
        id: id, 
        expiration_date: fecha 
      });
      console.log('MessagesContainer - Respuesta del servidor:', response);
      toast.success('Fecha de expiración actualizada correctamente');
    } catch (error) {
      console.error('MessagesContainer - Error al actualizar la fecha:', error);
      toast.error(error.message || 'Error al actualizar la fecha de expiración');
    }
  };

  const handleCreateClick = () => {
    navigate('/create');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleDragStart = (e, mensaje) => {
    setDraggedMensaje(mensaje);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', mensaje.id);
  };

  const handleDragEnd = () => {
    setDraggedMensaje(null);
    setCurrentDroppableId(null);
  };

  const handleDragOver = (e, estado) => {
    e.preventDefault();
    setCurrentDroppableId(estado);
  };

  const handleDrop = async (e, estado) => {
    e.preventDefault();
    if (draggedMensaje && draggedMensaje.estado !== estado) {
      try {
        await cambiarEstado.mutateAsync({ id: draggedMensaje.id, estado });
        toast.success('Estado actualizado correctamente');
      } catch (error) {
        console.error('Error al actualizar el estado:', error);
        toast.error('Error al actualizar el estado');
      }
    }
    setDraggedMensaje(null);
    setCurrentDroppableId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ViewSwitcher activeView={activeView} onChange={setActiveView} />
      {activeView === 'board' && (
        <MessagesBoardView
          mensajes={mensajes}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onEstadoChange={handleEstadoChange}
          onDuplicar={handleDuplicar}
          onFechaExpiracionChange={handleFechaExpiracionChange}
          onCreateClick={handleCreateClick}
          onRetry={handleRetry}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      )}
      {activeView === 'tasks' && (
        <div className="text-center text-gray-500 py-20 text-xl">Próximamente: vista de tareas</div>
      )}
      {activeView === 'calendar' && (
        <CalendarView mensajes={mensajes} />
      )}
      {activeView === 'gantt' && (
        <GanttBoard 
          mensajes={mensajes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEstadoChange={handleEstadoChange}
          onFechaExpiracionChange={handleFechaExpiracionChange}
         />
      )}
    </div>
  );
};

export default MessagesContainer; 