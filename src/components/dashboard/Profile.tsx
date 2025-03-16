import { useState, useEffect } from "react";
import { UserCircle, Edit, Save, Lock, Camera } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { es } from "date-fns/locale";
import { parse, format } from "date-fns";
import { useUser } from "../../context/user-context";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { user, updateUser } = useUser();
  const { t } = useTranslation();
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
        birthDate: user.birthDate
          ? format(new Date(user.birthDate), "dd/MM/yyyy")
          : "",
      });
    }
  }, [user]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar si la fecha de nacimiento es válida antes de formatearla
    const formattedBirthDate = formData.birthDate
      ? (() => {
        try {
          return parse(formData.birthDate, "dd/MM/yyyy", new Date()).toISOString();
        } catch (error) {
          console.error("Error parsing birthDate:", error);
          return null;
        }
      })()
      : null;

    // Enviar los datos actualizados
    const updatedData = {
      ...formData,
      birthDate: formattedBirthDate,
    };

    const success = await updateUser(updatedData);

    if (success) {
      setFormData((prevData) => ({
        ...prevData,
        birthDate: updatedData.birthDate
          ? format(new Date(updatedData.birthDate), "dd/MM/yyyy")
          : "",
      }));

      setIsEditing(false);
      console.log("✅ Usuario actualizado correctamente");
    } else {
      console.error("❌ Error al actualizar usuario");
    }
  };



  if (!user) return <div className="text-center py-6">Cargando usuario...</div>;

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
        <UserCircle size={30} className="text-blue-600" /> {t("myProfileTitle")}
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
            { label: t("identityDocument"), name: "identityNumber" },
            { label: t("socialSecurityNumber"), name: "socialSecurity" },
            { label: t("email"), name: "email", readOnly: true },
            { label: t("phone"), name: "phone" },
            { label: t("address"), name: "address" },
            { label: t("postalCode"), name: "postalCode" },
            { label: t("city"), name: "city" },
            { label: t("gender"), name: "gender", type: "select", options: [t("male"), t("female"), t("other")] },
            { label: t("bloodType"), name: "bloodType", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
            { label: t("birthDate"), name: "birthDate", type: "date" },
          ].map(({ label, name, readOnly, type, options }) => (
            <div key={name}>
              <label className="text-sm font-medium">{label}</label>

              {type === "date" ? (
                <>
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
                    locale={t("localeLang") as string}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md text-gray-700 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer"}`}
                  />
                </>
              ) : type === "select" ? (
                <select
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md text-gray-700 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                >
                  <option value="">{t("selectOption")}</option>
                  {options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <Input
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleInputChange}
                  readOnly={readOnly || !isEditing}
                  className={!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}
                />
              )}
            </div>
          ))}
        </div>


        {/* 🎛️ Botones de Acción */}
        <div className="flex justify-between p-8">
          {isEditing ? (
            <Button type="submit" className="flex items-center gap-2">
              <Save size={18} />
              {t("saveChanges")}
            </Button>
          ) : (
            <Button
              type="button" // 🔹 Esto previene el envío del formulario
              variant="outline"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault(); // ✅ Asegura que no se recargue la página
                setIsEditing(true);
              }}
            >
              <Edit size={18} />
              {t("editProfile")}
            </Button>

          )}

          <Button type="button" variant="destructive" className="flex items-center gap-2">
            <Lock size={18} />
            {t("changePassword")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Profile;