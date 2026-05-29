import { useState } from "react";
import { useLocation, Link } from "react-router";
import { ChevronLeft, Download, ChevronDown, ChevronUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const budgetData = [
  { name: "Obras Públicas", value: 38, amount: 171190000 },
  { name: "Educación", value: 25, amount: 112625000 },
  { name: "Salud", value: 18, amount: 81090000 },
  { name: "Servicios Comunitarios", value: 12, amount: 54060000 },
  { name: "Administración", value: 7, amount: 31535000 },
];

const COLORS = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

export default function Budget() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [showDetails, setShowDetails] = useState(false);

  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const handleDownload = () => {
    const csv = [
      ["Categoría", "Porcentaje", "Monto"],
      ...budgetData.map((item) => [item.name, `${item.value}%`, item.amount]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presupuesto-${month}-${year}.csv`;
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
            <span className="text-gray-900">Ejecución Presupuestaria</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ejecución Presupuestaria
          </h1>
          <p className="text-gray-600">
            Distribución del gasto municipal por categoría
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Distribución del Presupuesto
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with amounts */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Montos por Categoría
              </h2>
              <div className="space-y-3">
                {budgetData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{item.value}%</p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">Total</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(totalBudget)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Citizen Explanation */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            ¿Qué significa esto para la comunidad?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Durante {month} de {year}, el municipio destinó <strong>el 38% del presupuesto a Obras Públicas</strong>, 
            lo que equivale a {formatCurrency(budgetData[0].amount)}. Esto incluye reparación de calles, 
            mejoramiento de plazas y construcción de infraestructura comunitaria. El segundo mayor gasto 
            fue <strong>Educación (25%)</strong>, destinado a mejorar la calidad de las escuelas municipales 
            y programas educativos. La inversión en Salud representa un 18% del total, enfocada en atención 
            primaria y programas preventivos.
          </p>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Detalle completo del presupuesto
            </h2>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showDetails && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Porcentaje
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {budgetData.map((item) => (
                      <tr key={item.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.value}%</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">100%</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        {formatCurrency(totalBudget)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDownload}
                  className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar datos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
