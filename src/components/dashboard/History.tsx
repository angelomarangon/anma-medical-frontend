import { useState, useEffect } from "react";
import { useAppointments } from "../../context/appointment-context";
import { CalendarCheck, Download, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useTranslation } from "react-i18next";

// 📌 Definimos la interfaz para TypeScript
interface Appointment {
  id: string;
  date: string;
  status: string;
  doctor: { name: string; specialty: string };
  diagnosis?: string;
}

const History = () => {
  const { appointments, loading } = useAppointments();
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const { t } = useTranslation();

  useEffect(() => {
    const filtered = appointments.filter(
      (app: Appointment) =>
        app.status === "completed" &&
        (filterSpecialty === "all" || app.doctor.specialty === filterSpecialty) &&
        (searchQuery === "" || app.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, filterSpecialty]);

  return (
    <div className="px-6 py-12 space-y-8">
      {/* 🏷 Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <CalendarCheck size={30} className="text-blue-600" />
          {t("consultationHistory")}
        </h2>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download size={18} /> {t("consultationHistory")}
        </Button>
      </div>

      {/* 🔎 Filtros y Búsqueda */}
      <div className="flex gap-4">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            placeholder={t("searchByDoctors")}
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
            <SelectItem value="Cardiología">Cardiología</SelectItem>
            <SelectItem value="Dermatología">Dermatología</SelectItem>
            <SelectItem value="Pediatría">Pediatría</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 Lista de Consultas */}
      <div className="bg-white p-6 shadow-lg rounded-xl">
        {loading ? (
          <p className="text-gray-500 text-center">Cargando consultas...</p>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((app: Appointment) => (
              <div
                key={app.id}
                className="p-5 border-l-4 border-blue-500 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {app.doctor.name} ({app.doctor.specialty})
                  </h3>
                  <p className="text-gray-600">📅 {new Date(app.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">📋 {app.diagnosis || "Sin diagnóstico registrado"}</p>
                </div>
                <Button variant="outline">Ver Detalles</Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">{t("noCompletedConsultations")}</p>
        )}
      </div>
    </div>
  );
};

export default History;