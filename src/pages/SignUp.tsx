import { useState } from "react";
// import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/auth-context";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("❌ Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        const success = await register(formData.name, formData.email, formData.password);
        setLoading(false);

        if (success) {
            navigate("/register-success"); // ✅ Redirige automáticamente
        } else {
            setError("❌ Error al registrar usuario. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600">Registro</h2>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nombre Completo"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Correo Electrónico"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirmar Contraseña"
                        className="w-full p-2 border rounded"
                        required
                    />

                    <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-700" disabled={loading}>
                        {loading ? "Registrando..." : "Registrarse"}
                    </Button>
                </form>

                {/* ✅ Enlace a Iniciar Sesión */}
                <p className="text-sm text-center mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;