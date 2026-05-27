import api from './api';

export const authService = {
    login: async (email: string, password: string) => {
        // Llama al endpoint que estandarizamos en el backend
        const response = await api.post('/auth/login', { email, password });
        
        // Si el login es exitoso, guardamos el token y los datos en localStorage
        if (response.data.success) {
            localStorage.setItem('jwt_token', response.data.data.token);
            localStorage.setItem('user_data', JSON.stringify(response.data.data.usuario));
        }
        
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
    }
};