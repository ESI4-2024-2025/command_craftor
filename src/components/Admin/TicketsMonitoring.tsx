import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import TicketInput, {TicketContent} from "../SupportSection/assets/TicketInput";

function TicketsMonitoring() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    let [tickets, setTickets] = useState(new Array<TicketContent>());

    function isTicketRegistered(ticket: TicketContent): boolean {
        console.log('filter', ticket);
        return tickets.filter((item) => item.id === ticket.id).length > 0;
    }

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
                response.data.map((element: any) => {
                    const ticketContent = {
                        id: element._id,
                        title: element.titre,
                        email: element.email,
                        status: element.statut,
                    };

                    if (isTicketRegistered(ticketContent)) {
                        return;
                    }

                    setTickets(tickets => [...tickets, ticketContent]);
                })
            }).catch(reason => console.error(reason));
        }
    }, []);

    return (
        <div className="admin-page">
            <h1 className="admin-title">{t("ADMIN.TICKETS")}</h1>
            <div className="admin">
                <div className="admin-menu">
                    {tickets.map((ticket: TicketContent, index: number) => (
                        <TicketInput
                            ticket={ticket}
                            index={index}
                        ></TicketInput>
                    ))}
                </div>
            </div>
            <div className="admin-buttons">
                <ButtonsJavaEdition taille="40" title={t("GLOBAL.BACK")} path="goback"/>
            </div>
        </div>
    );
}

export default TicketsMonitoring;