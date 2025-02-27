import {useTranslation} from "react-i18next";
import ButtonsJavaEdition from "../../utilities/ButtonsJavaEdition";
import React from "react";

type TicketContent = {
    title: string,
    email: string,
    status: string
};

const TicketInput = (ticket: TicketContent, index: number) => {
    const {t} = useTranslation();

    function showOrHideSubMenu()
    {
        
    }

    return (
        <>
            <input className="minecraft-input listed-ticket-input" id={`input${index}`} type="text" value={ticket.title} disabled/>
            <ButtonsJavaEdition taille="square" title="v" onClick={() => showOrHideSubMenu()}/>
        </>
    );
};

export default TicketInput;