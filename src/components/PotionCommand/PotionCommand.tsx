import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import "../../styles/PotionCommand.css";
import PotionCommand_effect from "./PotionCommand_effect";
import Potions from "../../interfaces/Potions";
import Notification from "../utilities/Notification";
import Effect from "../../interfaces/Effect";
import {generatePotionCommand} from "./Generator";

interface PotionCommandProps {
	version: number;
	language: string;
}

const PotionCommand: React.FC<PotionCommandProps> = ({version, language}) => {
	const [data, setData] = useState<Potions[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [potionType, setPotionType] = useState("potion");
	const [username, setUsername] = useState("");
	const [potionParams, setPotionParams] = useState<Effect[]>([]);
	const [commandResult, setCommandResult] = useState("");
	const [notificationMessage, setNotificationMessage] = useState<{ text: string, type: string } | null>(null);
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
	 * useEffect hook to generate the command result when the potion type, username or data changes.
	 * Generates a new command with the selected potion type, username and empty effects.
	 */
	useEffect(() => {
		const newCommand = generatePotionCommand(potionType, username, potionParams, version);
		setCommandResult(newCommand);
	}, [potionType, username, potionParams, data]);

	/**
	 * update the command result when the potion type or username
	 */
	useEffect(() => {
		handleValuesChange([]);
	}, [potionType, username]);

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

	/**
	 * Handle the change of the potion effects.
	 *
	 * @param newValues - The new values of the potion effects.
	 */
	const handleValuesChange = (newValues: Effect[]) => {
		setPotionParams(newValues);
	};

	/**
	 * 	Copy the command to the clipboard and send a request to the server.
	 * 	if the command is empty, display a notification message.
	 */
	const copyToClipboard = () => {
		navigator.clipboard.writeText(commandResult)
			.then(() => {
				// Make the request to the server
				fetch(`${process.env.REACT_APP_HOST_BACK}/ARequest`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						Command: commandResult,
						Version: version
					})
				});
			})
			.then(() => setNotificationMessage({
				text: "Copie dans le presse papier",
				type: "success"
			}))
			.catch(() => setNotificationMessage({
				text: "Erreur lors de la copie",
				type: "error"
			}));
		setTimeout(() => setNotificationMessage(null), 3000);
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
							id="four-option-select" value={potionType} onChange={handlePotionTypeChange}
							disabled={isLoading}>
						{isLoading ? (
							<option value="loading">{t("GLOBAL.LOADING")}</option>
						) : (
							<>
								<option value="potion">{t("MINECRAFT.POTIONS.TYPES.POTION")}</option>
								<option value="splash_potion">{t("MINECRAFT.POTIONS.TYPES.SPLASH_POTION")}</option>
								<option
									value="lingering_potion">{t("MINECRAFT.POTIONS.TYPES.LINGERING_POTION")}</option>
								<option value="tipped_arrow">{t("MINECRAFT.POTIONS.TYPES.TIPPED_ARROW")}</option>
							</>
						)}
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

			<div className="potion-bar-container">
				<div className="potion-header-row text-minecraft">
					<div className="potion-header1">{t("POTION_COMMAND.EFFECT")}</div>
					<div className="potion-header2">{t("POTION_COMMAND.DURATION")}</div>
					<div className="potion-header3">{t("POTION_COMMAND.AMPLIFIER")}</div>
					<div className="potion-header4">{t("POTION_COMMAND.PARTICLES")}</div>
					<div className="potion-header5">{t("POTION_COMMAND.ICON")}</div>
				</div>
				<div className="potion-effects-selector">
					<PotionCommand_effect data={data} version={version} loading={isLoading} onValuesChange={handleValuesChange}/>
				</div>
			</div>

			<textarea className="command-renderer text-minecraft"
					  value={commandResult}
					  onClick={copyToClipboard}
					  readOnly/>

			{notificationMessage &&
                <Notification message={notificationMessage.text} type={notificationMessage.type}/>}

		</div>
	);
};

export default PotionCommand;