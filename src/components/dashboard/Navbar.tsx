import { useState } from "react";
import { LogOut, PlusCircle, HeartPulse } from "lucide-react"; // ✅ Se usa un ícono médico profesional
import { useAuth } from "../../context/auth-context";
import BookingModal from "../dashboard/BookingModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center shadow-md fixed w-full top-0 left-0 z-50">
      {/* LOGOTIPO */}
      <div className="flex items-center gap-2 px-4">
        <HeartPulse size={30} className="text-blue-500" /> {/* Icono médico */}
        <span className="text-xl font-semibold tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
         ANMA MEDICAL
        </span>
      </div>

      {/* ACCIONES (Botón de reserva y logout) */}
      <div className="flex gap-4 pr-4 items-center">
        {user && (
          <span className="text-sm opacity-80 hidden md:inline-block mr-4">
            Bienvenido, <strong>{user.name}</strong>
          </span>
        )} 

        {BookingModal! && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            aria-label="Reservar Cita"
          >
            <PlusCircle size={20} />
            <span>Reservar Turno</span>
          </button>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
          aria-label="Cerrar Sesión"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
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
