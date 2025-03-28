import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // Importamos el icono de check
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";

const RegisterSuccess = () => {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
            <div className="bg-white py-16 px-12 rounded-lg shadow-lg w-full max-w-lg text-center">
                {/* Icono de éxito */}
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-100">
                        <CheckCircle size={60} className="text-green-600" />
                    </div>
                </div>

                {/* Título con más separación */}
                <h2 className="text-4xl font-bold text-green-600">{t("registrationSuccess")}</h2>

                {/* Mensaje más espacioso y con mejor formato */}
                <p className="text-gray-600 mt-6 text-lg leading-relaxed px-4">
                    {t("registrationMessage")}
                    <br />
                    {t("loginNow")}
                </p>

                {/* Botón con más separación del texto */}
                <Link to="/login">
                    <Button className="mt-8 w-full bg-blue-500 text-white hover:bg-blue-700 py-3 text-lg">
                        {t("login")}
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default RegisterSuccess;