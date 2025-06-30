import React from "react";
import ButtonsJavaEdition from "./utilities/ButtonsJavaEdition";
import "../styles/Commands.css";
import {useTranslation} from "react-i18next";

function Commands() {
	const { t } = useTranslation();

	return (
		<div className="commands-page">
			<h1 className="commands-title">{t("COMMANDS.TITLE")}</h1>
			<div className="commands">
				<div className="commands-buttons">
					<ButtonsJavaEdition title="COMMANDS.GIVE_ENCHANTED_ITEMS" taille="35" path="giveenchanteditems"/>
					<ButtonsJavaEdition title="COMMANDS.GIVE_POTIONS" taille="35" path="givepotion"/>
				</div>
			</div>
			<div className="back-button">
				<ButtonsJavaEdition taille="20" title="GLOBAL.BACK" path="goback"/>
			</div>
		</div>
	);
}

export default Commands;