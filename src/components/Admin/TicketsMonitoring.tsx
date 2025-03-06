import {useTranslation} from "react-i18next";
import React, {createRef, useEffect, useRef, useState} from "react";
import "../../styles/Admin.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export type TicketContent = {
    id: string;
    title: string,
    email: string,
    status: string
    body: string
};

function TicketsMonitoring() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(new Array<TicketContent>());
    const isFirstLoad = useRef(true);
    const ticketDetailsContainerRef = createRef<HTMLDivElement>();
    const [selectedId, setSelectedId] = useState("");
    const [selectedEmail, setSelectedEmail] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedBody, setSelectedBody] = useState("");

    function isTicketRegistered(ticket: TicketContent): boolean {
        return tickets.filter((item) => item.id === ticket.id).length > 0;
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

            response.data.map((element: any) => {
                const ticketContent = {
                    id: element._id,
                    title: element.titre,
                    email: element.email,
                    status: element.statut,
                    body: element.corps,
                };

                if (isTicketRegistered(ticketContent) || element.archived) {
                    return;
                }

                ticketsList.push(ticketContent);
            })

            setTickets(tickets => [...tickets, ...ticketsList]);
        }).catch(reason => console.error(reason));
    }, [tickets]);

    function hideTicketsDetails() {
        setSelectedId("");
        setSelectedEmail("");
        setSelectedStatus("");
        setSelectedSubject("");
        setSelectedBody("");
        ticketDetailsContainerRef.current?.setAttribute('hidden', 'hidden');
    }

    function showTicketDetails(ticket: TicketContent) {
        setSelectedId(ticket.id);
        setSelectedEmail(ticket.email);
        setSelectedStatus(ticket.status);
        setSelectedSubject(ticket.title);
        setSelectedBody(ticket.body);
        ticketDetailsContainerRef.current?.removeAttribute("hidden");
    }

    function archiveTicket() {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            navigate("/forbidden");
            return;
        }

        axios.put(`${process.env.REACT_APP_HOST_BACK}/tickets/${selectedId}/archive`, {
            headers: {
                "x-access-token": token
            }
        }).then(() => {
            setTickets([...tickets.filter((ticket) => selectedId !== ticket.id)])
            hideTicketsDetails();
        }).catch(reason => console.error(reason));
    }

    return (
        <div className="admin-tickets-page">
            <h1 className="admin-title">{t("ADMIN.TICKETS.TITLE")}</h1>
            <div className="admin">
                <div className="admin-tickets-list">
                    {tickets.map((ticket: TicketContent) => (
                        <div className="admin-ticket-elements">
                            <ButtonsJavaEdition taille="28" title={ticket.title} onClick={() => showTicketDetails(ticket)}/>
                        </div>
                    ))}
                </div>
                <div ref={ticketDetailsContainerRef} className="admin-ticket-display" hidden>
                    <div className="admin-ticket-detail">
                        <label htmlFor="ticket-email">{t("ADMIN.TICKETS.EMAIL") + ':'}</label>
                        <p id="ticket-email">{selectedEmail}</p>
                    </div>
                    <div className="admin-ticket-detail">
                        <label htmlFor="ticket-status">{t("ADMIN.TICKETS.STATUS") + ':'}</label>
                        <p id="ticket-status">{selectedStatus}</p>
                    </div>
                    <div className="admin-ticket-detail">
                        <label htmlFor="ticket-title">{t("ADMIN.TICKETS.SUBJECT") + ':'}</label>
                        <p id="ticket-title">{selectedSubject}</p>
                    </div>
                    <div className="admin-ticket-body">
                        <label htmlFor="ticket-body">{t("ADMIN.TICKETS.BODY") + ':'}</label>
                        <textarea
                            id="ticket-body"
                            cols={200}
                            rows={8}
                            className="minecraft-input new-ticket-description"
                            readOnly={true}
                            value={selectedBody}
                        />
                    </div>
                    <div className="admin-tickets-buttons">
                        <ButtonsJavaEdition taille="20" title={t("ADMIN.TICKETS.CHANGE_STATUS")}/>
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