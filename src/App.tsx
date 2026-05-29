import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout';

import Login from './pages/public/Login';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Contracts from './pages/Contracts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* RUTA DE LOGIN (Pública) */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PROTEGIDAS Y ANIDADAS */}
        {/* 1. El cascarón principal protegido */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="contratos" element={<Contracts />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;