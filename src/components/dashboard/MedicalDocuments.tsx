import { useState, useEffect } from "react";
import { File, Upload, Trash2, Download, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useTranslation } from "react-i18next";

interface Document {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
}

const MedicalDocuments = () => {
  const { t, i18n } = useTranslation();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Actualizar documentos cuando cambie el idioma
  useEffect(() => {
    setDocuments([
      { id: "1", name: t("bloodTest"), type: t("laboratory"), fileUrl: "/docs/analisis_sangre.pdf" },
      { id: "2", name: t("cardiologyReport"), type: t("specialty"), fileUrl: "/docs/informe_cardiologico.pdf" },
    ]);
  }, [i18n.language]); // Se ejecuta cada vez que cambia el idioma

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        type: t("other"),
        fileUrl: URL.createObjectURL(file),
      };
      setDocuments((prev) => [...prev, newDoc]);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const filteredDocs = documents.filter(
    (doc) =>
      (filterType === "all" || doc.type === filterType) &&
      (searchQuery === "" || doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-6 py-12 space-y-8">
      {/* Título */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <File size={30} className="text-blue-600" />
          {t("medicalDocumentsTitle")}
        </h2>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download size={18} /> {t("downloadAll")}
        </Button>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="flex gap-4">
        <Input
          placeholder={t("searchDocument")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3"
        />
        <Select onValueChange={setFilterType}>
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder={t("filterByType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="Laboratorio">{t("laboratory")}</SelectItem>
            <SelectItem value="Especialidad">{t("specialty")}</SelectItem>
            <SelectItem value="Otro">{t("other")}</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer">
          <Upload size={18} />
          {t("uploadFile")}
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white p-6 shadow-lg rounded-xl">
        {filteredDocs.length > 0 ? (
          <div className="space-y-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 border-l-4 border-blue-500 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                  <p className="text-gray-600">📁 {t("type")}: {doc.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedFile(doc.fileUrl)}>
                  {t("view")}
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(doc.id)}>
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">{t("noMedicalDocuments")}</p>
        )}
      </div>

      {/* Modal de Vista Previa */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t("documentPreview")}</h3>
              <button onClick={() => setSelectedFile(null)}>
                <X size={20} className="text-gray-600 hover:text-gray-800 transition" />
              </button>
            </div>
            <iframe src={selectedFile} className="w-full h-80 border rounded-md mt-4" />
            <div className="flex justify-end mt-4">
              <Button onClick={() => setSelectedFile(null)} variant="secondary">
                {t("close")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalDocuments;
