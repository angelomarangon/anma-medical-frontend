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

const SidebarMobile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla el estado del sidebar móvil
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

    const languages = [
        { code: "es", name: "Español", flag: "🇪🇸" },
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "it", name: "Italiano", flag: "🇮🇹" },
    ];

    return (
        <div className="asideMobile">
            {/* Botón de hamburguesa flotante */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-16 left-2 z-60 bg-black opacity-40 pt-0.5 p-2 rounded-xl md:hidden"  // Ajuste de posición
            >
                <span className="text-white text-xl">☰</span>
            </button>

            {/* Sidebar en móvil */}
            <aside
                className={`h-screen bg-gray-900 text-white fixed -mt-3 top-0 left-0 flex flex-col transition-all duration-300 shadow-lg z-50 ${isSidebarOpen ? "w-60" : "w-0"
                    }`}
                style={{ top: "64px" }} // Asegura que esté debajo del navbar
            >
                {/* MENÚ */}
                <div className="flex flex-col gap-20">
                <nav className="flex flex-col w-full mt-12 -ml-2 space-y-3">
                    {menuItems.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            (location.pathname.startsWith(item.path) && item.path !== "/dashboard");

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                aria-label={item.name}
                                className={`link flex items-center w-full py-1 transition-all duration-200 rounded-md ${isActive ? `bg-blue-600 text-white ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}` : 'hover:bg-gray-700'}`}
                            >
                                <span className={`w-10 h-10 flex -mr-2 items-center justify-center ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.icon}</span>
                                <span className={`ml-2 text-sm ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Selector de idioma en la parte inferior */}
                <div className=" px-4 py-4 flex flex-col">
                    <Menu as="div" className="relative inline-block w-full">
                        <Menu.Button className={`flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition text-sm w-full justify-start ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                            <LanguageIcon className={`w-5 h-5 -ml-1 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
                            {isSidebarOpen && (
                                <span className="font-medium w-full -ml-4">
                                    {languages.find((l) => l.code === i18n.language)?.flag}{" "}
                                    {languages.find((l) => l.code === i18n.language)?.name}
                                </span>
                            )}
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
                            <Menu.Items className="absolute left-1/2 -translate-x-1/2 bottom-14 w-40 bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {languages.map((lang) => (
                                    <Menu.Item key={lang.code}>
                                        {({ active }) => (
                                            <button
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`${active ? "bg-gray-100" : ""} flex items-center gap-2 w-full px-4 py-2 text-gray-700 rounded-md`}
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
                </div>
            </aside>
        </div>
    );
};

export default SidebarMobile;
