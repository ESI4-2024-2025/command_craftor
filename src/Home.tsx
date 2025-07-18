import React, {useEffect} from "react";
import ButtonsJavaEdition from "./components/utilities/ButtonsJavaEdition";
import "./styles/Home.css";
import "./styles/Support.css";
import logo from "./img/Logo.png";

function Home() {

	/**
	 * Returns a random background class from a predefined list.
	 *
	 * @returns {string}
	 */
	function getRandomBackgroundClass(): string {
		const classes = ["html-bg-1", "html-bg-2", "html-bg-3", "html-bg-4", "html-bg-5", "html-bg-6", "html-bg-7", "html-bg-8", "html-bg-9", "html-bg-10", "html-bg-11"];
		const randomIndex = Math.floor(Math.random() * classes.length);
		return classes[randomIndex];
	}

	/**
	 * Adds a random background class to the document element when the component mounts,
	 */
	useEffect(() => {
		const randomClass = getRandomBackgroundClass();
		document.documentElement.classList.add("home-page", randomClass);

		return () => {
			document.documentElement.classList.remove("home-page", randomClass);
		};
	}, []);

	return (
		<>
			<div className="home" data-testid="Home">
				<div className="home-logo">
					<img src={logo} alt="Logo"/>
				</div>
				<div className="home-buttons">
					<div>
						<ButtonsJavaEdition title="HOME.COMMANDES" size="38" path="commands"/>
					</div>
					<div className="home-buttons-dual">
						<ButtonsJavaEdition title="HOME.PROFIL" size="19" path="account"/>
						<ButtonsJavaEdition title="HOME.CHANGELOG" size="19" path="changelog"/>
					</div>
				</div>
			</div>
			<div className="new-ticket-button">
				<ButtonsJavaEdition size="20" title="SUPPORT.TICKET_BUTTON" path="/new-ticket"/>
			</div>
		</>
	);
}

export default Home;