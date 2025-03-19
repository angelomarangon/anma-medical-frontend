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
import { useTranslation } from "react-i18next";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookingSuccess?: (data: { date: Date; specialty: string; doctor: string; time: string }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBookingSuccess }) => {
    const { doctors, getAllDoctors } = useDoctors();
    const { createAppointment } = useAppointments();
    const { token } = useAuth();
    const { t } = useTranslation();

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
                const res = await axios.get(
                    `https://anma-medical-backend.onrender.com/api/appointment/doctor/${doctor}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const doctorAppointments = res.data;
                const takenTimes = doctorAppointments
                    .filter((app: { date: string }) => app.date.startsWith(formattedDate))
                    .map((app: { time: string }) => app.time);

                const selectedDoctor = doctors.find((doc) => doc.id === doctor);
                if (!selectedDoctor) {
                    setAvailableTimes([]);
                    return;
                }

                const dayOfWeekEnglish = format(selectedDate, "EEEE").toLowerCase();

                const availableSlots = selectedDoctor.availableHours[dayOfWeekEnglish] || [];
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

                const parseTime = (time: string) => {
                    const [hours, minutes] = time.split(":").map(Number);
                    return hours * 60 + minutes;
                };

                const freeTimes = timeSlots.filter(timeSlot => {
                    const [start, end] = timeSlot.split(" - ").map(parseTime);

                    return !takenTimes.some((takenTime: string) => {
                        const [takenStart, takenEnd] = takenTime.split(" - ").map(parseTime);

                        return (
                            (start >= takenStart && start < takenEnd) ||
                            (end > takenStart && end <= takenEnd)
                        );
                    });
                });

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
        if (!doctor) return false;

        const availableDays = getAvailableDays();
        const dayName = format(date, "EEEE", { locale: es }).toLowerCase();

        return availableDays.includes(dayName);
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

        if (onBookingSuccess) {
            onBookingSuccess({ date: selectedDate, specialty, doctor, time: selectedTime });
        }

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6 space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">{t("appointmentRequest")}</DialogTitle>
                    <DialogDescription>
                        {t("selectDetails")}
                    </DialogDescription>
                </DialogHeader>

                {/* 🏥 Selección de especialidad */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">{t("specialty")}</label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("selectSpecialty")} />
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
                                    {t("noSpecialty")}
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* 👨‍⚕️ Selección de doctor */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">{t("doctor")}</label>
                    <Select value={doctor} onValueChange={setDoctor} disabled={!filteredDoctors.length}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("selectDoctor")} />
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
                                    {t("noDoctor")}
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* 📅 Selección de fecha con `react-datepicker` */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">{t("date")}</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        filterDate={isDayAvailable}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        locale={t("localeLang")}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white"
                        placeholderText={t("selectDate")}
                    />
                </div>

                {/* ⏰ Selección de horario */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">{t("time")}</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!availableTimes.length}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("selectTime")} />
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
                                    {t("noTimes")}
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* 🏁 Botones */}
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
                    <Button onClick={handleConfirm} disabled={!selectedDate || !specialty || !doctor || !selectedTime} className="bg-green-500 hover:bg-green-600">
                        {t("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
