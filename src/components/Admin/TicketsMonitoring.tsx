import {useTranslation} from "react-i18next";
import React, {createRef, useEffect, useRef, useState} from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export type TicketContent = {
    _id: string;
    titre: string,
    email: string,
    statut: string
    corps: string
    archived: boolean
};

function TicketsMonitoring() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(new Array<TicketContent>());
    const [selectedTicket, setSelectedTicket] = useState<TicketContent|null>(null);
    const isFirstLoad = useRef(true);
    const ticketDetailsContainerRef = createRef<HTMLDivElement>();

    function isTicketRegistered(ticket: TicketContent): boolean {
        return tickets.filter((item) => item._id === ticket._id).length > 0;
    }

    useEffect(() => {
        if (!isFirstLoad.current) return;
        isFirstLoad.current = false;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/forbidden");
            return;
        }

        axios.get(`${process.env.REACT_APP_HOST_BACK}/tickets`, {
            headers: {
                "x-access-token": token
            }
        }).then(response => {
            const ticketsList: TicketContent[] = [];

            response.data.map((element: TicketContent) => {
                const ticketContent = {
                    _id: element._id,
                    titre: element.titre,
                    email: element.email,
                    statut: element.statut,
                    corps: element.corps,
                    archived: element.archived,
                };

                if (isTicketRegistered(ticketContent) || element.archived) {
                    return;
                }

                ticketsList.push(ticketContent);
            })

            setTickets(tickets => [...tickets, ...ticketsList]);
        }).catch(reason => console.error(reason));
    }, [tickets]);

    function showTicketDetails(ticket: TicketContent|null) {
        setSelectedTicket(ticket);
    }

    function archiveTicket() {
        if (selectedTicket === null) return;

        const token = localStorage.getItem("accessToken");

        if (!token) {
            navigate("/forbidden");
            return;
        }

        axios.put(`${process.env.REACT_APP_HOST_BACK}/tickets/${selectedTicket._id}/archive`, {
            headers: {
                "x-access-token": token
            }
        }).then(() => {
            setTickets([...tickets.filter((ticket) => selectedTicket._id !== ticket._id)])
            showTicketDetails(null);
        }).catch(reason => console.error(reason));
    }

    function changeTicketStatus() {
        if (selectedTicket === null) return;

        const token = localStorage.getItem("accessToken");

        if (!token) {
            navigate("/forbidden");
            return;
        }

        axios.put(`${process.env.REACT_APP_HOST_BACK}/tickets/${selectedTicket._id}/statut`, {
            headers: {
                "x-access-token": token
            },
            body: {
                statut: ''
            }
        }).then(() => {
            setSelectedTicket({
                ...selectedTicket,
                statut: '',
            });
        }).catch(reason => console.error(reason));
    }

    return (
        <div className="admin-tickets-page">
            <h1 className="admin-title">{t("ADMIN.TICKETS.TITLE")}</h1>
            <div className="admin">
                <div className="admin-tickets-list">
                    {tickets.map((ticket: TicketContent, index: number) => (
                        <div key={index} className="admin-ticket-elements">
                            <ButtonsJavaEdition taille="28" title={ticket.titre} onClick={() => showTicketDetails(ticket)}/>
                        </div>
                    ))}
                </div>
                <div ref={ticketDetailsContainerRef} className="admin-ticket-display" hidden={!selectedTicket} >
                    <div className="admin-ticket-detail">
                        <label htmlFor="ticket-email">{t("ADMIN.TICKETS.EMAIL") + ':'}</label>
                        <p id="ticket-email">{selectedTicket?.email}</p>
                    </div>
                    <div className="admin-ticket-detail">
                        <label htmlFor="ticket-status">{t("ADMIN.TICKETS.STATUS") + ':'}</label>
                        <p id="ticket-status">{selectedTicket?.statut}</p>
                    </div>
                    <div className="admin-ticket-detail">
                        <label htmlFor="ticket-title">{t("ADMIN.TICKETS.SUBJECT") + ':'}</label>
                        <p id="ticket-title">{selectedTicket?.titre}</p>
                    </div>
                    <div className="admin-ticket-body">
                        <label htmlFor="ticket-body">{t("ADMIN.TICKETS.BODY") + ':'}</label>
                        <textarea
                            id="ticket-body"
                            cols={200}
                            rows={8}
                            className="minecraft-input new-ticket-description"
                            readOnly={true}
                            value={selectedTicket?.corps}
                        />
                    </div>
                    <div className="admin-tickets-buttons">
                        <ButtonsJavaEdition taille="20" title={t("ADMIN.TICKETS.CHANGE_STATUS")} onClick={changeTicketStatus}/>
                        <ButtonsJavaEdition taille="20" title={t("ADMIN.TICKETS.ARCHIVE")} onClick={archiveTicket}/>
                    </div>
                </div>
            </div>
            <div className="admin-buttons">
                <ButtonsJavaEdition taille="80" title={t("GLOBAL.BACK")} path="goback"/>
            </div>
        </div>
    );
}

export default TicketsMonitoring;