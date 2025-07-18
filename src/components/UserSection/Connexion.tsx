import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../styles/InputJavaEdition.css";
import "../../styles/Connexion.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import Notification from "../utilities/Notification";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

function Connexion() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [notificationMessage, setNotificationMessage] = useState<string | undefined>(undefined);
	const [notificationType, setNotificationType] = useState<string | undefined>(undefined);
	const navigate = useNavigate();
	const {t} = useTranslation();

	/**
	 * Handles the form submission for user login.
	 *
	 * @param event The form submission event.
	 */
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await axios.post(`${process.env.REACT_APP_HOST_BACK}/users/login`, {email, password});
			localStorage.setItem("accessToken", response.data.accessToken);
			navigate("/account");
		} catch {
			setNotificationMessage(undefined);
			setNotificationType(undefined);
			setTimeout(() => {
				setNotificationMessage(t("CONNEXION_CREATION.CONNEXION_ERROR"));
				setNotificationType("error");
			}, 0);
		}
	};

	/**
	 * Handles the click event on the div to submit the form.
	 * This is used to allow clicking on the button styled as a div.
	 */
	const handleDivClick = () => {
		const form = document.querySelector("form");
		if (form) {
			form.dispatchEvent(new Event("submit", {cancelable: true, bubbles: true}));
		}
	};

	/**
	 * Adds an event listener for the Enter key to submit the form.
	 * This allows users to press Enter to submit the form instead of clicking the button.
	 */
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Enter") {
				const form = document.querySelector("form");
				if (form) {
					form.dispatchEvent(new Event("submit", {cancelable: true, bubbles: true}));
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="connexion">
			<form onSubmit={handleSubmit}>
				<div className="connexion-input-block">
					<div className="connexion-input-wrapper">
						<label htmlFor="email" className="connexion-label">{t("CONNEXION_CREATION.MAIL")}</label>
						<input
							type="email"
							id="email"
							className="minecraft-input fixed-size connexion-input"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
				</div>
				<div className="connexion-input-block">
					<div className="connexion-input-wrapper">
						<label htmlFor="password" className="connexion-label">{t("CONNEXION_CREATION.PASSWORD")}</label>
						<input
							type="password"
							id="password"
							className="minecraft-input fixed-size connexion-input"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>
				<div className="connexion-button" onClick={handleDivClick}>
					<ButtonsJavaEdition size="20" title="CONNEXION_CREATION.CONNEXION"/>
				</div>
			</form>
			{notificationMessage && <Notification message={notificationMessage} type={notificationType}/>}
		</div>
	);
}

export default Connexion;