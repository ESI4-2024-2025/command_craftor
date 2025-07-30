import React, {useEffect, useState} from "react";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import Notification from "../utilities/Notification";
import "../../styles/GiveFood.css";
import "../../styles/InputJavaEdition.css";
import {useTranslation} from "react-i18next";
import Item from "../../interfaces/Item";
import VersionSelector from "../VersionSelector/VersionSelector";
import EnumItemType from "../../Enum/EnumItemType";
import {generateGiveFoodCommand} from "./Generator";

interface GiveFoodProps {
	language: string;
}

const GiveFood: React.FC<GiveFoodProps> = ({language}) => {
	const [versionString, setVersion] = useState("");
	const [item, setItem] = useState("null");
	const [amount, setAmount] = useState(1);
	const [username, setUsername] = useState("");
	const [commandResult, setCommandResult] = useState("");
	const [data, setData] = useState<Item[]>([]);
	const [notificationMessage, setNotificationMessage] = useState<{ text: string, type: string } | null>(null);
	const [showDefaultOption, setShowDefaultOption] = useState(true);
	const isCopyDisabled = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const {t} = useTranslation();
	const version = Number(versionString);

	/**
	 * Fetch the items from the backend when the component mounts.
	 */
	useEffect(() => {
		setIsLoading(true);
		fetch(`${process.env.REACT_APP_HOST_BACK}/getItem?type=${EnumItemType.FOOD}`)
			.then(response => response.json())
			.then((items: Item[]) => {
				setData(items);
				items.forEach((item) => {
					console.log(item.identifier.toUpperCase());
				})
				setIsLoading(false);
			});
	}, []);

	/**
	 * Check if the selected item and material are valid based on the current version.
	 */
	useEffect(() => {
		const selectedItem = data.find(dataItem => dataItem.identifier === item);
		if (!selectedItem || version < selectedItem.version) {
			setShowDefaultOption(true);
			setItem("null");
		}
	}, [version, data]);

	/**
	 * Generate the command result whenever the item, username, amount, or language changes.
	 */
	useEffect(() => {
		if (item != "null") {
			setCommandResult(generateGiveFoodCommand(item, username, amount));
		} else {
			setCommandResult(t("GIVE_FOOD.NO_ITEM_SELECTED"));
		}
	}, [item, username, amount, language]);

	/**
	 * Handle the change of the selected item from the dropdown.
	 */
	const handleSelectItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setItem(event.target.value);
		setShowDefaultOption(false);
	};

	/**
	 * Handle the change of the username input.
	 * The username can only contain letters, numbers, underscores and must be between 3 and 16 characters long.
	 * (Minecraft username rules)
	 */
	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const regex = /^[a-zA-Z0-9_]*$/;
		if (regex.test(value) && value.length <= 16) {
			setUsername(value);
		}
	};

	/**
	 * Handle the change of the amount input.
	 */
	const handleAmountChange = (amount: number) => {
		setAmount(amount);
	};

	/**
	 * Handle the click on the "Full Inventory" button.
	 */
	const handleFullInventory = () => {
		setAmount(2304);
	}


	/**
	 * Copy the command result to the clipboard and send it to the backend.
	 * If the command is empty or if the material is not selected, it will show a notification.
	 */
	const copyToClipboard = () => {
		if (isCopyDisabled) {
			setNotificationMessage({text: "impossible de copier une commande vide", type: "info"});
			setTimeout(() => setNotificationMessage(null), 3000);
		} else {
			navigator.clipboard.writeText(commandResult)
				.then(() => {
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
		}
	};

	return (
		<div className="give-enchanted-items">
			<div className="back-button-container">
				<ButtonsJavaEdition size="20" title="GLOBAL.BACK" path="goback"/>
				<VersionSelector setVersion={setVersion}/>
			</div>
			<h1 className="commands-title">{t("COMMANDS.GIVE_FOOD")}</h1>
			<div className="main-container">
				<div className="input-block">
					<label htmlFor="item" className="text-minecraft">{t("GIVE_FOOD.FOOD")}</label>
					<select className="minecraft-input fixed-width" name="item" id="item"
							value={item} onChange={handleSelectItemChange} disabled={isLoading}>
						{isLoading ? (
							<option value="loading">{t("GLOBAL.LOADING")}</option>
						) : (
							<>
								{showDefaultOption &&
                                    <option value="null">{t("GIVE_FOOD.SELECT_FOOD")}</option>}
								{data && data.filter(item => version && version >= item.version).map((item, index) => (
									<option key={index} value={item.identifier}>{t(`MINECRAFT.ITEMS.${item.identifier.toUpperCase()}`)}</option>
								))}
							</>
						)}
					</select>
				</div>

				<div className="input-block" style={{ display: 'flex', alignItems: 'center' }}>
					<label htmlFor="amount" className="text-minecraft" style={{ marginRight: '8px' }}>{t("GIVE_FOOD.AMOUNT")}</label>
					<div className="amount-container">
						<input
							type="number"
							id="amount"
							className="minecraft-input amount-input"
							value={amount}
							onChange={e => handleAmountChange(Number(e.target.value))}
							min={1}
							max={2304}
							style={{ marginRight: '8px' }}
						/>
						<ButtonsJavaEdition size="15" title={t("GIVE_FOOD.FULL_INVENTORY")} onClick={handleFullInventory}></ButtonsJavaEdition>
					</div>
				</div>

				<div className="input-block">
					<label htmlFor="username" className="text-minecraft">{t("GIVE_FOOD.USERNAME")}</label>
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

			<textarea className="command-renderer text-minecraft"
					  value={commandResult}
					  onClick={copyToClipboard}
					  readOnly/>

			{notificationMessage && <Notification message={notificationMessage.text} type={notificationMessage.type}/>}
		</div>
	);
};

export default GiveFood;