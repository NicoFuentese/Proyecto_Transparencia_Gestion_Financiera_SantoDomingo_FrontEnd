import { useLocation, Link } from "react-router";
import { ChevronLeft, Download } from "lucide-react";

const organizationStructure = {
  alcalde: {
    name: "Carlos Andrés Valenzuela Rojas",
    position: "Alcalde",
    description: "Máxima autoridad comunal, responsable de la dirección superior del municipio",
  },
  departments: [
    {
      name: "Secretaría Municipal",
      head: "Patricia Núñez Pérez",
      description: "Responsable de la gestión administrativa y coordinación de las actividades municipales",
      subdepartments: ["Oficina de Partes", "Archivo Municipal", "Protocolo"],
    },
    {
      name: "Dirección de Obras Municipales (DOM)",
      head: "Juan Pérez González",
      description: "Supervisión y aprobación de proyectos de construcción en la comuna",
      subdepartments: ["Inspección Técnica", "Permisos de Edificación", "Urbanismo"],
    },
    {
      name: "Dirección de Tránsito y Transporte Público",
      head: "Roberto Castro Soto",
      description: "Gestión de permisos de circulación y fiscalización del tránsito",
      subdepartments: ["Licencias de Conducir", "Permisos de Circulación", "Fiscalización"],
    },
    {
      name: "Dirección de Desarrollo Comunitario (DIDECO)",
      head: "Ana Torres Vargas",
      description: "Programas sociales, educación, salud y deportes comunitarios",
      subdepartments: ["Programas Sociales", "Deportes y Recreación", "Cultura", "Organizaciones Comunitarias"],
    },
    {
      name: "Dirección de Administración y Finanzas",
      head: "Carlos Muñoz Díaz",
      description: "Gestión financiera, contable y de recursos humanos",
      subdepartments: ["Contabilidad", "Presupuesto", "Recursos Humanos", "Adquisiciones"],
    },
    {
      name: "Dirección de Aseo y Ornato",
      head: "Jorge Hernández Ruiz",
      description: "Mantención de espacios públicos, recolección de residuos y áreas verdes",
      subdepartments: ["Recolección de Basura", "Mantención de Plazas", "Áreas Verdes"],
    },
    {
      name: "Asesoría Jurídica",
      head: "Valeria Morales Sáez",
      description: "Asesoría legal y representación judicial del municipio",
      subdepartments: ["Contratos", "Litigios", "Normativa"],
    },
    {
      name: "Departamento de Educación Municipal",
      head: "María Silva Rojas",
      description: "Administración de establecimientos educacionales municipales",
      subdepartments: ["Escuelas Básicas", "Liceos", "Jardines Infantiles"],
    },
  ],
};

export default function Organization() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };

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
            <span className="text-gray-900">Estructura y Organización</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Estructura y Organización Municipal
          </h1>
          <p className="text-gray-600">
            Organigrama y descripción de las unidades del municipio
          </p>
        </div>

        {/* Alcalde Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="text-center pb-6 border-b border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl font-bold text-[#1e40af]">A</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {organizationStructure.alcalde.name}
            </h2>
            <p className="text-lg text-[#1e40af] font-semibold mb-2">
              {organizationStructure.alcalde.position}
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {organizationStructure.alcalde.description}
            </p>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Direcciones y Departamentos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {organizationStructure.departments.map((dept, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-[#1e40af] font-semibold mb-3">
                  Director(a): {dept.head}
                </p>
                <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                
                {dept.subdepartments && dept.subdepartments.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Subdepartamentos:</p>
                    <div className="flex flex-wrap gap-2">
                      {dept.subdepartments.map((sub, subIndex) => (
                        <span
                          key={subIndex}
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visual Organigrama */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Organigrama Municipal</h2>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Alcalde */}
              <div className="flex justify-center mb-8">
                <div className="bg-[#1e40af] text-white px-6 py-4 rounded-lg text-center shadow-lg">
                  <p className="font-bold">Alcalde</p>
                  <p className="text-sm">{organizationStructure.alcalde.name}</p>
                </div>
              </div>

              {/* First Level */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {organizationStructure.departments.slice(0, 4).map((dept, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-blue-100 text-gray-900 px-3 py-3 rounded-lg shadow">
                      <p className="text-xs font-bold mb-1">{dept.name}</p>
                      <p className="text-xs text-gray-600">{dept.head.split(" ")[0]} {dept.head.split(" ")[1]}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Level */}
              <div className="grid grid-cols-4 gap-4">
                {organizationStructure.departments.slice(4, 8).map((dept, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-blue-100 text-gray-900 px-3 py-3 rounded-lg shadow">
                      <p className="text-xs font-bold mb-1">{dept.name}</p>
                      <p className="text-xs text-gray-600">{dept.head.split(" ")[0]} {dept.head.split(" ")[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                // Mock download
                alert("Descargando organigrama en formato PDF...");
              }}
              className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar organigrama completo (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
