import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import "../../styles/Account.css";
import {useTranslation} from "react-i18next";
import Notification from "../utilities/Notification"; // Assuming you have a Notification component

function Account() {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState({
		username: "",
		email: "",
	});
	const [isAdmin, setAdmin] = useState(false);
	type NotificationMessage = {
		text: string;
		type: string;
	};
	const [notificationMessage, setNotificationMessage] = useState<NotificationMessage | null>(null);
	const {t} = useTranslation();

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			navigate("/account/creationorconnexion");
		} else {
			axios.put(`${process.env.REACT_APP_HOST_BACK}/users/current`, {}, {
				headers: {
					"x-access-token": token
				}
			})
				.then(response => {
					const {username, email, email_verified, admin} = response.data;
					setUserInfo({username, email});
					setAdmin(admin);
					if (!email_verified) {
						setNotificationMessage({
							text: t("PROFIL.MAIL_UNVERIFIED"),
							type: "info"
						});
					}
				})
				.catch(() => {
					navigate("/account/creationorconnexion");
				});
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		window.location.reload();
	};

	return (
		<div className="accounts-page">
			<h1 className="accounts-title">{t("PROFIL.TITLE")}</h1>
			<div className="account">
				<div className="account-information text-minecraft">
					<p>{t("PROFIL.USERNAME")} : {userInfo.username}</p>
					<p>{t("PROFIL.MAIL")} : {userInfo.email}</p>
					{ isAdmin ? (<ButtonsJavaEdition taille="20" title="PROFIL.ADMIN" path="/admin"/>) : null }
				</div>
			</div>
			<div className="account-buttons">
				<ButtonsJavaEdition taille="19" title="GLOBAL.BACK" path="/"/>
				<ButtonsJavaEdition taille="19" title="PROFIL.DECONECT" onClick={handleLogout}/>
			</div>
			{notificationMessage && <Notification message={notificationMessage.text} type={notificationMessage.type}/>}
		</div>
	);
}

export default Account;