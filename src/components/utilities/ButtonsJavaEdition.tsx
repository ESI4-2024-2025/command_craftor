import React from "react";
import {useNavigate} from "react-router-dom";
import "../../styles/ButtonsJavaEdition.css";
import { useTranslation } from "react-i18next";

interface McButtonsProps {
	taille: string;
	title: string;
	path?: string;
	onClick?: () => void;
	disabled?: boolean;
}

const ButtonsJavaEdition: React.FC<McButtonsProps> = ({taille, title, path, onClick, disabled}) => {
	const { t } = useTranslation();

	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};

	const handleClick = () => {
		if (onClick) {
			onClick();
		} else if (path === "goback") {
			goBack();
		} else if (path) {
			navigate(path);
		}
	};

	const buttonClass = `mc-button full ${disabled ? "disabled" : ""}`;
	const buttonStyle = taille === "square"
		? {aspectRatio: "1/1", height: "5vh", width: "5vh", margin: "-0.7rem 1vw 0 1vw"}
		: {width: `${taille}vw`};

	return (
		<div className="McButtons" onClick={handleClick} style={buttonStyle}>
			<div className={buttonClass}>
				<div className="title">{t(title)}</div>
			</div>
		</div>
	);
};

export default ButtonsJavaEdition;