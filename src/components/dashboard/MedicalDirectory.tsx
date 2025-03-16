import { useState } from "react";
import { useDoctors } from "../../context/doctor-context";
import { User, Search, Stethoscope } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useTranslation } from "react-i18next";


const MedicalDirectory = () => {
  const { t } = useTranslation();
  const { doctors, loadingDoctors } = useDoctors();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");

  // 📌 Obtener especialidades únicas
  const specialties = ["all", ...new Set(doctors.map((doc) => doc.specialty))];

  // 📌 Filtrar doctores
  const filteredDoctors = doctors.filter(
    (doc) =>
      (filterSpecialty === "all" || doc.specialty === filterSpecialty) &&
      (searchQuery === "" || doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-6 py-12 space-y-8">
      {/* 📌 Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <Stethoscope size={30} className="text-blue-600" />
          {t("medicalDirectoryTitle")}
        </h2>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="flex gap-4">
        {/* Input de búsqueda con icono */}
        <div className="relative w-1/3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder={t("searchDoctor")}
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
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty === "all" ? "Todas las especialidades" : specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 📂 Lista de Médicos */}
      <div className="bg-white p-6 shadow-lg rounded-xl">
        {loadingDoctors ? (
          <p className="text-gray-500 text-center">Cargando doctores...</p>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="p-5 border-l-4 border-blue-500 bg-gray-50 rounded-lg flex items-center gap-4 shadow-md"
              >
                <User size={40} className="text-gray-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                  <p className="text-gray-600">🩺 {t("specialty")}: {doctor.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No se encontraron médicos</p>
        )}
      </div>
    </div>
  );
};

export default MedicalDirectory;