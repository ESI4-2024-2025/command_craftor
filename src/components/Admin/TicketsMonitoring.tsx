import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function TicketsMonitoring() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    let tickets = [];

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/forbidden");
        } else {
            axios.get(`${process.env.REACT_APP_HOST_BACK}/tickets`, {
                headers: {
                    "x-access-token": token
                }
            }).then(response => {
                response.data.forEach((element: any) => {
                    tickets.push({
                        title: element.titre,
                        email: element.email,
                        status: element.statut,
                    })
                })
            }).catch(reason => console.error(reason));
        }
    }, []);

    return (
        <div className="admin-page">
            <h1 className="admin-title">{"AAAAAAAAAAA"}</h1>
            <div className="admin">
                <div className="admin-menu">
                    <ButtonsJavaEdition taille="35" title={t("ADMIN.TICKETS")} path="/admin/tickets"/>
                </div>
            </div>
            <div className="admin-buttons">
                <ButtonsJavaEdition taille="40" title={t("GLOBAL.BACK")} path="goback"/>
            </div>
        </div>
    );
}

export default TicketsMonitoring;