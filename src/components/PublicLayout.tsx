import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cabecera del Portal Ciudadano */}
      <Header />
      
      {/* Contenido dinámico (Aquí entrará tu Home.tsx o Categorias.tsx) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Pie de página del municipio */}
      <Footer />
    </div>
  );
}