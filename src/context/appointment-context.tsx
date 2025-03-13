import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./auth-context";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  doctor: { name: string; specialty: string; gender: string;};
}

interface AppointmentContextProps {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => void;
  createAppointment: (doctorId: string, date: string, time: string) => Promise<boolean>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  deleteAppointment: (appointmentId: string) => Promise<boolean>;
}

const AppointmentContext = createContext<AppointmentContextProps | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 1. Función para obtener las citas del usuario
  const fetchAppointments = useCallback(async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `https://anma-medical-backend.onrender.com/api/appointment/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments(res.data);
      setError(null);
    } catch (err) {
      console.error("❌ Error al obtener citas:", err);
      setError("Error al obtener citas.");
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // 🔹 2. Función para crear una nueva cita médica
  const createAppointment = useCallback(
    async (doctorId: string, date: string, time: string): Promise<boolean> => {
      if (!token || !user) return false;

      try {
        // 🔍 1️⃣ Verificar si el horario ya está ocupado
        const res = await axios.get(
          `https://anma-medical-backend.onrender.com/api/appointment/doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const doctorAppointments = res.data;
        const isTimeTaken = doctorAppointments.some(
          (appointment: { date: string; time: string }) =>
            appointment.date === date && appointment.time === time
        );

        if (isTimeTaken) {
          console.warn("❌ El horario ya está ocupado.");
          return false;
        }

        // ✅ 2️⃣ Si el horario está libre, proceder con la reserva
        const createRes = await axios.post(
          "https://anma-medical-backend.onrender.com/api/appointment/",
          {
            userId: user.id,
            doctorId,
            date,
            time,
            status: "scheduled",
            paymentStatus: "pending",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Cita creada con éxito:", createRes.data);

        // 🔄 Actualizar lista de citas
        fetchAppointments();
        return true;
      } catch (err) {
        console.error("❌ Error al crear la cita:", err);
        return false;
      }
    },
    [fetchAppointments, token, user]
  );


  // 🔹 3. Función para cancelar una cita
  const cancelAppointment = useCallback(async (appointmentId: string): Promise<boolean> => {
    if (!token || !user) return false;

    try {
      await axios.put(
        `https://anma-medical-backend.onrender.com/api/appointment/${appointmentId}/cancel`,
        { requesterId: user.id, requesterRole: user.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔄 Actualiza el estado local sin hacer otra petición al backend
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "cancelled" } : app
        )
      );

      console.log("🚫 Cita cancelada con éxito.");
      return true;
    } catch (err) {
      console.error("❌ Error al cancelar la cita:", err);
      return false;
    }
  }, [token, user]);

  // 🔹 4. Función para eliminar una cita
  const deleteAppointment = useCallback(async (appointmentId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      await axios.delete(`https://anma-medical-backend.onrender.com/api/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔄 Actualizar la lista de citas en el frontend tras la eliminación
      setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));

      console.log("🗑️ Cita eliminada con éxito.");
      return true;
    } catch (err) {
      console.error("❌ Error al eliminar la cita:", err);
      return false;
    }
  }, [token]);

  // 🔹 5. useEffect para actualizar citas en tiempo real cada 10s
  useEffect(() => {
    fetchAppointments(); // Llamada inicial
  }, [fetchAppointments]);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        fetchAppointments,
        createAppointment,
        cancelAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error("useAppointments debe usarse dentro de un AppointmentProvider");
  return context;
};
