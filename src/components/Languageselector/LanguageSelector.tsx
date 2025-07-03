import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import "../../styles/LanguageSelector.css";

interface LanguageSelectorProps {
	setLanguage: (lng: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({setLanguage}) => {
	const {i18n} = useTranslation();

	/**
	 * Change the language of the website
	 *
	 * @param language The language to change to
	 */
	const changeLanguage = (language: string) => {
		i18n.changeLanguage(language);
		setLanguage(language);
		localStorage.setItem("language", language);
	};

	/**
	 * Set the language to the saved language in the local storage everytime the component is mounted
	 */
	useEffect(() => {
		const savedLanguage = localStorage.getItem("language") || "en";
		i18n.changeLanguage(savedLanguage);
		setLanguage(savedLanguage);
	}, []);

	return (
		<div className="language-selector">
			<select onChange={(e) => changeLanguage(e.target.value)} defaultValue={localStorage.getItem("language") || "en"}>
				<option value="en">English</option>
				<option value="fr">Français</option>
			</select>
		</div>
	);
};

export default LanguageSelector;