import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../styles/Creation.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import Notification from "../utilities/Notification";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

function Creation() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [notificationMessage, setNotificationMessage] = useState<string | undefined>(undefined);
	const [notificationType, setNotificationType] = useState<string | undefined>(undefined);
	const navigate = useNavigate();
	const {t} = useTranslation();

	/**
	 * Handles the form submission for user account creation.
	 *
	 * @param event The form submission event.
	 */
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await axios.post(`${process.env.REACT_APP_HOST_BACK}/users/register`, {
				username,
				email,
				password
			});
			localStorage.setItem("accessToken", response.data.accessToken);
			navigate("/account");
		} catch {
			setNotificationMessage(undefined);
			setNotificationType(undefined);
			setTimeout(() => {
				setNotificationMessage("Erreur de creation de compte. Veuillez verifier vos informations.");
				setNotificationType("error");
			}, 0);
		}
	};

	/**
	 * Handles the "Enter" key press to submit the form.
	 * This allows users to submit the form using the keyboard.
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
		<div className="creation">
			<form onSubmit={handleSubmit}>
				<div className="creation-input-block">
					<div className="creation-input-wrapper">
						<label htmlFor="username" className="creation-label">{t("CONNEXION_CREATION.USERNAME")}</label>
						<input
							type="text"
							id="username"
							className="minecraft-input fixed-size creation-input"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
				</div>
				<div className="creation-input-block">
					<div className="creation-input-wrapper">
						<label htmlFor="email" className="creation-label">{t("CONNEXION_CREATION.MAIL")}</label>
						<input
							type="email"
							id="email"
							className="minecraft-input fixed-size creation-input"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
				</div>
				<div className="creation-input-block">
					<div className="creation-input-wrapper">
						<label htmlFor="password" className="creation-label">{t("CONNEXION_CREATION.PASSWORD")}</label>
						<input
							type="password"
							id="password"
							className="minecraft-input fixed-size creation-input"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>
				<div className="creation-button"
					 onClick={() => document.querySelector("form")?.dispatchEvent(new Event("submit", {
						 cancelable: true,
						 bubbles: true
					 }))}>
					<ButtonsJavaEdition size="20" title="CONNEXION_CREATION.CREATION"/>
				</div>
			</form>
			{notificationMessage && <Notification message={notificationMessage} type={notificationType}/>}
		</div>
	);
}

export default Creation;