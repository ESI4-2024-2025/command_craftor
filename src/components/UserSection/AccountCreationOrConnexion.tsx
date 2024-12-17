import React, { useState } from "react";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import "../../styles/AccountCreationOrConnexion.css";
import Creation from "./Creation";
import Connexion from "./Connexion";
import {useTranslation} from "react-i18next";

function AccountCreationOrConnexion() {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("connexion");

    return (
        <div className="account-creation-or-connexion">
            <div className="back-button-container">
                <ButtonsJavaEdition taille="20" title="GLOBAL.BACK" path="/"/>
            </div>
            <div className="tabs">
                <button className={`tab ${activeTab === "connexion" ? "active" : ""}`}
                        onClick={() => setActiveTab("connexion")}>
                    {t("CONNEXION_CREATION.CONNEXION")}
                </button>
                <button className={`tab ${activeTab === "creation" ? "active" : ""}`}
                        onClick={() => setActiveTab("creation")}>
                    {t("CONNEXION_CREATION.CREATION")}
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "connexion" && <Connexion/>}
                {activeTab === "creation" && <Creation/>}
            </div>
        </div>
    );
}

export default AccountCreationOrConnexion;