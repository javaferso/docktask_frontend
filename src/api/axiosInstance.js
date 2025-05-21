// src/api/axiosInstance.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL =
  (typeof import.meta !== 'undefined' &&
   import.meta.env?.VITE_API_URL)            // Vite
  || process.env.REACT_APP_API_URL           // CRA
  || 'http://localhost:5000';                // fallback local

export const buildAxios = (token) => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
  });

  // Interceptor de respuesta
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Redirigir al login cuando hay un error 401
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return instance;
};
