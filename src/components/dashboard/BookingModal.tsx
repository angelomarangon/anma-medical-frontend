import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useDoctors } from "../../context/doctor-context";
import { useAppointments } from "../../context/appointment-context";
import { useAuth } from "../../context/auth-context";
import axios from "axios";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookingSuccess?: (data: { date: Date; specialty: string; doctor: string; time: string }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBookingSuccess }) => {
    const { doctors, getAllDoctors } = useDoctors();
    const { createAppointment } = useAppointments();
    const { token } = useAuth();

    const [specialty, setSpecialty] = useState("");
    const [doctor, setDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState("");

    // Cargar doctores al abrir el modal
    useEffect(() => {
        if (isOpen && doctors.length === 0) {
            getAllDoctors();
        }
    }, [isOpen, doctors.length, getAllDoctors]);

    // Obtener especialidades únicas
    const uniqueSpecialties = Array.from(new Set(doctors.map((doc) => doc.specialty).filter(Boolean)));

    // Filtrar doctores según la especialidad seleccionada
    const filteredDoctors = doctors.filter((doc) => doc.specialty === specialty);

    // Obtener los días en los que trabaja el doctor seleccionado
    const getAvailableDays = (): string[] => {
        const selectedDoctor = doctors.find((doc) => doc.id === doctor);
        if (!selectedDoctor) return [];

        // 🔹 Traducción de días de inglés a español
        const dayTranslations: Record<string, string> = {
            monday: "lunes",
            tuesday: "martes",
            wednesday: "miércoles",
            thursday: "jueves",
            friday: "viernes",
            saturday: "sábado",
            sunday: "domingo",
        };

        return selectedDoctor.availableDays.map(day => dayTranslations[day.toLowerCase()] || "");
    };

    const addMinutesToTime = (time: string, minutes: number) => {
        const [hours, mins] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, mins + minutes, 0);

        const newHours = date.getHours().toString().padStart(2, "0");
        const newMinutes = date.getMinutes().toString().padStart(2, "0");

        return `${newHours}:${newMinutes}`;
    };


    // Filtrar horarios disponibles cuando se elige una fecha
    useEffect(() => {
        const fetchAvailableTimes = async () => {
            if (!doctor || !selectedDate || !token) {
                setAvailableTimes([]); // Reiniciar si falta información
                return;
            }

            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd");
                console.log("📅 Fecha seleccionada:", formattedDate);
                console.log("📋 Doctor seleccionado:", doctors.find((doc) => doc.id === doctor));


                const res = await axios.get(
                    `https://anma-medical-backend.onrender.com/api/appointment/doctor/${doctor}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const doctorAppointments = res.data;
                console.log("📋 Citas del doctor:", doctorAppointments);

                const takenTimes = doctorAppointments
                    .filter((app: { date: string }) => app.date.startsWith(formattedDate)) // 🔹 Comparación flexible
                    .map((app: { time: string }) => app.time);

                console.log("⛔ Horarios ocupados:", takenTimes);

                const selectedDoctor = doctors.find((doc) => doc.id === doctor);
                if (!selectedDoctor) {
                    setAvailableTimes([]);
                    return;
                }

                const dayOfWeekEnglish = format(selectedDate, "EEEE").toLowerCase(); // Genera en inglés
                console.log("🗓️ Día de la semana seleccionado:", dayOfWeekEnglish);

                const availableSlots = selectedDoctor.availableHours[dayOfWeekEnglish] || [];
                console.log("📆 Horarios de trabajo del doctor:", availableSlots);

                // 🔹 Generamos intervalos de 30 minutos
                const timeSlots: string[] = [];
                availableSlots.forEach(slot => {
                    let startTime = slot.start;
                    while (startTime < slot.end) {
                        const nextTime = addMinutesToTime(startTime, 30);
                        if (nextTime <= slot.end) {
                            timeSlots.push(`${startTime} - ${nextTime}`);
                        }
                        startTime = nextTime;
                    }
                });

                console.log("✅ Horarios generados:", timeSlots);

                const parseTime = (time: string) => {
                    const [hours, minutes] = time.split(":").map(Number);
                    return hours * 60 + minutes; // Convertimos a minutos para comparación numérica
                };

                // ✅ Filtramos los horarios disponibles asegurándonos de que no hay conflictos
                const freeTimes = timeSlots.filter(timeSlot => {
                    const [start, end] = timeSlot.split(" - ").map(parseTime);

                    return !takenTimes.some((takenTime: string) => {
                        const [takenStart, takenEnd] = takenTime.split(" - ").map(parseTime);

                        // 📌 Validamos que no haya superposición de turnos
                        return (
                            (start >= takenStart && start < takenEnd) || // Si el inicio del nuevo turno está dentro de uno existente
                            (end > takenStart && end <= takenEnd)       // Si el final del nuevo turno está dentro de uno existente
                        );
                    });
                });
                console.log("🟢 Horarios disponibles:", freeTimes);

                console.log("📋 Citas del doctor recibidas:", doctorAppointments);
                console.log("📅 Fecha seleccionada:", formattedDate);
                console.log("⛔ Horarios ocupados en la BD:", takenTimes);


                setAvailableTimes(freeTimes);
            } catch (error) {
                console.error("❌ Error al obtener horarios disponibles:", error);
                setAvailableTimes([]);
            }
        };

        fetchAvailableTimes();
    }, [doctor, selectedDate, doctors, token]);



    // Validar si un día está disponible en el calendario
    const isDayAvailable = (date: Date) => {
        if (!doctor) return false; // Si no hay doctor seleccionado, no permitir selección

        const availableDays = getAvailableDays();
        const dayName = format(date, "EEEE", { locale: es }).toLowerCase(); // Día en español

        // console.log("🗓️ Día seleccionado:", format(date, "EEEE, dd/MM/yyyy", { locale: es }));
        // console.log("📅 Días disponibles:", availableDays);

        return availableDays.includes(dayName); // ✅ Solo habilita los días correctos
    };


    // Confirmar reserva
    const handleConfirm = async () => {
        if (!selectedDate || !specialty || !doctor || !selectedTime) return;

        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        const success = await createAppointment(doctor, formattedDate, selectedTime);

        if (!success) {
            alert("❌ El horario seleccionado ya está ocupado. Elige otro.");
            return;
        }

        console.log("✅ Cita reservada:", { specialty, doctor, formattedDate, selectedTime });

        if (onBookingSuccess) {
            onBookingSuccess({ date: selectedDate, specialty, doctor, time: selectedTime });
        }

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6 space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Solicitud de Turno</DialogTitle>
                    <DialogDescription>
                        Selecciona la especialidad, doctor, fecha y horario para tu cita.
                    </DialogDescription>
                </DialogHeader>

                {/* 🏥 Selección de especialidad */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Especialidad</label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueSpecialties.length > 0 ? (
                                uniqueSpecialties.map((specialty) => (
                                    <SelectItem key={specialty} value={specialty}>
                                        {specialty}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none" disabled>
                                    No hay especialidades disponibles
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* 👨‍⚕️ Selección de doctor */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Doctor</label>
                    <Select value={doctor} onValueChange={setDoctor} disabled={!filteredDoctors.length}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        {doc.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none" disabled>
                                    No hay doctores disponibles
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* 📅 Selección de fecha con `react-datepicker` */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Fecha</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        filterDate={isDayAvailable} // Solo habilita los días en los que trabaja el doctor
                        minDate={new Date()} // No permite seleccionar fechas pasadas
                        dateFormat="dd/MM/yyyy"
                        locale={es}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white"
                        placeholderText="Selecciona una fecha"
                    />
                </div>

                {/* ⏰ Selección de horario */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Horario</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!availableTimes.length}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un horario" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTimes.length > 0 ? (
                                availableTimes.map((time, index) => (
                                    <SelectItem key={index} value={time}>
                                        {time}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none" disabled>
                                    No hay horarios disponibles
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* 🏁 Botones */}
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleConfirm} disabled={!selectedDate || !specialty || !doctor || !selectedTime} className="bg-green-500 hover:bg-green-600">
                        Confirmar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
