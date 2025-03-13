import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./auth-context";

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    role: string;
    availableDays: string[]; // 🔹 Días de trabajo del doctor (ej: ["monday", "wednesday"])
    availableHours: {
        [key: string]: { start: string; end: string }[]; // 🔹 Horarios por día de la semana
    };
}

interface DoctorContextProps {
    doctor: Doctor | null;
    doctors: Doctor[];
    getDoctor: (id: string) => Promise<void>;
    getAllDoctors: () => Promise<void>;
    loadingDoctor: boolean;
    loadingDoctors: boolean;
    error: string | null;
}

const DoctorContext = createContext<DoctorContextProps | undefined>(undefined);

export const DoctorProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuth();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loadingDoctor, setLoadingDoctor] = useState<boolean>(false);
    const [loadingDoctors, setLoadingDoctors] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Obtener un doctor por ID
    const getDoctor = async (id: string) => {
        if (!token) {
            setError("No tienes permisos para ver esta información.");
            return;
        }

        try {
            setLoadingDoctor(true);
            const res = await axios.get(`https://anma-medical-backend.onrender.com/api/doctor/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoctor(res.data);
            setError(null);
        } catch (err) {
            setError("Error al obtener el doctor");
            console.error("Error al obtener el doctor:", err);
            setDoctor(null);
        } finally {
            setLoadingDoctor(false);
        }
    };

    // ✅ Obtener todos los doctores
    const getAllDoctors = async () => {
        if (!token) {
            setError("No tienes permisos para ver esta información.");
            return;
        }

        try {
            setLoadingDoctors(true);
            const res = await axios.get("https://anma-medical-backend.onrender.com/api/doctor", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Asegurar que `res.data` es un array antes de asignarlo
            if (Array.isArray(res.data)) {
                setDoctors(res.data);
            } else {
                setDoctors(res.data.doctors || []);
            }

            setError(null);
        } catch (err) {
            setError("Error al obtener doctores");
            console.error("Error al obtener doctores:", err);
            setDoctors([]);
        } finally {
            setLoadingDoctors(false);
        }
    };

    // ✅ Si el usuario es un doctor, obtener su información automáticamente
    useEffect(() => {
        if (user?.role === "doctor" && user?.id) {
            getDoctor(user.id);
        }
    }, [user]);

    // ✅ Obtener la lista de doctores automáticamente al iniciar
    useEffect(() => {
        getAllDoctors();
    }, [token]);

    return (
        <DoctorContext.Provider value={{ doctor, doctors, getDoctor, getAllDoctors, loadingDoctor, loadingDoctors, error }}>
            {children}
        </DoctorContext.Provider>
    );
};

export const useDoctors = () => {
    const context = useContext(DoctorContext);
    if (!context) throw new Error("useDoctors debe usarse dentro de un DoctorProvider");
    return context;
};
