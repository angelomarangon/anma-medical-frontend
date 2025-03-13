import { useAppointments } from "../../context/appointment-context";
import { useState } from "react";
import { CalendarCheck, Trash2, AlertTriangle, Clock, CalendarDays, Stethoscope } from "lucide-react"; // Nuevo icono profesional
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

const AppointmentsList = () => {
  const { appointments, loading, cancelAppointment, deleteAppointment } = useAppointments();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"cancel" | "delete">("cancel");

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setModalType("cancel");
    setShowConfirmModal(true);
  };

  const handleDeleteClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setModalType("delete");
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointmentId) return;
    setShowConfirmModal(false);
    await cancelAppointment(selectedAppointmentId);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointmentId) return;
    setShowConfirmModal(false);
    await deleteAppointment(selectedAppointmentId);
  };

  return (
    <div className="px-6 py-12 space-y-8">
      {/* 📅 Título con icono */}
      <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
        <CalendarCheck size={30} className="text-blue-600" />
        Mis Citas
      </h2>

      {/* 🗂 Contenedor de citas */}
      <div className="bg-white p-6 shadow-lg rounded-xl">
        {loading ? (
          <p className="text-gray-500 text-center">Cargando citas...</p>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className={`p-5 border-l-4 shadow-sm rounded-lg transition-all duration-300 hover:shadow-md flex items-center justify-between ${
                  app.status === "scheduled" ? "border-blue-500 bg-blue-50" : "border-red-500 bg-red-50"
                }`}
              >
                {/* Sección Izquierda: Datos del doctor y cita */}
                <div className="flex items-center gap-4">
                  {/* 📌 Icono profesional del doctor */}
                  <div className="bg-blue-500 text-white p-3 rounded-full flex items-center justify-center shadow-md">
                    <Stethoscope size={28} />
                  </div>

                  {/* 📄 Información */}
                  <div>
                    {/* Nombre del doctor */}
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      {app.doctor.gender === "Femenino" ? "Dra." : "Dr."} {app.doctor.name}
                      <span className="text-gray-600 text-sm">({app.doctor.specialty})</span>
                    </h3>

                    {/* 📅 Fecha de la cita */}
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <CalendarDays size={16} className="text-gray-500" />
                      <span className="font-medium">
                        {new Date(app.date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>

                    {/* ⏰ Horario de la cita */}
                    <p className="text-gray-600 flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="font-medium">{app.time}</span>
                    </p>
                  </div>
                </div>

                {/* Sección Derecha: Estado + Botón de Acción */}
                <div className="flex flex-col items-end space-y-2">
                  {/* Estado */}
                  <span
                    className={`px-3 py-1 text-sm font-semibold text-white rounded-md text-center ${
                      app.status === "scheduled" ? "bg-blue-500" : "bg-red-500"
                    }`}
                  >
                    {app.status === "scheduled" ? "Programada" : "Cancelada"}
                  </span>

                  {/* Botón de acción */}
                  {app.status !== "cancelled" ? (
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                      onClick={() => handleCancelClick(app.id)}
                    >
                      <AlertTriangle size={18} />
                      Cancelar
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2"
                      onClick={() => handleDeleteClick(app.id)}
                    >
                      <Trash2 size={18} />
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No tienes citas programadas</p>
        )}
      </div>

      {/* 🛑 Modal de Confirmación (Cancelar o Eliminar) */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {modalType === "cancel" ? "¿Cancelar esta cita?" : "¿Eliminar esta cita?"}
            </DialogTitle>
            <DialogDescription>
              {modalType === "cancel"
                ? "Esta acción no se puede deshacer. ¿Estás seguro de cancelar la cita?"
                : "Esta acción eliminará permanentemente la cita. ¿Estás seguro?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              No, volver
            </Button>
            <Button
              variant={modalType === "cancel" ? "destructive" : "secondary"}
              onClick={modalType === "cancel" ? handleConfirmCancel : handleConfirmDelete}
            >
              {modalType === "cancel" ? "Sí, cancelar" : "Sí, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsList;
