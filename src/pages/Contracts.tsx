import { useState } from "react";
import { useLocation, Link } from "react-router";
import { ChevronLeft, Download, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const contractsData = [
  {
    id: 1,
    tipo: "Licitación Pública",
    descripcion: "Construcción de Plaza Comunitaria Sector Norte",
    proveedor: "Constructora Horizon SpA",
    monto: 145000000,
    fecha: "15/02/2026",
    estado: "Vigente",
  },
  {
    id: 2,
    tipo: "Trato Directo",
    descripcion: "Suministro de combustible para vehículos municipales",
    proveedor: "Copec S.A.",
    monto: 28500000,
    fecha: "01/03/2026",
    estado: "Vigente",
  },
  {
    id: 3,
    tipo: "Licitación Pública",
    descripcion: "Mantención y reparación de luminarias públicas",
    proveedor: "Electro Servicios Ltda.",
    monto: 62000000,
    fecha: "10/01/2026",
    estado: "Vigente",
  },
  {
    id: 4,
    tipo: "Convenio Marco",
    descripcion: "Adquisición de equipamiento computacional",
    proveedor: "TechSolutions Chile S.A.",
    monto: 35000000,
    fecha: "20/03/2026",
    estado: "En ejecución",
  },
  {
    id: 5,
    tipo: "Licitación Pública",
    descripcion: "Servicio de recolección de residuos domiciliarios",
    proveedor: "Gestión Ambiental del Sur",
    monto: 185000000,
    fecha: "05/01/2026",
    estado: "Vigente",
  },
  {
    id: 6,
    tipo: "Trato Directo",
    descripcion: "Arriendo de maquinaria para obras viales",
    proveedor: "Maquinarias y Equipos S.A.",
    monto: 18000000,
    fecha: "12/03/2026",
    estado: "Vigente",
  },
  {
    id: 7,
    tipo: "Licitación Privada",
    descripcion: "Remodelación de dependencias municipales",
    proveedor: "Arquitectura y Construcción Ltda.",
    monto: 92000000,
    fecha: "28/02/2026",
    estado: "En ejecución",
  },
];

const chartData = [
  { name: "Construcción", value: 237000000 },
  { name: "Servicios", value: 213500000 },
  { name: "Suministros", value: 63500000 },
  { name: "Equipamiento", value: 35000000 },
  { name: "Arriendo", value: 18000000 },
];

export default function Contracts() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContracts = contractsData.filter(
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

  const totalContracts = contractsData.reduce((sum, item) => sum + item.monto, 0);

  const handleDownload = () => {
    const csv = [
      ["Tipo", "Descripción", "Proveedor", "Monto", "Fecha", "Estado"],
      ...contractsData.map((c) => [c.tipo, c.descripcion, c.proveedor, c.monto, c.fecha, c.estado]),
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
            <p className="text-3xl font-bold text-gray-900">{contractsData.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Proveedores Únicos</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(contractsData.map(c => c.proveedor)).size}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Distribución por Tipo de Contratación
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="value" fill="#1e40af" name="Monto Contratado" />
            </BarChart>
          </ResponsiveContainer>
        </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
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
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          contract.estado === "Vigente"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {contract.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
