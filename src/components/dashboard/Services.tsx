import { useState } from "react";
import { BriefcaseMedical, Search, Info, CalendarCheck, FlaskConical } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useTranslation } from "react-i18next";

// Tipo de datos para los servicios médicos
interface MedicalService {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  description: string;
}

const Services = () => {
  const { t } = useTranslation();
  //  Lista de servicios médicos disponibles
  const [services] = useState<MedicalService[]>([
    // Servicios de consulta
    { id: "1", name: t("generalConsultation"), specialty: t("generalMedicine"), available: true, description: t("generalMedicalConsultation") },
    { id: "2", name: t("cardiology"), specialty: t("cardiology"), available: false, description: t("cardiovascularEvaluation") },
    { id: "3", name: t("dermatology"), specialty: t("dermatology"), available: true, description: t("dermatologyDiagnosis") },

    // Exámenes de Laboratorio
    { id: "4", name: t("completeBloodCount"), specialty: t("laboratory"), available: true, description: t("bloodAnalysis") },
    { id: "5", name: t("urineTest"), specialty: t("laboratory"), available: true, description: t("renalFunctionEvaluation") },
    { id: "6", name: t("glucoseTest"), specialty: t("laboratory"), available: false, description: t("glucoseMeasurement") },
    { id: "7", name: t("lipidProfile"), specialty: t("laboratory"), available: true, description: t("lipidProfileMeasurement") }
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);

  // Filtrar servicios médicos
  const filteredServices = services.filter(
    (service) =>
      (filterSpecialty === "all" || service.specialty === filterSpecialty) &&
      (searchQuery === "" || service.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-6 py-12 space-y-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <BriefcaseMedical size={30} className="text-blue-600" />
          {t("medicalServicesTitle")}
        </h2>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="flex gap-4">
        {/* Input de búsqueda con icono */}
        <div className="relative w-1/3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder={t("searchServiceOrExam")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select onValueChange={setFilterSpecialty}>
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder={t("filterBySpecialty")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allSpecialties")}</SelectItem>
            <SelectItem value="Medicina General">{t("generalMedicine")}</SelectItem>
            <SelectItem value="Cardiología">{t("cardiology")}</SelectItem>
            <SelectItem value="Dermatología">{t("dermatology")}</SelectItem>
            <SelectItem value="Laboratorio">{t("laboratory")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Servicios y Exámenes */}
      <div className="bg-white p-6 shadow-lg rounded-xl">
        {filteredServices.length > 0 ? (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`p-5 border-l-4 rounded-lg flex justify-between items-center ${
                  service.specialty === "Laboratorio" ? "border-green-500 bg-green-50" : "border-blue-500 bg-gray-50"
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {service.specialty === "Laboratorio" && <FlaskConical size={18} className="text-green-500" />}
                    {service.name}
                  </h3>
                  <p className="text-gray-600">🩺 {t("specialty")}: {service.specialty}</p>
                  <p className={`text-sm ${service.available ? "text-green-600" : "text-red-600"}`}>
                    {service.available ? t("available"): t("notAvailable")}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedService(service)}>
                  <Info size={18} /> {t("viewDetails")}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">{t("noMedicalServices")}</p>
        )}
      </div>

      {/* Modal de Detalles del Servicio o Examen */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{selectedService.name}</h3>
              <button onClick={() => setSelectedService(null)}>❌</button>
            </div>
            <p className="text-gray-600 mt-2">Especialidad: {selectedService.specialty}</p>
            <p className="text-gray-600 mt-2">{selectedService.description}</p>
            <p className={`text-sm mt-2 ${selectedService.available ? "text-green-600" : "text-red-600"}`}>
              {selectedService.available ? t("available") : t("notAvailable")}
            </p>
            <div className="flex justify-end mt-4">
              {selectedService.available && (
                <Button className="flex items-center gap-2">
                  <CalendarCheck size={18} /> {t("bookAppointment")}
                </Button>
              )}
              <Button variant="secondary" onClick={() => setSelectedService(null)}>{t("close")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;