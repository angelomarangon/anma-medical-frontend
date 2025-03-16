import { useState, useEffect } from "react";
import { BarChart, Download, Search, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslation } from "react-i18next";

// Tipo de datos para los reportes médicos
interface MedicalReport {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
}

const MedicalReports = () => {
  const { t, i18n } = useTranslation();

  // Lista de reportes médicos (dinámica)
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  // Actualizar lista de reportes cuando cambia el idioma
  useEffect(() => {
    setReports([
      { id: "1", title: t("labReport"), date: "2024-03-01", type: t("laboratory"), description: t("bloodTestResults") },
      { id: "2", title: t("cardiovascularEvaluation"), date: "2024-02-20", type: t("specialty"), description: t("cardiovascularExamination") },
      { id: "3", title: t("generalConsultation"), date: "2024-02-10", type: t("consultation"), description: t("generalMedicalReport") }
    ]);
  }, [i18n.language]); // 🔹 Se ejecuta cada vez que cambia el idioma

  // 📌 Filtrar reportes médicos
  const filteredReports = reports.filter(
    (report) =>
      (filterType === "all" || report.type === filterType) &&
      (searchQuery === "" || report.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Exportar reportes a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(t("healthReportTitle"), 14, 16); // 📝 Traducción del título

    // Agregar tabla con datos
    autoTable(doc, {
      startY: 22,
      head: [[t("title"), t("date"), t("type"), t("description")]], // 📝 Traducción de encabezados
      body: filteredReports.map((r) => [r.title, r.date, r.type, r.description]),
    });

    doc.save("reportes_medicos.pdf");
  };

  return (
    <div className="px-6 py-12 space-y-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <BarChart size={30} className="text-blue-600" />
          {t("healthReportTitle")}
        </h2>
        <Button variant="secondary" className="flex items-center gap-2" onClick={exportToPDF}>
          <Download size={18} /> {t("downloadReports")}
        </Button>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="flex gap-4">
        <div className="relative w-1/3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder={t("searchReport")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select onValueChange={setFilterType}>
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder={t("filterByType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            <SelectItem value={t("laboratory")}>{t("laboratory")}</SelectItem>
            <SelectItem value={t("specialty")}>{t("specialty")}</SelectItem>
            <SelectItem value={t("consultation")}>{t("consultation")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Reportes */}
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
                  <FileText size={18} /> {t("viewReport")}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">{t("noMedicalReportsAvailable")}</p>
        )}
      </div>
    </div>
  );
};

export default MedicalReports;
