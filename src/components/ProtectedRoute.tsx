import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const token = localStorage.getItem('jwt_token');
    const userDataString = localStorage.getItem('user_data');
    
    // 1. Si no hay token, lo devolvemos al login
    if (!token || !userDataString) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userDataString);
        
        // 2. Si la ruta exige ser ADMIN y el usuario no lo es, lo mandamos a la vista pública
        if (requireAdmin && user.rol !== 'ADMIN') {
            return <Navigate to="/home" replace />;
        }
        
        // 3. Si todo está correcto, renderiza la vista de tu prototipo
        return children;
        
    } catch (error) {
        // Si alguien manipuló el localStorage, lo enviamos al login
        return <Navigate to="/login" replace />;
    }
}