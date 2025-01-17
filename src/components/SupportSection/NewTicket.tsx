import "../../styles/Support.css"
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import Notification from "../utilities/Notification";

const NewTicket = () => {
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const {t} = useTranslation();
    type NotificationMessage = {
        text: string;
        type: string;
    };
    const [notificationMessage, setNotificationMessage] = useState<NotificationMessage | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_HOST_BACK}/tickets`, {
                titre: title,
                corps: body,
                email: email
            });
            setNotificationMessage({
                text: t("SUPPORT.TICKET_SENT"),
                type: "info"
            });
        } catch {
            setNotificationMessage(null);
            setTimeout(() => {
                setNotificationMessage({
                    text: t("SUPPORT.TICKET_CREATION_ERROR"),
                    type: "info"
                });
            }, 0);
        }
    };

    return (
        <div className="new-ticket-page">
            <h1 className="accounts-title">{t("SUPPORT.TITLE")}</h1>
            <div className="new-ticket">
                <div className="new-ticket-informations text-minecraft">
                    <form onSubmit={handleSubmit}>
                        <div className="new-ticket-input-block">
                            <div className="new-ticket-input-wrapper">
                                <label htmlFor="email"
                                       className="new-ticket-label">{t("SUPPORT.EMAIL")}</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="minecraft-input new-ticket-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="new-ticket-input-block">
                            <div className="new-ticket-input-wrapper">
                                <label htmlFor="title"
                                       className="new-ticket-label">{t("SUPPORT.NEW_TICKET_TITLE")}</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="minecraft-input new-ticket-input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="new-ticket-input-block">
                            <div className="new-ticket-input-wrapper">
                                <label htmlFor="body"
                                       className="new-ticket-label">{t("SUPPORT.NEW_TICKET_BODY")}</label>
                                <textarea
                                    id="body"
                                    cols={40}
                                    rows={5}
                                    className="minecraft-input new-ticket-description"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="new-ticket-submit-button"
                             onClick={() => document.querySelector("form")?.dispatchEvent(new Event("submit", {
                                 cancelable: true,
                                 bubbles: true
                             }))}>
                            <ButtonsJavaEdition taille="20" title="SUPPORT.NEW_TICKET_SEND"/>
                        </div>
                    </form>
                </div>
            </div>
            <div className="new-ticket-buttons">
            <ButtonsJavaEdition taille="19" title="GLOBAL.BACK" path="/"/>
            </div>
            {notificationMessage && <Notification message={notificationMessage.text} type={notificationMessage.type}/>}
        </div>
    );
};

export default NewTicket;