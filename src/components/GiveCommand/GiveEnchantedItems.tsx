import React, {useEffect, useState} from "react";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import GiveEnchanteditems_Enchantments from "./assets/GiveEnchanteditems_Enchantments";
import Notification from "../utilities/Notification";
import "../../styles/GiveEnchantedItems.css";
import "../../styles/InputJavaEdition.css";
import {useTranslation} from "react-i18next";
import {generateEnchantmentCommand} from "./Generator";
import Item from "../../interfaces/Item";

interface GiveEnchantedItemsProps {
	version: number;
	language: string;
}

const GiveEnchantedItems: React.FC<GiveEnchantedItemsProps> = ({version, language}) => {
	const [item, setItem] = useState("null");
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [enchantmentValues, setEnchantmentValues] = useState<number[]>([]);
	const [username, setUsername] = useState("");
	const [material, setMaterial] = useState("");
	const [enchantementRenderedSwitch, setEnchantementRenderedSwitch] = useState<JSX.Element | null>(null);
	const [commandResult, setCommandResult] = useState("");
	const [data, setData] = useState<Item[]>([]);
	const [isMaterialDisabled, setIsMaterialDisabled] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState<{ text: string, type: string } | null>(null);
	const [showDefaultOption, setShowDefaultOption] = useState(true);
	const [isCopyDisabled, setIsCopyDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const {t} = useTranslation();

	// Fetch the item data from the back-end when the component mounts.
	useEffect(() => {
		setIsLoading(true); // Set loading to true before fetching data
		fetch(`${process.env.REACT_APP_HOST_BACK}/getItem`)
			.then(response => response.json())
			.then((data: Item[]) => {
				console.log(data); // Log the response data
				setData(data);
				setIsLoading(false); // Set loading to false after data is received
			});
	}, []);

	// Reset the selected item, enchantment values, username, material, and enchantmentRenderedSwitch if the selected
	// item is "null".
	useEffect(() => {
		if (item === "null") {
			setSelectedItem(null);
			setEnchantmentValues([]);
			setUsername("");
			setMaterial("null");
			setEnchantementRenderedSwitch(null);
			setIsMaterialDisabled(false);
		}
	}, [item]);

	// Reset the selected item, enchantment values, and material if the selected item is not found in the data or if
	// the version is lower than the selected item's version.
	useEffect(() => {
		const selectedItem = data.find(dataItem => dataItem.identifier === item);
		const selectedMaterial = selectedItem && selectedItem.materiaux.find(dataMaterial => dataMaterial.identifier === material);
		if (!selectedItem || version < selectedItem.version) {
			setShowDefaultOption(true);
			setSelectedItem(null);
			setEnchantmentValues([]);
			setMaterial("null");
			setItem("null");
		} else if (!selectedMaterial && version < selectedItem.version) {
			setMaterial("null");
		}
	}, [version, data]);

	// Set the enchantmentRenderedSwitch when the selected item changes.
	useEffect(() => {
		if (selectedItem !== null) {
			setEnchantementRenderedSwitch(enchantmentRenderSwitch(item));
			if (selectedItem.materiaux.length === 1) {
				setMaterial("not needed");
				setIsMaterialDisabled(true);
			} else {
				setIsMaterialDisabled(false);
			}
		}
	}, [selectedItem, item, version]);

	// Generate the enchantment command when the item, selected item, enchantment values, username, material, version,
	// or language changes.
	useEffect(() => {
		renderEnchantment(item, selectedItem, enchantmentValues, username, material);
	}, [item, selectedItem, enchantmentValues, username, material, version, language]);

	// Generate the enchantment command based on the item, selected item, enchantment values, username, material, and
	// isMaterialDisabled.
	const renderEnchantment = (
		item: string,
		selectedItem: any,
		enchantmentValues: number[],
		username: string,
		material: string
	): void => {
		const enchantementCommand = generateEnchantmentCommand(
			item,
			selectedItem,
			enchantmentValues,
			username,
			material,
			isMaterialDisabled
		);

		switch (true) {
			case material === "null" && item === "null":
				setCommandResult(`${t("GIVE_ENCHANTED_ITEMS.ERROR_CODE.MATERIAL_AND_ITEM")}`);
				setIsCopyDisabled(true);
				break;
			case material === "null":
				setCommandResult(`${t("GIVE_ENCHANTED_ITEMS.ERROR_CODE.MATERIAL")}`);
				setIsCopyDisabled(true);
				break;
			case item === "null":
				setCommandResult(`${t("GIVE_ENCHANTED_ITEMS.ERROR_CODE.ITEM")}`);
				setIsCopyDisabled(true);
				break;
			default:
				if (enchantementCommand === "error") {
					setCommandResult(`${t("GIVE_ENCHANTED_ITEMS.ERROR_CODE.VERSION_NOT_SUPPORTED")}`);
					setIsCopyDisabled(true);
					break;
				} else {
					setCommandResult(enchantementCommand);
					setIsCopyDisabled(false);
					break;
				}
		}
	};

	// Handle the item change event.
	const handleSelectItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setItem(event.target.value);
		setIsMaterialDisabled(false); // Reset isMaterialDisabled when item changes
		const selectedItem = data.find(item => item.identifier === event.target.value);
		if (selectedItem) {
			setSelectedItem(selectedItem);
			setEnchantmentValues(new Array(selectedItem.enchantement.length).fill(0));
			setMaterial("null");
		} else {
			setSelectedItem(null);
			setEnchantmentValues([]);
			setMaterial("null");
		}
		setShowDefaultOption(false);
	};

	// Handle the username change event.
	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const regex = /^[a-zA-Z0-9_]*$/;
		if (regex.test(value) && value.length <= 16) {
			setUsername(value);
		}
	};

	// Handle the material change event.
	const handleMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		if (!isMaterialDisabled) {
			setMaterial(event.target.value);
		}
	};

	// Handle the enchantment values change event.
	const handleEnchantmentValuesChange = (newValues: number[]) => {
		setEnchantmentValues(newValues);
	};

	// Render the enchantment values based on the item identifier.
	const enchantmentRenderSwitch = (itemId: string) => {
		const itemData = data.find(item => item.identifier === itemId);
		if (!itemData || !itemData.enchantement) {
			return null;
		}
		return (
			<GiveEnchanteditems_Enchantments
				key={version} // pour forcer le reload a chaque changement de version
				enchantments={itemData.enchantement}
				onValuesChange={handleEnchantmentValuesChange}
				resetValues={true}
			/>
		);
	};

	/**
	 * 	Copy the command to the clipboard and send a request to the server.
	 * 	if the command is empty, display a notification message.
	 */
	const copyToClipboard = () => {
		if (isCopyDisabled) {
			setNotificationMessage({text: "impossible de copier une commande vide", type: "info"});
			setTimeout(() => setNotificationMessage(null), 3000);
		} else {
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
			setTimeout(() => setNotificationMessage(null), 3000);;
		}
	};

	return (
		<div className="give-enchanted-items">
			<div className="back-button-container">
				<ButtonsJavaEdition taille="20" title="GLOBAL.BACK" path="goback"/>
			</div>
			<div className="main-container">
				<div className="input-block">
					<label htmlFor="item" className="text-minecraft">{t("GIVE_ENCHANTED_ITEMS.ITEM")}</label>
					<select className="minecraft-input fixed-width" name="item" id="item"
							value={item} onChange={handleSelectItemChange} disabled={isLoading}>
						{isLoading ? (
							<option value="loading">{t("GLOBAL.LOADING")}</option>
						) : (
							<>
								{showDefaultOption &&
                                    <option value="null">{t("GIVE_ENCHANTED_ITEMS.SELECT_ITEM")}</option>}
								{data && data.filter(item => version && version >= item.version).map((item, index) => (
									<option key={index} value={item.identifier}>{t(`MINECRAFT.ITEMS.${item.identifier.toUpperCase()}`)}</option>
								))}
							</>
						)}
					</select>
				</div>

				<div className="input-block">
					<label htmlFor="material" className="text-minecraft">{t("GIVE_ENCHANTED_ITEMS.MATERIAL")}</label>
					<select name="material" id="material" className="minecraft-input fixed-width"
							value={material} onChange={handleMaterialChange} disabled={isMaterialDisabled}>
						<option value="null">{t(`GIVE_ENCHANTED_ITEMS.${isMaterialDisabled ? "NOT_NEEDED" : "SELECT_MATERIAL"}`)}</option>
						{selectedItem && selectedItem.materiaux && selectedItem.materiaux
							.filter((material: any) => version && version >= material.version)
							.map((material: any, index: number) => (
								<option key={index} value={material.identifier}>
									{t(`MINECRAFT.MATERIALS.${material.identifier.toUpperCase()}`)}
								</option>
							))}
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

			<div className="bar-container">
				<div className="enchantment-container">
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

export default GiveEnchantedItems;