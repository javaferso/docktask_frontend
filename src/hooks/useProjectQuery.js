import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { buildAxios } from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

export const useProjectQuery = (token) => {
  const axios = buildAxios(token);
  const qc = useQueryClient();
  

  const { data: proyectos = [], isLoading, error } = useQuery({
    queryKey: ['proyectos'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/proyectos');
        console.log('Respuesta de proyectos:', response.data); // Para debugging
        const proyectos = response.data || [];
        const user = jwtDecode(token);
        console.log("user_id", user.sub);
        const owner_id = user.sub;
        console.log("owner_id", owner_id);
        const filtradosPorOwner = proyectos.filter(proyecto => {
          const projectOwnerId = String(proyecto.owner_id);
          const userOwnerId = String(owner_id);
          console.log('Comparando IDs:', {
            projectOwnerId,
            userOwnerId,
            sonIguales: projectOwnerId === userOwnerId
          });
          return projectOwnerId === userOwnerId;
        });
        console.log("filtradosPorOwner", filtradosPorOwner);
        return filtradosPorOwner;
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        toast.error('Error al cargar los proyectos');
        return [];
      }
    },
    enabled: !!token,
    retry: 1,
    staleTime: 30000, // 30 segundos
    cacheTime: 60000 // 1 minuto
  });


  const crearProyecto = useMutation({
    mutationFn: async (nuevoProyecto) => {
      try {
        const response = await axios.post('/api/proyectos', nuevoProyecto);
        return response.data;
      } catch (error) {
        console.error('Error al crear proyecto:', error);
        toast.error('Error al crear el proyecto');
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries(['proyectos']);
      toast.success('Proyecto creado correctamente');
    }
  });

  const actualizarProyecto = useMutation({
    mutationFn: async ({ id, ...datos }) => {
      try {
        const response = await axios.put(`/api/proyectos/${id}`, datos);
        return response.data;
      } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        toast.error('Error al actualizar el proyecto');
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries(['proyectos']);
      toast.success('Proyecto actualizado correctamente');
    }
  });

  const eliminarProyecto = useMutation({
    mutationFn: async (id) => {
      try {
        await axios.delete(`/api/proyectos/${id}`);
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        toast.error('Error al eliminar el proyecto');
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries(['proyectos']);
      toast.success('Proyecto eliminado correctamente');
    }
  });

    return {
        proyectos,
        isLoading,
        error,
        crearProyecto,
        actualizarProyecto,
        eliminarProyecto
    };
};
