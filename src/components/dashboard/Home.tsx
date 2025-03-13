import CalendarComponent from "./Calendar";
import { useAppointments } from "../../context/appointment-context";
import { CalendarCheck, ClipboardList } from "lucide-react"; // Íconos

const Home = () => {
    const { appointments } = useAppointments();

    return (
        <div className="px-6 py-12 space-y-12">
            {/* 🏷️ Título principal con icono */}
            <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800 mb-8">
                <CalendarCheck size={30} className="text-blue-600" />
                Vista General de Turnos
            </h2>

            {/* 📅 Sección de Calendario */}
            <div className="bg-white p-6 shadow-lg rounded-xl">
                <CalendarComponent/>
            </div>

            {/* 📌 Sección de Próximas Citas */}
            <div className="bg-white p-6 shadow-lg rounded-xl">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                    <ClipboardList size={24} className="text-green-600" />
                    Próximas Citas
                </h3>

                {/* 📄 Lista de citas */}
                <ul className="mt-4 space-y-4">
                    {appointments && appointments.length > 0 ? (
                        appointments.slice(0, 3).map((app) => (
                            <li
                                key={app.id}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 
                                transition-all duration-300 hover:shadow-md"
                                style={{
                                    borderLeftColor:
                                        app.status === "scheduled"
                                            ? "#2563eb" // Azul para programadas
                                            : app.status === "completed"
                                                ? "#22c55e" // Verde para completadas
                                                : "#ef4444", // Rojo para canceladas
                                }}
                            >
                                <div>
                                    <strong className="block text-lg text-gray-900">
                                        {app.doctor?.gender === "Femenino" ? "Dra." : "Dr."} {app.doctor.name} ({app.doctor.specialty})
                                    </strong>
                                    <p className="text-gray-600 text-sm">
                                        📅 {new Date(app.date).toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        ⏰ {app.time}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm font-semibold text-white rounded-md ${app.status === "scheduled"
                                            ? "bg-blue-500"
                                            : app.status === "completed"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                >
                                    {app.status === "scheduled"
                                        ? "Programada"
                                        : app.status === "completed"
                                            ? "Completada"
                                            : "Cancelada"}
                                </span>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay citas próximas.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;
