import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Building2, Upload, CheckCircle, XCircle, LogOut, FileText } from "lucide-react";

type UploadHistory = {
  id: number;
  date: string;
  category: string;
  status: "success" | "error";
  fileName: string;
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("remuneraciones");
  const [selectedMonth, setSelectedMonth] = useState("Marzo");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([
    {
      id: 1,
      date: "05/04/2026 10:30",
      category: "Remuneraciones",
      status: "success",
      fileName: "remuneraciones-marzo-2026.csv",
    },
    {
      id: 2,
      date: "03/04/2026 15:45",
      category: "Transferencias",
      status: "success",
      fileName: "transferencias-marzo-2026.csv",
    },
    {
      id: 3,
      date: "01/04/2026 09:15",
      category: "Presupuesto",
      status: "success",
      fileName: "presupuesto-marzo-2026.csv",
    },
  ]);

  const categories = [
    "Remuneraciones",
    "Ejecución Presupuestaria",
    "Transferencias de Fondos",
    "Contrataciones y Compras",
    "Subsidios y Beneficios",
  ];

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith(".csv")) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setShowSuccess(false);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowSuccess(true);
          
          // Add to history
          const newUpload: UploadHistory = {
            id: uploadHistory.length + 1,
            date: new Date().toLocaleString("es-CL"),
            category: selectedCategory,
            status: "success",
            fileName: selectedFile.name,
          };
          setUploadHistory([newUpload, ...uploadHistory]);
          
          // Reset form
          setTimeout(() => {
            setSelectedFile(null);
            setShowSuccess(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }, 3000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#1e40af]" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Panel de Administrador</h1>
                <p className="text-sm text-gray-600">Bienvenido, Administrador Municipal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Cargar Archivo de Datos
              </h2>

              {/* Category and Period Selection */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase().replace(/ /g, "-")}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mes
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {["2026", "2025", "2024"].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">
                  Arrastra y suelta tu archivo CSV aquí
                </p>
                <p className="text-sm text-gray-500 mb-4">o haz clic para seleccionar</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-900">{selectedFile.name}</span>
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Procesando archivo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success Message */}
              {showSuccess && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">
                    ¡Archivo cargado exitosamente! Los datos están ahora disponibles en el portal.
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`w-full mt-6 py-3 rounded-md font-medium transition-colors ${
                  selectedFile && !isUploading
                    ? "bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isUploading ? "Procesando..." : "Cargar Archivo"}
              </button>
            </div>
          </div>

          {/* Upload History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Historial de Cargas
              </h2>

              <div className="space-y-3">
                {uploadHistory.map((upload) => (
                  <div
                    key={upload.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{upload.category}</p>
                        <p className="text-xs text-gray-500">{upload.date}</p>
                      </div>
                      {upload.status === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{upload.fileName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
