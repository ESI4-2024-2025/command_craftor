import React from "react";
import ButtonsJavaEdition from "./utilities/ButtonsJavaEdition";
import "../styles/403.css";
import {useTranslation} from "react-i18next";

function Forbidden() {
    const { t } = useTranslation();

    return (
        <div className="forbidden-container">
            <h1>{t('403.MESSAGE')}</h1>
            <ButtonsJavaEdition taille="20" title={t('403.BACK')} path="/"/>
        </div>
    );
}

export default Forbidden;