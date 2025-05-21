import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

function EditProject({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({});


  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/proyectos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const project = res.data.find((p) => p.id === parseInt(id));
        if (project) setProject(project);
      })
      .catch((err) => console.error("Error al cargar proyecto", err));
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:5000/api/proyectos/${id}`,
        {
          ...project,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Proyecto actualizado exitosamente");
        navigate("/mis-proyectos");
      })
      .catch((err) => {
        toast.error("Error al actualizar el proyecto");
        console.error("Error al actualizar", err);
      });
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Proyecto</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={project.nombre}
            onChange={(e) => setProject({ ...project, nombre: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
            <label htmlFor="owner_id" className="block text-gray-700 text-sm font-bold mb-2">
                Owner
            </label>
            <input
                type="text"
                id="owner_id"
                value={project.owner_id}
                onChange={(e) => setProject({ ...project, owner_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">
                Estado
            </label>
            <select
                id="estado"
                value={project.estado}
                onChange={(e) => setProject({ ...project, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
            </select>
        </div>  
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={project.descripcion}
            onChange={(e) => setProject({ ...project, descripcion: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
            <label htmlFor="fechaInicio" className="block text-gray-700 text-sm font-bold mb-2">
                Fecha de inicio
            </label>
            <input
                type="date"
                id="fechaInicio"
                value={project.fechaInicio}
                onChange={(e) => setProject({ ...project, fechaInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div>
            <label htmlFor="fechaFin" className="block text-gray-700 text-sm font-bold mb-2">
                Fecha de fin
            </label>
            <input
                type="date"
                id="fechaFin"
                value={project.fechaFin}
                onChange={(e) => setProject({ ...project, fechaFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">Actualizar</button>
        </div>
      </form>
    </div>
  );
}

export default EditProject;
