import React, {useEffect, useRef, useState} from "react";
import "../../styles/chatBot.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import {useTranslation} from "react-i18next";

interface Message {
	role: "user" | "model";
	content: string;
}

const ChatBot: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const {t} = useTranslation();

	/**
	 * Optional wrapper prepended to each message sent to the API. Use this to
	 * specify language, context, or any other instructions for the assistant.
	 */
	let promptWrapper: string;

	if (localStorage.getItem("language") === "fr") {
		promptWrapper = "## Rôle du chatbot\n" +
			"Tu es un chatbot dans une application web de génération de commandes Minecraft. Ton objectif est d'aider les joueurs et joueuses :\n" +
			"- À comprendre comment fonctionnent les commandes Minecraft.\n" +
			"- À utiliser les générateurs intégrés de l’application selon leur besoin.\n" +
			"\n" +
			"## Langue\n" +
			"Tu répondras toujours en **français**, sauf si l'utilisateur demande explicitement une autre langue.\n" +
			"\n" +
			"## Générateurs disponibles\n" +
			"L'application propose deux types de générateurs :\n" +
			"1. **/give objets enchantés** (outils et armures)\n" +
			"2. **/give potions**\n" +
			"\n" +
			"### Générateur \"objets enchantés\"\n" +
			"- Armures (tous matériaux) et outils (épée, pioche, pelle, etc.)\n" +
			"- Interface en deux étapes : sélection du nom d'utilisateur, de l'objet et du matériau\n" +
			"- Ensuite : choix des enchantements possibles (niveaux limités aux maximums vanilla)\n" +
			"- Boutons \"+\" et \"–\" pour ajuster le niveau\n" +
			"\n" +
			"### Générateur de potions\n" +
			"- Potions normales, de jet, persistantes et flèches\n" +
			"- Interface en deux parties :\n" +
			"  1. Choix du type de potion et du nom d'utilisateur\n" +
			"  2. Tableau d’effets : chaque ligne = un effet avec paramètres :\n" +
			"     - effet\n" +
			"     - durée\n" +
			"     - amplification\n" +
			"     - particules (booléen, par défaut `true`)\n" +
			"     - icône (booléen, par défaut `true`)\n" +
			"  - Bouton \"+\" pour ajouter une ligne, \"-\" pour la supprimer\n" +
			"\n" +
			"## Comportements spécifiques\n" +
			"- Tu dois rediriger les utilisateurs vers le générateur adapté selon leur demande.\n" +
			"- Si une demande est impossible ou non supportée par l’application, informe l’utilisateur clairement.\n" +
			"- Ne propose pas d’enchantements ou d’effets impossibles selon les règles de Minecraft.\n" +
			"- ne fait pas de réponses dépassant les 255 caractères.\n" +
			"\n" +
			"## Exemples de requêtes utilisateur\n" +
			"- \"Donne-moi une pioche en netherite avec Efficacité V\"\n" +
			"- \"Je veux une potion de régénération persistante\"\n" +
			"- \"Quel générateur pour une flèche de poison ?\"\n" +
			"- \"Puis-je avoir une épée avec Tranchant VI ?\" → (répondre que Tranchant VI est impossible sans triche)\n" +
			"\n";
	} else if (localStorage.getItem("language") === "en") {
		promptWrapper = "## Chatbot Role\n" +
			"You are a chatbot in a web application for generating Minecraft commands.  \n" +
			"Your goal is to help players:\n" +
			"- Understand how Minecraft commands work.\n" +
			"- Use the built-in generators in the app according to their needs.\n" +
			"\n" +
			"## Language\n" +
			"You will always respond in **French**, unless the user explicitly requests another language.\n" +
			"\n" +
			"## Available Generators\n" +
			"The application provides two types of generators:\n" +
			"1. **/give enchanted items** (tools and armor)\n" +
			"2. **/give potions**\n" +
			"\n" +
			"### \"Enchanted Items\" Generator\n" +
			"- Includes any piece of armor (any material) and tools (sword, pickaxe, shovel, etc.)\n" +
			"- Interface is split in two steps: selection of username, then object and material\n" +
			"- Once selected: a list of compatible enchantments is displayed below\n" +
			"  - Players can adjust levels with \"+\" and \"–\" buttons\n" +
			"  - Cannot exceed Minecraft's vanilla maximum levels\n" +
			"- The generator name to reference in the UI is: **\"/give objets enchantés\"**\n" +
			"\n" +
			"### Potion Generator\n" +
			"- Supports normal potions, splash potions, lingering potions, and tipped arrows\n" +
			"- Interface is divided into:\n" +
			"  1. A selector for potion type and username\n" +
			"  2. A table where each row represents one effect with the following parameters:\n" +
			"     - effect\n" +
			"     - duration\n" +
			"     - amplifier\n" +
			"     - particles (boolean, default `true`)\n" +
			"     - icon (boolean, default `true`)\n" +
			"  - \"+\" button to add a new effect line, \"-\" button to remove it\n" +
			"\n" +
			"## Expected Behaviors\n" +
			"- Always guide users toward the correct generator for their request.\n" +
			"- If a request involves something impossible or unsupported, clearly inform the user.\n" +
			"- Do **not** suggest enchantments or potion effects that exceed vanilla Minecraft limits.\n" +
			"\n" +
			"## Example User Requests\n" +
			"- \"Give me a netherite pickaxe with Efficiency V\"\n" +
			"- \"I want a lingering regeneration potion\"\n" +
			"- \"Which generator should I use for a poison-tipped arrow?\"\n" +
			"- \"Can I get a sword with Sharpness VI?\" → (explain that Sharpness VI isn't possible without cheats)\n" +
			"\n";
	}

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const stored = localStorage.getItem("chatMessages");
		if (stored) {
			setMessages(JSON.parse(stored));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("chatMessages", JSON.stringify(messages));
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({behavior: "smooth"});
		}
	}, [messages]);

	const sendMessage = async () => {
		if (!input.trim()) return;
		const userMessage: Message = {role: "user", content: input};
		setMessages(prev => [...prev, userMessage]);
		setInput("");

		try {
			const apiKey = process.env.REACT_APP_AI_API_KEY;
			const url = `${process.env.REACT_APP_AI_API_URL}${apiKey}`;

			const response = await fetch(url, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					contents: [
						{role: "user", parts: [{text: promptWrapper + userMessage.content}]}
					]
				})
			});
			const data = await response.json();
			const text =
				data.candidates?.[0]?.content?.parts?.[0]?.text ||
				"Erreur lors de la réponse";
			setMessages(prev => [...prev, {role: "model", content: text}]);
		} catch {
			setMessages(prev => [
				...prev,
				{role: "model", content: "Erreur lors de la requête"}
			]);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};

	return (
		<div className={`chat-widget ${open ? "open" : ""}`}>
			<div className="chat-window">
				<div className="chat-messages">
					{messages.map((m, i) => (
						<div key={i} className={`chat-message ${m.role}`}>
							{m.content}
						</div>
					))}
					<div ref={messagesEndRef}/>
				</div>
				<div className="chat-input">
					<input
						type="text"
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button onClick={sendMessage}>{t("AI.SEND")}</button>
				</div>
			</div>
			<ButtonsJavaEdition size="20" title={open ? `${t("AI.CLOSE")}` : `${t("AI.OPEN")}`} onClick={() => setOpen(!open)}/>
		</div>
	);
};

export default ChatBot;