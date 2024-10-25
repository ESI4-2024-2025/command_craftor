import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import React, {useEffect, useState} from "react";
import Item from "../../interfaces/Item";
import {useTranslation} from "react-i18next";
import "../../styles/PotionCommand.css"
import PotionCommand_effect from "./PotionCommand_effect";
import Potions from "../../interfaces/Potions";

interface PotionCommandProps {
	version: number;
	language: string;
}

const PotionCommand: React.FC<PotionCommandProps> = ({version, language}) => {
	const [data, setData] = useState<Potions[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [potionType, setPotionType] = useState("potion");
	const [username, setUsername] = useState("");
	const {t} = useTranslation();

	/**
	 * useEffect hook to fetch potion data from the backend service.
	 * Sets loading state before fetching and updates data state after receiving the response.
	 */
	useEffect(() => {
		setIsLoading(true); // Set loading to true before fetching data
		fetch(`${process.env.REACT_APP_HOST_BACK}/getPotion`)
			.then(response => response.json())
			.then((data: Potions[]) => {
				console.log(data); // Log the response data
				setData(data);
				setIsLoading(false); // Set loading to false after data is received
			});
	}, []);

	/**
	 * Handle the change of the potion type.
	 * Updates the potionType state with the selected value.
	 *
	 * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event from the select element.
	 */
	function handlePotionTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
		setPotionType(event.target.value);
	}

	/**
	 * Handle the change of the username input.
	 * Updates the username state with the input value.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input element.
	 */
	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const regex = /^[a-zA-Z0-9_]*$/;
		if (regex.test(value) && value.length <= 16) {
			setUsername(value);
		}
	};

	return (
		<div className="potion-command">
			<div className="back-button-container">
				<ButtonsJavaEdition taille="20" title="GLOBAL.BACK" path="goback"/>
			</div>
			<div className="potion-command-main-container">
				<div className="input-block">
					<label htmlFor="four-option-select" className="text-minecraft">{t("POTION_COMMAND.TYPE")}</label>
					<select className="minecraft-input fixed-width"
							id="four-option-select" value={potionType} onChange={handlePotionTypeChange}>
						<option value="potion">{t("MINECRAFT.POTIONS.TYPES.POTION")}</option>
						<option value="splash_potion">{t("MINECRAFT.POTIONS.TYPES.SPLASH_POTION")}</option>
						<option value="lingering_potion">{t("MINECRAFT.POTIONS.TYPES.LINGERING_POTION")}</option>
						<option value="tipped_arrow">{t("MINECRAFT.POTIONS.TYPES.TIPPED_ARROW")}</option>
					</select>
				</div>

				<div className="input-block">
					<label htmlFor="username" className="text-minecraft">{t("GIVE_ENCHANTED_ITEMS.USERNAME")}</label>
					<input
						type="text"
						id="username"
						className="minecraft-input fixed-width"
						value={username}
						onChange={handleUsernameChange}
						maxLength={16}
						pattern="[a-zA-Z0-9_]*"
						title="Username can contain up to 16 characters, including letters, numbers, and underscores."
					/>
				</div>
			</div>

			<PotionCommand_effect data={data} version={version}/>

		</div>
	);
};

export default PotionCommand;