import {useTranslation} from "react-i18next";
import React, {useEffect, useRef, useState} from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import TicketInput, {TicketContent} from "../SupportSection/assets/TicketInput";

function TicketsMonitoring() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(new Array<TicketContent>());
    const isFirstLoad = useRef(true);

    function isTicketRegistered(ticket: TicketContent): boolean {
        return tickets.filter((item) => item.id === ticket.id).length > 0;
    }

    useEffect(() => {
        if (!isFirstLoad.current) return;
        isFirstLoad.current = false;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/forbidden");
        } else {
            axios.get(`${process.env.REACT_APP_HOST_BACK}/tickets`, {
                headers: {
                    "x-access-token": token
                }
            }).then(response => {
                const ticketsList: TicketContent[] = [];
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

                    ticketsList.push(ticketContent);
                })

                setTickets(tickets => [...tickets, ...ticketsList]);
            }).catch(reason => console.error(reason));
        }
    }, [tickets]);

    return (
        <div className="admin-page">
            <h1 className="admin-title">{t("ADMIN.TICKETS")}</h1>
            <div className="admin">
                <div className="admin-menu">
                    <ul className="admin-menu-list">
                        {tickets.map((ticket: TicketContent, index: number) => (
                            <li key={index}><TicketInput
                                ticket={ticket}
                                index={index}
                            ></TicketInput></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="admin-buttons">
                <ButtonsJavaEdition taille="40" title={t("GLOBAL.BACK")} path="goback"/>
            </div>
        </div>
    );
}

export default TicketsMonitoring;