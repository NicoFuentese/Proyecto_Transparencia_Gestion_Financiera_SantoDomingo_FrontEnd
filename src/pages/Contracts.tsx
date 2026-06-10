import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, Download, Search, Loader2, Plus, Trash2, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../services/api"; // Cliente Axios configurado
import { toast } from "sonner"; // Sistema de notificaciones requerido

// Interfaz TypeScript basada en tu modelo de Prisma
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
  
  // Estados de carga y datos
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para el Modal de Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    proveedor: "",
    monto: "",
    fechaInicio: "",
    departamentoId: "1" // Quemado temporalmente o dinámico según tu BD
  });

  // Función para obtener los contratos desde la API
  const fetchContratos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/contratos'); 
      
      if (response.data.success) {
        const backendData = response.data.data.map((item: any) => ({
          id: item.id,
          tipo: item.tipo || "Licitación Pública", 
          descripcion: item.titulo, // Mapeado desde 'titulo' de Prisma
          proveedor: item.proveedor,
          monto: Number(item.monto),
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

  useEffect(() => {
    fetchContratos();
  }, []);

  // Handler para Crear Contrato (POST)
  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Registrando nuevo contrato...");
    setIsSubmitting(true);

    try {
      // Formateamos los datos para cumplir con el esquema del backend
      const payload = {
        titulo: formData.titulo,
        proveedor: formData.proveedor,
        monto: parseFloat(formData.monto),
        fechaInicio: formData.fechaInicio,
        departamentoId: parseInt(formData.departamentoId)
      };

      const response = await api.post('/admin/contratos', payload);

      if (response.data.success) {
        toast.success("Contrato creado exitosamente.", { id: toastId });
        setIsModalOpen(false);
        // Resetear formulario
        setFormData({ titulo: "", proveedor: "", monto: "", fechaInicio: "", departamentoId: "1" });
        // Recargar lista adaptada
        fetchContratos();
      }
    } catch (err: any) {
      console.error("Error al crear contrato:", err);
      toast.error(err.response?.data?.message || "Error al guardar el contrato.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para Eliminar Contrato (DELETE)
  const handleDeleteContract = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este contrato? This action cannot be undone.")) return;
    
    const toastId = toast.loading("Eliminando contrato...");

    try {
      const response = await api.delete(`/admin/contratos/${id}`);

      if (response.data.success) {
        toast.success("Contrato eliminado correctamente.", { id: toastId });
        fetchContratos(); // Actualizar la tabla en tiempo real
      }
    } catch (err: any) {
      console.error("Error al eliminar:", err);
      toast.error("No se pudo eliminar el contrato seleccionado.", { id: toastId });
    }
  };

  // Filtros y utilidades de renderizado
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

  const generateChartData = () => {
    const dataMap: Record<string, number> = {};
    contracts.forEach(c => {
      const key = c.proveedor.length > 15 ? c.proveedor.substring(0, 15) + "..." : c.proveedor; 
      dataMap[key] = (dataMap[key] || 0) + c.monto;
    });
    return Object.keys(dataMap).map(key => ({
      name: key,
      value: dataMap[key]
    })).slice(0, 5);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Cargando contratos desde el servidor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button onClick={fetchContratos} className="bg-blue-600 text-white px-4 py-2 rounded">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contrataciones y Compras</h1>
            <p className="text-gray-600">Licitaciones, contratos vigentes y proveedores del municipio</p>
          </div>
          {/* Botón para abrir el Modal CRUD */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors self-start md:self-auto shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Crear Contrato
          </button>
        </div>

        {/* Summary Indicators */}
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

        {/* Chart View */}
        {contracts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución por Proveedor (Top 5)</h2>
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

        {/* Search Bar and Download Action */}
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

        {/* Data Table with Actions */}
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{contract.fecha}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${contract.estado === "Vigente" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                          {contract.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium">
                        <button
                          onClick={() => handleDeleteContract(contract.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="Eliminar Contrato"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL / DIALOG DE CREACIÓN DE CONTRATO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Contrato</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateContract} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título / Descripción</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Adquisición de Luminarias Públicas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <input
                  type="text"
                  required
                  value={formData.proveedor}
                  onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Distribuidora Eléctrica Chile S.A."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto (CLP)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID de Departamento Asociado</label>
                <input
                  type="number"
                  required
                  value={formData.departamentoId}
                  onChange={(e) => setFormData({ ...formData, departamentoId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}