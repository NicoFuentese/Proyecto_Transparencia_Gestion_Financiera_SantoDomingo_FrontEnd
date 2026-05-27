import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/public/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Redirección por defecto: Si alguien entra a la raíz '/', lo mandamos al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Aquí agregaremos las Rutas Protegidas en el próximo paso */}
        {/* <Route path="/admin/dashboard" element={<AdminPanel />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;