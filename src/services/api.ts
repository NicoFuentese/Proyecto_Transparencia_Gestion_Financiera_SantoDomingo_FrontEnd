// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    // VITE_API_URL fue definido en tu compose.yaml
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de Solicitud: Adjunta el JWT si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Maneja tokens expirados
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Sesión expirada o credenciales inválidas');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_data');
            // Redirigir al login si el token es rechazado por el backend
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;