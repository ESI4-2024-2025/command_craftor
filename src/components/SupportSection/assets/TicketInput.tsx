//import {useTranslation} from "react-i18next";
import ButtonsJavaEdition from "../../utilities/ButtonsJavaEdition";
import React, {useEffect} from "react";

export type TicketContent = {
    id: string;
    title: string,
    email: string,
    status: string
};

type TicketElement = {
    ticket: TicketContent,
    index: number
}

const TicketInput = (ticketElement: TicketElement) => {
    //const {t} = useTranslation();

    useEffect(() => {
    }, []);

    function showOrHideSubMenu()
    {

    }

    return (
        <>
            <input className="minecraft-input listed-ticket-input" id={`input${ticketElement.index}`} type="text" value={ticketElement.ticket.title} disabled/>
            <ButtonsJavaEdition taille="square" title="v" onClick={() => showOrHideSubMenu()}/>
        </>
    );
};

export default TicketInput;