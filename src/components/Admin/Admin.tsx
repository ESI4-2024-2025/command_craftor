import {useTranslation} from "react-i18next";
import React from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";

function Admin() {
    const {t} = useTranslation();

    return (
        <div className="admin-page">
            <h1 className="admin-title">{t("ADMIN.TITLE")}</h1>
            <div className="admin" data-testid="Home">
                 <div className="admin-menu">
                 </div>
            </div>
            <div className="admin-buttons">
                <ButtonsJavaEdition taille="40" title="GLOBAL.BACK" path="/"/>
            </div>
        </div>
    );
}

export default Admin;