import React from "react";
import ButtonsJavaEdition from "./utilities/ButtonsJavaEdition";
import "../styles/Commands.css";
import {useTranslation} from "react-i18next";

function Commands() {
	const {t} = useTranslation();

	return (
		<div className="commands-page">
			<h1 className="commands-title">{t("COMMANDS.TITLE")}</h1>
			<div className="commands">
				<div className="commands-buttons">
					<ButtonsJavaEdition title="COMMANDS.GIVE_ENCHANTED_TOOLS" size="35" path="GiveEnchantedTools"/>
					<ButtonsJavaEdition title="COMMANDS.GIVE_ENCHANTED_ARMORS" size="35" path="GiveEnchantedArmors"/>
					<ButtonsJavaEdition title="COMMANDS.GIVE_ENCHANTED_BOOK" size="35" path="GiveEnchantedBook"/>
					<ButtonsJavaEdition title="COMMANDS.GIVE_POTIONS" size="35" path="givepotion"/>
					<ButtonsJavaEdition title="COMMANDS.GIVE_FOOD" size="35" path="GiveFood"/>
				</div>
			</div>
			<div className="back-button">
				<ButtonsJavaEdition size="20" title="GLOBAL.BACK" path="goback"/>
			</div>
		</div>
	);
}

export default Commands;