import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import { useAuth } from "../context/auth-context";
import Loading from "../components/Loading";
import SidebarMobile from "../components/dashboard/SidebarMobile";

const Dashboard = () => {
    const { user, token } = useAuth();

    if (!token) return <Navigate to="/login" replace />;
    if (!user) return <Loading />;
    if (user.role !== "user") return <Navigate to="/login" replace />;

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar fijo */}
            <Sidebar />
            <SidebarMobile />
            
            {/* Contenedor Principal */}
            <div className="flex-1 flex flex-col">
                {/* Navbar en la parte superior */}
                <Navbar />

                {/* Contenido dinámico con margen y padding */}
                <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
                    <Outlet /> {/* Renderiza la página actual */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
