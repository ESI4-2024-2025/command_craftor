import {useTranslation} from "react-i18next";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import "../../styles/InfoModification.css";
import axios from "axios";
import Notification from "../utilities/Notification";

interface InfoModificationProps {
	email: string;
	username: string;
}

function InfoModification() {
	const {t} = useTranslation();
	const location = useLocation();
	const [emailState, setEmail] = useState("");
	const [usernameState, setUsername] = useState("");
	const [newEmailState, setNewEmail] = useState("");
	const [newUsernameState, setNewUsername] = useState("");
	const [notificationMessage, setNotificationMessage] = useState<{ text: string, type: string } | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const email = params.get("email") || "";
		const username = params.get("username") || "";
		setEmail(email);
		setUsername(username);
	}, [location.search]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
	};

	const handleDivClick = () => {
		document.querySelector("form")?.dispatchEvent(new Event("submit", {
			cancelable: true,
			bubbles: true
		}));
	};

	const sendVerificationEmail = async () => {
		try {
			const response = await axios.post(`${process.env.REACT_APP_HOST_BACK}/users/email/PasswordReset`, {email: emailState});
			if (response.status === 200) {
				setNotificationMessage({
					text: t("PROFILE.MODIFICATION.EMAIL_SENT"),
					type: "success"
				});
			}
		} catch (error) {
			setNotificationMessage({
				text: t("PROFILE.MODIFICATION.EMAIL_ERROR"),
				type: "error"
			});
		}
	};

	const modifyInfos = async () => {
		try {
			const response = await axios.put(`${process.env.REACT_APP_HOST_BACK}/users/update`, {
				username: newUsernameState? newUsernameState : usernameState,
				email: newEmailState? newEmailState : emailState
			}, {
				headers: {
					"x-access-token": localStorage.getItem("accessToken")
				}
			});
			if (response.status === 200) {
				setNotificationMessage({
					text: t("PROFILE.MODIFICATION.SUCCESS"),
					type: "success"
				});
			}
		} catch (error) {
			setNotificationMessage({
				text: t("PROFILE.MODIFICATION.ERROR"),
				type: "error"
			});
		}
	}

	return (
		<div className="modification-page">
			<h1 className="modification-title">{t("PROFILE.MODIFICATION.TITLE")}</h1>
			<div className="modification-body">
				<form onSubmit={handleSubmit}>
					<div className="modification-input-block">
						<div className="modification-input-wrapper">
							<label htmlFor="username" className="modification-label">{t("GLOBAL.USERNAME")}</label>
							<input
								type="text"
								id="username"
								className="minecraft-input fixed-size modification-input"
								value={newUsernameState}
								placeholder={usernameState}
								onChange={(e) => setNewUsername(e.target.value)}
							/>
						</div>
					</div>
					<div className="modification-input-block">
						<div className="modification-input-wrapper">
							<label htmlFor="email" className="modification-label">{t("GLOBAL.MAIL")}</label>
							<input
								type="email"
								id="email"
								className="minecraft-input fixed-size modification-input"
								value={newEmailState}
								placeholder={emailState}
								onChange={(e) => setNewEmail(e.target.value)}
							/>
						</div>
					</div>
					<div className="modification-input-block">
						<div className="modification-input-wrapper">
							<label htmlFor="email" className="modification-label">{t("GLOBAL.PASSWORD")}</label>
							<ButtonsJavaEdition taille="17" title="PROFILE.MODIFICATION.SEND_EMAIL" onClick={sendVerificationEmail}/>
						</div>
					</div>
				</form>
			</div>
			<div className="modification-buttons">
				<ButtonsJavaEdition taille="19" title="GLOBAL.BACK" path="/account"/>
				<ButtonsJavaEdition taille="19" title="PROFILE.MODIFICATION.MODIFY" onClick={modifyInfos}/>
			</div>

			{notificationMessage && <Notification message={notificationMessage.text} type={notificationMessage.type}/>}
		</div>
	);
}

export default InfoModification;