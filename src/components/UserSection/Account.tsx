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
					const {username, email, email_verified} = response.data;
					setUserInfo({username, email});
					if (!email_verified) {
						setNotificationMessage({
							text: t("PROFILE.MAIL_UNVERIFIED"),
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
			<h1 className="accounts-title">{t("PROFILE.TITLE")}</h1>
			<div className="account" data-testid="Home">
				<div className="account-information text-minecraft">
					<p>{t("PROFILE.USERNAME")} : {userInfo.username}</p>
					<p>{t("PROFILE.MAIL")} : {userInfo.email}</p>
				</div>
				<ButtonsJavaEdition taille="25" title="PROFILE.MODIFY_MY_INFOS"
									path={`/account/infomodifications?username=${userInfo.username}&email=${userInfo.email}`}/>
			</div>
			<div className="account-buttons">
				<ButtonsJavaEdition taille="19" title="GLOBAL.BACK" path="/"/>
				<ButtonsJavaEdition taille="19" title="PROFILE.DECONECT" onClick={handleLogout}/>
			</div>
			{notificationMessage && <Notification message={notificationMessage.text} type={notificationMessage.type}/>}
		</div>
	);
}

export default Account;