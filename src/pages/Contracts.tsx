import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Asegúrate de usar react-router-dom
import { ChevronLeft, Download, Search, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../services/api"; // 1. Importamos tu cliente Axios configurado

// 2. Definimos la interfaz TypeScript basada en tu modelo de Prisma
interface Contract {
  id: number;
  tipo: string;
  descripcion: string;
  proveedor: string;
  monto: number;
  fecha: string;
  estado: string;
}

export default function Contracts() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Actual", year: "2026" };
  
  // 3. Estados dinámicos para almacenar los datos del backend
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 4. Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const fetchContratos = async () => {
      try {
        setIsLoading(true);
        // Consumimos el endpoint (Ajusta la ruta según tu backend, ej: /admin/contratos o /public/contratos)
        const response = await api.get('/admin/contratos'); 
        
        if (response.data.success) {
          // Mapeamos los datos de Prisma al formato que espera tu tabla
          const backendData = response.data.data.map((item: any) => ({
            id: item.id,
            tipo: item.tipo || "Licitación Pública", // Fallback si no existe en BD
            descripcion: item.titulo, // En tu esquema Prisma lo llamamos 'titulo'
            proveedor: item.proveedor,
            monto: item.monto,
            fecha: new Date(item.fechaInicio).toLocaleDateString('es-CL'),
            estado: item.estado || "Vigente"
          }));
          setContracts(backendData);
        }
      } catch (err: any) {
        console.error("Error al obtener contratos:", err);
        setError("No se pudieron cargar los contratos. Verifica tu conexión.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContratos();
  }, []);

  // 5. Cálculos derivados (Ahora se hacen sobre la variable 'contracts' real)
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const totalContracts = contracts.reduce((sum, item) => sum + item.monto, 0);

  // 6. Generación dinámica de datos para el gráfico basada en los proveedores reales
  const generateChartData = () => {
    const dataMap: Record<string, number> = {};
    contracts.forEach(c => {
      // Agrupamos por proveedor (o podrías agrupar por 'tipo')
      const key = c.proveedor.substring(0, 15) + "..."; 
      dataMap[key] = (dataMap[key] || 0) + c.monto;
    });
    return Object.keys(dataMap).map(key => ({
      name: key,
      value: dataMap[key]
    })).slice(0, 5); // Mostramos los top 5
  };

  const handleDownload = () => {
    const csv = [
      ["Tipo", "Descripción", "Proveedor", "Monto", "Fecha", "Estado"],
      ...contracts.map((c) => [c.tipo, c.descripcion, c.proveedor, c.monto, c.fecha, c.estado]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrataciones-${month}-${year}.csv`;
    a.click();
  };

  // Pantalla de Carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Cargando contratos desde el servidor...</p>
      </div>
    );
  }

  // Pantalla de Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link to="/categorias" state={{ month, year }} className="hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Categorías
            </Link>
            <span>/</span>
            <span className="text-gray-900">Contrataciones y Compras</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contrataciones y Compras
          </h1>
          <p className="text-gray-600">
            Licitaciones, contratos vigentes y proveedores del municipio
          </p>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Contratado</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalContracts)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Contratos Activos</p>
            <p className="text-3xl font-bold text-gray-900">{contracts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Proveedores Únicos</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(contracts.map(c => c.proveedor)).size}
            </p>
          </div>
        </div>

        {/* Chart */}
        {contracts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Distribución por Proveedor (Top 5)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generateChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="value" fill="#1e40af" name="Monto Contratado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Search and Download */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descripción o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleDownload}
              className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2 justify-center"
              disabled={contracts.length === 0}
            >
              <Download className="w-4 h-4" />
              Descargar CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron contratos.
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{contract.tipo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contract.descripcion}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contract.proveedor}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                        {formatCurrency(contract.monto)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        {contract.fecha}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${contract.estado === "Vigente" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                          {contract.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}