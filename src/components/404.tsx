import React from "react";
import ButtonsJavaEdition from "./utilities/ButtonsJavaEdition";
import "../styles/404.css";
import {useTranslation} from "react-i18next";

const NotFound = () => {
	const {t} = useTranslation();

	return (
		<div className="not-found-container">
			<h1>{t("404.MESSAGE")}</h1>
			<ButtonsJavaEdition size="20" title={t("404.BACK")} path="/"/>
		</div>
	);
};

export default NotFound;