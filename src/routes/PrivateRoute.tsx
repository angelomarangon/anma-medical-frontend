import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import Loading from "../components/Loading";

const PrivateRoute = () => {
    const { user, token } = useAuth();

    if (!token) return <Navigate to="/login" replace />;
    if (!user) return <Loading />;
    if (user.role !== "user") return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default PrivateRoute;
