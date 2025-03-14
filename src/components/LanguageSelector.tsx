import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <select onChange={changeLanguage} value={i18n.language} className="p-2 border rounded-md">
            <option value="es">🇪🇸 Español</option>
            <option value="en">🇺🇸 English</option>
            <option value="it">🇮🇹 Italiano</option>
        </select>
    );
};

export default LanguageSelector;
