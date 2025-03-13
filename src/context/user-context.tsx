import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./auth-context";
import Loading from "../components/Loading";

const API_URL = "https://anma-medical-backend.onrender.com/api/user";

interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "doctor" | "receptionist";
    identityNumber?: string;
    socialSecurity?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    gender?: string;
    birthDate?: string | null;
    bloodType?: string;
}

interface UserContextProps {
    user: User | null;
    getUser: () => Promise<void>;
    updateUser: (data: Partial<Omit<User, "id" | "role">>) => Promise<boolean>;
    deleteUser: () => Promise<boolean>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user: authUser, logout } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser?.id) {
            getUser();
        } else {
            setLoading(false);
        }
    }, [authUser]);

    const getUser = async () => {
        if (!authUser?.id) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/${authUser.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
        } catch (error) {
            console.error("❌ Error obteniendo usuario:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (data: Partial<Omit<User, "id" | "role">>): Promise<boolean> => {
        if (!authUser?.id) return false;

        try {
            // 🔹 Depuramos los datos antes de enviarlos
            const cleanedData: Partial<Omit<User, "id" | "role">> = Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== undefined)
            );

            const res = await axios.put(`${API_URL}/${authUser.id}`, cleanedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status !== 200) {
                console.error("❌ Error en la actualización: ", res.data);
                return false;
            }

            // 🔹 Aseguramos que `setUser` solo se ejecute si `prevUser` no es null
            setUser((prevUser) => (prevUser ? { ...prevUser, ...cleanedData } : prevUser));

            console.log("✅ Usuario actualizado correctamente");
            return true;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("❌ Error actualizando usuario:", error.response?.data || error.message);
            } else {
                console.error("❌ Error desconocido:", error);
            }
            return false;
        }
    };

    const deleteUser = async (): Promise<boolean> => {
        if (!authUser?.id) return false;

        try {
            await axios.delete(`${API_URL}/${authUser.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("✅ Usuario eliminado correctamente");
            logout(); // Cierra sesión tras eliminar usuario
            return true;
        } catch (error) {
            console.error("❌ Error eliminando usuario:", error);
            return false;
        }
    };

    if (loading) return <Loading />;

    return (
        <UserContext.Provider value={{ user, getUser, updateUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser debe ser usado dentro de un UserProvider");
    return context;
};
