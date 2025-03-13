import { useState } from "react";
import { BarChart, Download, Search, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 📌 Tipo de datos para los reportes médicos
interface MedicalReport {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
}

const MedicalReports = () => {
  // 📍 Lista de reportes médicos
  const [reports] = useState<MedicalReport[]>([
    { id: "1", title: "Informe de Laboratorio", date: "2024-03-01", type: "Laboratorio", description: "Resultados del análisis de sangre." },
    { id: "2", title: "Evaluación Cardiológica", date: "2024-02-20", type: "Especialidad", description: "Examen del sistema cardiovascular." },
    { id: "3", title: "Consulta General", date: "2024-02-10", type: "Consulta", description: "Informe de consulta médica general." }
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  // 📌 Filtrar reportes médicos
  const filteredReports = reports.filter(
    (report) =>
      (filterType === "all" || report.type === filterType) &&
      (searchQuery === "" || report.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 📥 Exportar reportes a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reportes Médicos", 14, 16);
  
    // 📝 Agregar tabla con datos
    autoTable(doc, {
      startY: 22,
      head: [["Título", "Fecha", "Tipo", "Descripción"]],
      body: filteredReports.map((r) => [r.title, r.date, r.type, r.description]),
    });
  
    doc.save("reportes_medicos.pdf");
  };

  return (
    <div className="px-6 py-12 space-y-8">
      {/* 📌 Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <BarChart size={30} className="text-blue-600" />
          Reportes Médicos
        </h2>
        <Button variant="secondary" className="flex items-center gap-2" onClick={exportToPDF}>
          <Download size={18} /> Descargar Reportes
        </Button>
      </div>

      {/* 🔎 Búsqueda y Filtros */}
      <div className="flex gap-4">
        <div className="relative w-1/3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar reporte..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select onValueChange={setFilterType}>
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="Laboratorio">Laboratorio</SelectItem>
            <SelectItem value="Especialidad">Especialidad</SelectItem>
            <SelectItem value="Consulta">Consulta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📂 Lista de Reportes */}
      <div className="bg-white p-6 shadow-lg rounded-xl">
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-5 border-l-4 border-blue-500 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                  <p className="text-gray-600">📅 {new Date(report.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">📁 {report.type}</p>
                  <p className="text-gray-500 text-sm">{report.description}</p>
                </div>
                <Button variant="outline">
                  <FileText size={18} /> Ver Reporte
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No hay reportes médicos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default MedicalReports;