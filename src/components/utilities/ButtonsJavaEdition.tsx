import React from "react";
import {useNavigate} from "react-router-dom";
import "../../styles/ButtonsJavaEdition.css";
import {useTranslation} from "react-i18next";

interface McButtonsProps {
	taille: string;
	title: string;
	path?: string;
	onClick?: () => void;
	disabled?: boolean;
}

const ButtonsJavaEdition: React.FC<McButtonsProps> = ({taille, title, path, onClick, disabled}) => {
	const {t} = useTranslation();
	const navigate = useNavigate();

	/**
	 * Function to navigate back to the previous page.
	 * Uses the navigate function from react-router-dom.
	 */
	const goBack = () => {
		navigate(-1);
	};

	/**
	 * Handles the click event for the button.
	 * If onClick is provided, it calls that function.
	 * If path is "goback", it navigates back.
	 * If a path is provided, it navigates to that path.
	 */
	const handleClick = () => {
		if (onClick) {
			onClick();
		} else if (path === "goback") {
			goBack();
		} else if (path) {
			navigate(path);
		}
	};

	/**
	 * Determines the class and style for the button based on the props.
	 */
	const buttonClass = `mc-button full ${disabled ? "disabled" : ""}`;

	/**
	 * Sets the style for the button based on the taille prop.
	 */
	/** TODO: translate "taille" */
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