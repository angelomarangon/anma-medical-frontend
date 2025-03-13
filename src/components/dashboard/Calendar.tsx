import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import axios from "axios";
import { useAuth } from "../../context/auth-context";
import { useAppointments } from "../../context/appointment-context";
import { EventContentArg } from "@fullcalendar/core";
import Tooltip from "@mui/material/Tooltip";
import { CalendarDays, Stethoscope, HeartPulse, Clock } from "lucide-react"; // 🔹 Iconos profesionales

interface Doctor {
  name: string;
  specialty: string;
  gender: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  doctor: Doctor;
}

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const { user, token } = useAuth();
  const { appointments: updatedAppointments } = useAppointments();

  // ✅ Obtener citas del usuario desde el backend
  const fetchUserAppointments = useCallback(async () => {
    if (!user || !token) return;

    try {
      const res = await axios.get(
        `https://anma-medical-backend.onrender.com/api/appointment/user/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mappedAppointments = res.data.map((app: Appointment) => {
        const formattedDate = new Date(app.date).toISOString().split("T")[0];
        const [startTime, endTime] = app.time.split(" - ");

        return {
          id: app.id,
          title: `${app.doctor.gender === "Femenino" ? "Dra." : "Dr."} ${
            app.doctor.name
          }`,
          start: `${formattedDate}T${startTime}`,
          end: `${formattedDate}T${endTime}`,
          extendedProps: {
            status: app.status,
            specialty: app.doctor.specialty,
            time: app.time,
          },
        };
      });

      setEvents(mappedAppointments);
    } catch (err) {
      console.error("Error al obtener citas:", err);
    }
  }, [user, token]);

  useEffect(() => {
    fetchUserAppointments();
  }, [fetchUserAppointments, updatedAppointments.length]);

  // ✅ Estilos condicionales para eventos según estado
  const eventClassNames = (arg: EventContentArg) => {
    return arg.event.extendedProps.status === "scheduled"
      ? "scheduled-event"
      : "cancelled-event";
  };

  // ✅ Mejor visualización de eventos con Tooltip
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <Tooltip
        title={
          <div className="p-2 text-xs space-y-1">
            <p className="flex items-center gap-1">
              <Stethoscope size={14} className="text-blue-300" />
              <span className="font-semibold">{eventInfo.event.title}</span>
            </p>
            <p className="flex items-center gap-1">
              <HeartPulse size={14} className="text-red-300" />
              <span>{eventInfo.event.extendedProps.specialty}</span>
            </p>
            <p className="flex items-center gap-1">
              <Clock size={14} className="text-gray-200" />
              <span>{eventInfo.event.extendedProps.time}</span>
            </p>
            <p className="flex justify-center">
              <span
                className={`px-2 py-1 rounded-md text-white text-xs ${
                  eventInfo.event.extendedProps.status === "scheduled"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              >
                {eventInfo.event.extendedProps.status === "scheduled"
                  ? "Programada"
                  : "Cancelada"}
              </span>
            </p>
          </div>
        }
        arrow
      >
        <div className="p-1 text-xs rounded-md shadow-sm flex flex-col cursor-pointer bg-opacity-80 text-center">
          <span className="block font-semibold text-blue-800">
            {eventInfo.event.title}
          </span>
          <span className="text-gray-700 text-[11px]">
            {eventInfo.event.extendedProps.specialty}
          </span>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-md">
      {/* ✅ Título con icono profesional y tipografía mejorada */}
      <h2 className="text-3xl font-semibold mb-6 flex items-center justify-center text-gray-800 font-poppins">
        <CalendarDays size={28} className="text-blue-600 mr-2" />
        Calendario de Turnos
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        events={events}
        eventClassNames={eventClassNames}
        eventContent={renderEventContent}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        buttonText={{
          today: "Hoy",
          month: "Mes",
        }}
        height="auto"
      />

      {/* ✅ Leyenda de colores */}
      <div className="mt-6 w-full flex justify-center gap-6 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-300 rounded-sm"></span>
          Cita Programada
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-300 rounded-sm"></span>
          Cita Cancelada
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
