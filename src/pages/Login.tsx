import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await login(email, password);
        if (success) {
            navigate("/dashboard");
        } else {
            setError("Correo o contraseña incorrectos");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        className="w-full p-2 border rounded"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full p-2 border rounded"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    {/* ✅ Enlace para recuperar contraseña */}
                    <div className="text-right">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                        Iniciar sesión
                    </button>
                </form>

                {/* ✅ Enlace para registrarse */}
                <p className="text-sm text-center mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;