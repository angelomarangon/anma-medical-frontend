import { useState } from "react";
import { LogOut, PlusCircle, HeartPulse } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import BookingModal from "../dashboard/BookingModal";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "../../styles/responsive.css"; // Importamos los estilos responsive

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-primary text-white px-6 py-3 flex justify-between items-center shadow-md fixed w-full top-0 left-0 z-50">
      {/* LOGOTIPO */}
      <div className="logo-container flex items-center gap-2">
        <HeartPulse size={32} className="text-blue-400" />
        <span className="text-xl font-semibold tracking-wide font-poppins">
          ANMA MEDICAL
        </span>
      </div>

      {/* DERECHA - ACCIONES */}
      <div className="actions flex gap-4 items-center">
        {user && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm opacity-80 hidden md:inline-block"
          >
            {t("welcome")}, <strong>{user.name}</strong>
          </motion.span>
        )}

        {BookingModal! && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="reserve-btn flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            aria-label="Reservar Turno"
          >
            {/* Icono solo visible en desktop */}
            <span className="hidden md:inline-block">
              <PlusCircle size={18} />
            </span>
            {t("bookAppointment")}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
          aria-label="Cerrar Sesión"
        >
          <LogOut size={20} />
          <span>{t("logout")}</span>
        </motion.button>
      </div>

      {/* MODAL */}
      {isModalOpen && BookingModal && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBookingSuccess={() => setIsModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
