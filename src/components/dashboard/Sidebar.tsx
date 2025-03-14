import { useState, Fragment } from "react";
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
  Language as LanguageIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const menuItems = [
    { name: t("home"), path: "/dashboard", icon: <HomeIcon /> },
    { name: t("myAppointments"), path: "/dashboard/appointments", icon: <CalendarIcon /> },
    { name: t("myProfile"), path: "/dashboard/profile", icon: <UserIcon /> },
    { name: t("history"), path: "/dashboard/history", icon: <HistoryIcon /> },
    { name: t("medicalDocuments"), path: "/dashboard/documents", icon: <DocumentsIcon /> },
    { name: t("medicalServices"), path: "/dashboard/services", icon: <ServicesIcon /> },
    { name: t("medicalDirectory"), path: "/dashboard/medical-directory", icon: <DirectoryIcon /> },
    { name: t("healthReport"), path: "/dashboard/report", icon: <ReportIcon /> },
  ];

  // 📌 Idiomas con emojis
  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
  ];

  return (
    <aside
      className={`h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col transition-all duration-300 shadow-lg z-50 ${expanded ? "w-60" : "w-20"
        }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* LOGO */}
      <div className="flex items-center justify-center h-16 w-full border-b border-gray-700">
        <h1 className={`text-xl font-bold transition-opacity duration-300 ${expanded ? "opacity-100" : "opacity-0"}`}>
          ANMA Medical
        </h1>
      </div>

      {/* MENÚ */}
      <nav className="flex flex-col w-full mt-6 ml-3 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/dashboard");

          return (
            <Link
              key={item.name}
              to={item.path}
              aria-label={item.name}
              className={`flex items-center w-full px-4 py-3 transition-all duration-200 rounded-md ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
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

      {/* SELECTOR DE IDIOMA EN LA PARTE INFERIOR */}
      <div className="mt-auto px-4 py-4 flex flex-col">
        <Menu as="div" className="relative inline-block w-full">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition text-sm w-full justify-start">
            <LanguageIcon className="w-5 h-5 -ml-1" />
            {expanded && (
              <span className="font-medium w-full -ml-4">
                {languages.find((l) => l.code === i18n.language)?.flag}{" "}
                {languages.find((l) => l.code === i18n.language)?.name}
              </span>
            )}
          </Menu.Button>

          {/* MENÚ DESPLEGABLE CENTRADO */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-1/2 -translate-x-1/2 bottom-14 w-40 bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {languages.map((lang) => (
                <Menu.Item key={lang.code}>
                  {({ active }) => (
                    <button
                      onClick={() => changeLanguage(lang.code)}
                      className={`${active ? "bg-gray-100" : ""
                        } flex items-center gap-2 w-full px-4 py-2 text-gray-700 rounded-md`}
                    >
                      <span className="text-lg">{lang.flag}</span> {lang.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;
