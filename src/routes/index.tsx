import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../context/auth-context";
import { AppointmentProvider } from "../context/appointment-context";
import Dashboard from "../pages/DashboardPage";
import AppointmentsList from "../components/dashboard/AppointmentsList";
import Profile from "../components/dashboard/Profile";
import History from "../components/dashboard/History";
import MedicalDocuments from "../components/dashboard/MedicalDocuments";
import Services from "../components/dashboard/Services";
import HealthReport from "../components/dashboard/HealthReport";
import Home from "../components/dashboard/Home";
import MedicalDirectory from "../components/dashboard/MedicalDirectory";
import { UserProvider } from "../context/user-context";
import SignUp from "../pages/SignUp";
import RegisterSuccess from "../components/RegisterSuccess";
import { DoctorProvider } from "../context/doctor-context";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DoctorProvider>
          <UserProvider>
            <AppointmentProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/register-success" element={<RegisterSuccess />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<Home />} />
                    <Route path="appointments" element={<AppointmentsList />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="history" element={<History />} />
                    <Route path="documents" element={<MedicalDocuments />} />
                    <Route path="services" element={<Services />} />
                    <Route path="medical-directory" element={<MedicalDirectory />} />
                    <Route path="report" element={<HealthReport />} />
                  </Route>
                </Route>
              </Routes>
            </AppointmentProvider>
          </UserProvider>
        </DoctorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
