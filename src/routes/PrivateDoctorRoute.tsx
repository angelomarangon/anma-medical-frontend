import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const PrivateDoctorRoute = () => {
  const { user } = useAuth();

  // Verifica si el usuario es doctor
  if (!user || user.role !== "doctor") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateDoctorRoute;