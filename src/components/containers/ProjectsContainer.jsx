import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectQuery } from '../../hooks/useProjectQuery';
import { toast } from 'react-toastify';
import ProjectsView from '../views/ProjectsView';

const ProjectsContainer = ({ token }) => {
  const navigate = useNavigate();
  const { proyectos = [], isLoading, error, eliminarProyecto, actualizarProyecto } = useProjectQuery(token);
  const [proyectoEditando, setProyectoEditando] = useState(null);

  // Efecto para manejar errores
  useEffect(() => {
    if (error) {
      console.error('Error en ProjectsContainer:', error);
      toast.error('Error al cargar los proyectos');
    }
  }, [error]);

  const handleDelete = async (id) => {
    try {
      await eliminarProyecto.mutateAsync(id);
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      toast.error('Error al eliminar el proyecto');
    }
  };

  const handleEdit = (proyecto) => {
    setProyectoEditando(proyecto);
    navigate(`/editar-proyecto/${proyecto.id}`);
  };

  const handleCreateClick = () => {
    navigate('/crear-proyecto');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <ProjectsView
      proyectos={proyectos}
      isLoading={isLoading}
      error={error}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onCreateClick={handleCreateClick}
      onRetry={handleRetry}
    />
  );
};

export default ProjectsContainer; 