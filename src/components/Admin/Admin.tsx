import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import {useNavigate} from "react-router-dom";
import {forbidAccessToAdminResource} from "../../utils";

function Admin() {
    const navigate = useNavigate();
    const {t} = useTranslation();

    useEffect(() => {forbidAccessToAdminResource(navigate)}, [navigate]);

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