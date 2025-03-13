import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";

const API_URL = "https://anma-medical-backend.onrender.com/api/auth";

interface User {
    id: string;
    role: "user" | "admin" | "doctor" | "receptionist";
    name: string;
}

interface AuthContextProps {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async (token: string) => {
        try {
            const res = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Guardamos en localStorage
        } catch (error) {
            console.error("❌ Error al obtener usuario actual:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && !user) {
            fetchCurrentUser(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/login`, { email, password });
            const newToken = res.data.token;
            localStorage.setItem("token", newToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setToken(newToken);
            setUser(res.data.user);
            console.log("✅ Sesión iniciada correctamente");
            return true;
        } catch (error) {
            console.error("❌ Error en login:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, role: string = "user"): Promise<boolean> => {
        try {
            setLoading(true);
            await axios.post(`${API_URL}/register`, { name, email, password, role });
            console.log("✅ Registro exitoso.");
            return true;
        } catch (error) {
            console.error("❌ Error en registro:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    if (loading) return <Loading />;

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
