import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
  History as HistoryIcon,
  Description as DocumentsIcon,
  MedicalServices as ServicesIcon,
  LocalHospital as DirectoryIcon,
  Assessment as ReportIcon,
} from "@mui/icons-material";

const menuItems = [
  { name: "Inicio", path: "/dashboard", icon: <HomeIcon /> },
  { name: "Mis Turnos", path: "/dashboard/appointments", icon: <CalendarIcon /> },
  { name: "Mi Perfil", path: "/dashboard/profile", icon: <UserIcon /> },
  { name: "Historial", path: "/dashboard/history", icon: <HistoryIcon /> },
  { name: "Documentos Médicos", path: "/dashboard/documents", icon: <DocumentsIcon /> },
  { name: "Servicios Médicos", path: "/dashboard/services", icon: <ServicesIcon /> },
  { name: "Directorio Médico", path: "/dashboard/medical-directory", icon: <DirectoryIcon /> },
  { name: "Reporte de Salud", path: "/dashboard/report", icon: <ReportIcon /> },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col transition-all duration-300 shadow-lg z-50 ${
        expanded ? "w-60" : "w-20"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 w-full border-b border-gray-700">
        <h1 className={`text-xl font-bold transition-opacity duration-300 ${expanded ? "opacity-100" : "opacity-0"}`}>
          ANMA Medical
        </h1>
      </div>

      {/* Menú */}
      <nav className="flex flex-col w-full mt-6 ml-4 space-y-1">
        {menuItems.map((item) => {
          // 🔥 CORRECCIÓN: Verificamos si la ruta es EXACTAMENTE la del item o si es una subruta
          const isActive =
            location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/dashboard");

          return (
            <Link
              key={item.name}
              to={item.path}
              aria-label={item.name} // Mejora accesibilidad
              className={`flex items-center w-full px-4 py-3 transition-all duration-200 rounded-md ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <span className="w-10 h-10 flex items-center justify-center">{item.icon}</span>
              <span className={`ml-4 text-sm transition-opacity duration-300 ${expanded ? "opacity-100" : "opacity-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
