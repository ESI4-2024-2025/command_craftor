import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import en from "./traductions/EN.json";
import fr from "./traductions/FR.json";

i18n
	.use(initReactI18next)
	.init({
		resources: {
			en: {translation: en},
			fr: {translation: fr}
		},
		lng: "fr", // default language
		fallbackLng: "en",
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;