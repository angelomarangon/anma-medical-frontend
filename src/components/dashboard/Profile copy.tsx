import { useState, useEffect } from "react";
import { UserCircle, Edit, Save, Lock, Camera } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { parse, format } from "date-fns";
import { useUser } from "../../context/user-context";

const Profile = () => {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    identityNumber: "",
    socialSecurity: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    bloodType: "",
    gender: "",
    birthDate: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        identityNumber: user.identityNumber || "",
        socialSecurity: user.socialSecurity || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        postalCode: user.postalCode || "",
        city: user.city || "",
        bloodType: user.bloodType || "",
        gender: user.gender || "",
        birthDate: user.birthDate ? format(new Date(user.birthDate), "dd/MM/yyyy") : "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Evita la recarga del formulario

    // ✅ Formateamos los datos asegurando que las claves coincidan con formData
    const updatedData = {
      ...formData,
      birthDate: formData.birthDate
        ? parse(formData.birthDate, "dd/MM/yyyy", new Date()).toISOString()
        : null,
    };

    const success = await updateUser(updatedData);

    if (success) {
      // ✅ Actualizamos el estado local del usuario sin recargar
      setFormData((prevData) => ({
        ...prevData,
        ...{
          documento: updatedData.identityNumber,
          seguridadSocial: updatedData.socialSecurity,
          correo: updatedData.email,
          telefono: updatedData.phone,
          domicilio: updatedData.address,
          codigoPostal: updatedData.postalCode,
          localidad: updatedData.city,
          grupoSanguineo: updatedData.bloodType,
          genero: updatedData.gender,
          birthDate: format(new Date(updatedData.birthDate || ""), "dd/MM/yyyy"),
        },
      }));

      setIsEditing(false); // ✅ Cambia a modo vista sin interrupciones
      console.log("✅ Usuario actualizado correctamente");
    } else {
      console.error("❌ Error al actualizar usuario");
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSave} className="px-6 py-12 space-y-8">
      {/* 📌 Título */}
      <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
        <UserCircle size={30} className="text-blue-600" /> Mi Perfil
      </h2>

      {/* 📸 Sección Superior */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="bg-gradient-to-b from-blue-500 to-blue-400 p-10 flex flex-col items-center">
          {/* 📸 Imagen de perfil */}
          <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
            {profileImage ? (
              <img src={profileImage} alt="Foto de perfil" className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserCircle size={80} className="text-gray-300" />
            )}
            {isEditing && (
              <label className="absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer shadow-md">
                <Camera size={16} className="text-gray-600" />
                <input type="file" className="hidden" onChange={handleProfileImageChange} />
              </label>
            )}
          </div>

          {/* ✏️ Edición de nombre */}
          <div className="mt-3 flex items-center gap-2 justify-center">
            {isEditing ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-center bg-white border rounded-md p-1"
                autoFocus
              />
            ) : (
              <h3 className="text-lg font-semibold text-white">{formData.name}</h3>
            )}
          </div>
        </div>

        {/* 📄 Información de Usuario */}
        <div className="p-8 grid grid-cols-2 gap-6">
          {[
            { label: "Documento de Identidad", name: "identityNumber" },
            { label: "Número Seguridad Social", name: "socialSecurity" },
            { label: "Correo Electrónico", name: "email", readOnly: true },
            { label: "Teléfono", name: "phone" },
            { label: "Domicilio", name: "address" },
            { label: "Código Postal", name: "postalCode" },
            { label: "Localidad", name: "city" },
          ].map(({ label, name, readOnly }) => (
            <div key={name}>
              <label className="text-sm font-medium">{label}</label>
              <Input
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                readOnly={readOnly || !isEditing}
                className={!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </div>
          ))}

          {/* 🔹 Género (Selector) */}
          <div>
            <label className="text-sm font-medium">Género</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md text-gray-700 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
            >
              <option value="">Seleccionar...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* 🔹 Grupo Sanguíneo (Selector) */}
          <div>
            <label className="text-sm font-medium">Grupo Sanguíneo</label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md text-gray-700 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
            >
              <option value="">Seleccionar...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* 📅 Fecha de Nacimiento */}
          <div>
            <label className="text-sm font-medium">Fecha de Nacimiento</label>
            <br />
            <DatePicker
              selected={formData.birthDate ? parse(formData.birthDate, "dd/MM/yyyy", new Date()) : null}
              onChange={(date) =>
                setFormData({
                  ...formData,
                  birthDate: date ? format(date, "dd/MM/yyyy") : "",
                })
              }
              dateFormat="dd/MM/yyyy"
              locale={es}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md text-gray-700 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer"
                }`}
            />
          </div>
        </div>

        {/* 🎛️ Botones de Acción */}
        <div className="flex justify-between p-8">
          <Button type="button" variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save size={18} /> : <Edit size={18} />}
            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
          </Button>

          <Button type="button" variant="destructive">
            <Lock size={18} />
            Cambiar Contraseña
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Profile;
