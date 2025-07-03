import {useTranslation} from "react-i18next";
import React from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";

function Admin() {
	const {t} = useTranslation();

	return (
		<div className="admin-page">
			<h1 className="admin-title">{t("ADMIN.TITLE")}</h1>
			<div className="admin">
				<div className="admin-menu">
					<ButtonsJavaEdition taille="35" title={t("ADMIN.TICKETS.TITLE")} path="/admin/tickets"/>
				</div>
			</div>
			<div className="admin-buttons">
				<ButtonsJavaEdition taille="40" title={t("GLOBAL.BACK")} path="goback"/>
			</div>
		</div>
	);
}

export default Admin;