// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

//vistas
import Login from './pages/public/Login';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Contracts from './pages/Contracts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        {/*Sin inicio d sesion*/}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Rutas Protegidas */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/contratos" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Contracts />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección por defecto: Si alguien entra a la raíz '/', lo mandamos al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Aquí agregaremos las Rutas Protegidas en el próximo paso */}
        {/* <Route path="/admin/dashboard" element={<AdminPanel />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;