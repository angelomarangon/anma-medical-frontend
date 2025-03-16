import { useState, Fragment } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";

const SignUp = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    // 📌 Lista de idiomas con banderas
    const languages = [
        { code: "es", flag: "🇪🇸" },
        { code: "en", flag: "🇺🇸" },
        { code: "it", flag: "🇮🇹" },
    ];

    // 📌 Cambio de idioma
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // ✅ Se limpia el error al escribir
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Resetear errores antes de la validación
        setErrors({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

        let hasError = false;
        const newErrors = { ...errors };

        // Validaciones
        if (!formData.name) {
            newErrors.name = t("nameRequired");
            hasError = true;
        }
        if (!formData.email) {
            newErrors.email = t("emailRequired");
            hasError = true;
        }
        if (!formData.password) {
            newErrors.password = t("passwordRequired");
            hasError = true;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t("passwordMismatch");
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        const success = await register(formData.name, formData.email, formData.password);
        setLoading(false);

        if (success) {
            navigate("/register-success"); // ✅ Redirige automáticamente
        } else {
            setErrors({ ...errors, email: t("registrationError") }); // ❌ Error en el registro
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* 🔹 NAVBAR (Solo logo y selector de idioma) */}
            <nav className="bg-primary text-white px-6 py-3 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <HeartPulse size={32} className="text-blue-400" />
                    <span className="text-xl font-semibold tracking-wide font-poppins">
                        ANMA MEDICAL
                    </span>
                </div>

                {/* Selector de idioma ajustado a la derecha */}
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center justify-center px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition text-sm w-10 h-10">
                        <span className="text-lg">{languages.find((l) => l.code === i18n.language)?.flag}</span>
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-2 mt-2 w-12 bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col items-end pr-2">
                            {languages.map((lang, index) => (
                                <Menu.Item key={lang.code}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`${
                                                active ? "bg-gray-100" : ""
                                            } flex items-center justify-end w-full px-2 py-2 text-lg ${
                                                index === 0 ? "rounded-t-md" : index === languages.length - 1 ? "rounded-b-md" : ""
                                            }`}
                                        >
                                            {lang.flag}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </nav>

            {/* 🔹 SIGNUP FORM */}
            <div className="flex flex-1 items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold text-center text-blue-600">{t("register")}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {/* 🔹 Nombre */}
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t("fullName")}
                            className="w-full p-2 border rounded"
                            
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                        {/* 🔹 Correo Electrónico */}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("email")}
                            className="w-full p-2 border rounded"
                            
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                        {/* 🔹 Contraseña */}
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t("password")}
                            className="w-full p-2 border rounded"
                            
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                        {/* 🔹 Confirmar Contraseña */}
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={t("confirmPassword")}
                            className="w-full p-2 border rounded"
                            
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                        {/* 🔹 Botón de Registro */}
                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? t("registering") : t("register")}
                        </button>
                    </form>

                    {/* ✅ Enlace a Iniciar Sesión */}
                    <p className="text-sm text-center mt-4">
                        {t("haveAccount")}{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            {t("loginHere")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
