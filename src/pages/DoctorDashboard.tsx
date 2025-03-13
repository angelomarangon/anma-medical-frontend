import { useAuth } from "../context/auth-context";

const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-blue-600">👨‍⚕️ Panel de Doctor</h1>
        <p className="text-center text-gray-600 mt-2">
          Bienvenido, <strong>{user?.name}</strong>. Aquí puedes gestionar tus citas y pacientes.
        </p>
        {/* Aquí agregaremos más secciones (ver siguiente paso) */}
      </div>
    </div>
  );
};

export default DoctorDashboard;