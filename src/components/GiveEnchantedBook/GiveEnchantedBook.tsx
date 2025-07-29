import React, {useEffect, useState} from "react";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import GiveEnchantedBook_Enchantments from "./GiveEnchantedBook_Enchantments";
import Notification from "../utilities/Notification";
import "../../styles/GiveEnchantedItems.css";
import "../../styles/InputJavaEdition.css";
import {useTranslation} from "react-i18next";
import {generateEnchantmentCommand} from "./Generator";
import Item from "../../interfaces/Item";
import VersionSelector from "../VersionSelector/VersionSelector";
import EnumItemType from "../../Enum/EnumItemType";
import Enchantment from "../../interfaces/Enchantment";

interface GiveEnchantedBookProps {
	language: string;
}

const GiveEnchantedBook: React.FC<GiveEnchantedBookProps> = ({language}) => {
	const [versionString, setVersion] = useState("");
	const [item, setItem] = useState("null");
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);
	const [enchantmentValues, setEnchantmentValues] = useState<number[]>([]);
	const [username, setUsername] = useState("");
	const [enchantementRenderedSwitch, setEnchantementRenderedSwitch] = useState<JSX.Element | null>(null);
	const [commandResult, setCommandResult] = useState("");
	const [data, setData] = useState<Item[]>([]);
	const [notificationMessage, setNotificationMessage] = useState<{ text: string, type: string } | null>(null);
	const [showDefaultOption, setShowDefaultOption] = useState(true);
	const [isCopyDisabled, setIsCopyDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const {t} = useTranslation();
	const version = Number(versionString);

	/**
	 * Fetch the items from the backend when the component mounts.
	 */
	useEffect(() => {
		setIsLoading(true);
		fetch(`${process.env.REACT_APP_HOST_BACK}/getItem?type=${EnumItemType.BOOK}`)
			.then(response => response.json())
			.then((data: Item[]) => {
				console.log(data);
				setData(data);
				setIsLoading(false);
				setItem(data[0].identifier);
				setSelectedItem(data[0]);
				setEnchantementRenderedSwitch(enchantmentRenderSwitch(data[0].enchantement));
			});
	}, []);

	/**
	 * Check if the selected item and material are valid based on the current version.
	 */
	useEffect(() => {
		const selectedItem = data.find(dataItem => dataItem.identifier === item);
		if (!selectedItem || version < selectedItem.version) {
			setShowDefaultOption(true);
			setSelectedItem(null);
			setEnchantmentValues([]);
		}
	}, [version, data]);

	/**
	 * Render the enchantment command when the item, selected item, enchantment values, username, material, version, or
	 * language changes.
	 */
	useEffect(() => {
		renderEnchantment(item, selectedItem, enchantmentValues, username);
	}, [item, selectedItem, enchantmentValues, username, version, language]);

	/**
	 * generates a message if the item or material is not selected, or if the command is not supported by the current
	 * version.
	 */
	const renderEnchantment = (
		item: string,
		selectedItem: Item | null,
		enchantmentValues: number[],
		username: string
	): void => {
		const enchantementCommand = generateEnchantmentCommand(
			item,
			selectedItem,
			enchantmentValues,
			username
		);

		switch (true) {
			default:
				if (enchantementCommand === "error") {
					setCommandResult(`${t("GIVE_ENCHANTED_TOOLS.ERROR_CODE.VERSION_NOT_SUPPORTED")}`);
					setIsCopyDisabled(true);
				} else {
					setCommandResult(enchantementCommand);
					setIsCopyDisabled(false);
				}
		}
	};

	/**
	 * Handle the change of the username input.
	 * The username can only contain letters, numbers, and underscores, and must be between 3 and 16 characters long.
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
	 * Handle the change of the enchantment values.
	 * This will update the state of enchantment values.
	 */
	const handleEnchantmentValuesChange = (newValues: number[]) => {
		setEnchantmentValues(newValues);
	};

	/**
	 * Render the enchantment component if there is an item selected and it has enchantments.
	 */
	const enchantmentRenderSwitch = (enchantements: Enchantment[]) => {
		return (
			<GiveEnchantedBook_Enchantments
				key={version}
				enchantments={enchantements}
				onValuesChange={handleEnchantmentValuesChange}
				resetValues={true}
			/>
		);
	};

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
			<h1 className="commands-title">{t("COMMANDS.GIVE_ENCHANTED_BOOK")}</h1>
			<div className="main-container">
				<div className="input-block">
					<label htmlFor="item" className="text-minecraft">{t("GIVE_ENCHANTED_TOOLS.ITEM")}</label>
					<select className="minecraft-input fixed-width" name="item" id="item"
							value={item} disabled={true}>
						{isLoading ? (
							<option value="loading">{t("GLOBAL.LOADING")}</option>
						) : (
							<>
								{showDefaultOption &&
                                    <option value="null">{t("GIVE_ENCHANTED_TOOLS.SELECT_ITEM")}</option>}
								{data && data.filter(item => version && version >= item.version).map((item, index) => (
									<option key={index} value={item.identifier}>{t(`MINECRAFT.ITEMS.${item.identifier.toUpperCase()}`)}</option>
								))}
							</>
						)}
					</select>
				</div>

				<div className="input-block">
					<label htmlFor="username" className="text-minecraft">{t("GIVE_ENCHANTED_TOOLS.USERNAME")}</label>
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

			<div className="bar-container">
				<div className="enchantment-container enchantment-container-custom">
					{enchantementRenderedSwitch}
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

export default GiveEnchantedBook;