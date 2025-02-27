import {useTranslation} from "react-i18next";
import React from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";

function TicketsMonitoring() {
    const {t} = useTranslation();

    return (
        <div className="admin-page">
            <h1 className="admin-title">{t("ADMIN.TITLE")}</h1>
            <div className="admin">
                <div className="admin-menu">
                    <ButtonsJavaEdition taille="35" title="ADMIN.TICKETS" path="/admin/tickets"/>
                </div>
            </div>
            <div className="admin-buttons">
                <ButtonsJavaEdition taille="40" title="GLOBAL.BACK" path="goback"/>
            </div>
        </div>
    );
}

export default TicketsMonitoring;