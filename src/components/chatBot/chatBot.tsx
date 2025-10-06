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
		promptWrapper =
			"## Rôle du chatbot\n" +
			"Tu es un chatbot dans une application web de génération de commandes Minecraft. Ton objectif est d'aider les joueurs et joueuses :\n" +
			"- À comprendre comment fonctionnent les commandes Minecraft.\n" +
			"- À utiliser les générateurs intégrés de l’application selon leur besoin.\n" +
			"\n" +
			"## Langue\n" +
			"Tu répondras toujours en **français**, sauf si l'utilisateur demande explicitement une autre langue.\n" +
			"\n" +
			"## Générateurs disponibles\n" +
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
			"  2. Tableau d’effets (effet, durée, amplification, particules=true, icône=true)\n" +
			"  - Boutons \"+\" / \"-\" pour gérer les lignes\n" +
			"\n" +
			"## Comportements spécifiques\n" +
			"- Redirige vers le bon générateur selon la demande.\n" +
			"- Si une demande est impossible/non supportée, informe clairement.\n" +
			"- Ne propose pas d’enchantements/effets au-delà du vanilla.\n" +
			"- **Limite la réponse à 255 caractères.**\n" +
			"\n" +
			"## Exemples\n" +
			"- \"Donne-moi une pioche en netherite avec Efficacité V\"\n" +
			"- \"Je veux une potion de régénération persistante\"\n" +
			"- \"Quel générateur pour une flèche de poison ?\"\n" +
			"- \"Puis-je avoir une épée avec Tranchant VI ?\" → répondre que c’est impossible sans triche\n";
	} else {
		promptWrapper =
			"## Chatbot Role\n" +
			"You are a chatbot in a web app for generating Minecraft commands.\n" +
			"Help users understand commands and use the built-in generators.\n" +
			"\n" +
			"## Language\n" +
			"Always reply in **English** unless another language is explicitly requested.\n" +
			"\n" +
			"## Generators\n" +
			"1. /give enchanted items (tools & armor)\n" +
			"2. /give potions\n" +
			"\n" +
			"### Enchanted Items\n" +
			"- Two-step UI (username → item & material), then compatible enchantments with +/- level controls, capped to vanilla limits.\n" +
			"\n" +
			"### Potions\n" +
			"- Normal, splash, lingering, tipped arrows. Table with effect, duration, amplifier, particles=true, icon=true. +/- to add/remove lines.\n" +
			"\n" +
			"## Behavior\n" +
			"- Route to the correct generator, refuse impossible/unsupported requests.\n" +
			"- **Limit responses to 255 characters.**\n" +
			"\n" +
			"## Examples\n" +
			"- \"Give me a netherite pickaxe with Efficiency V\"\n" +
			"- \"I want a lingering regeneration potion\"\n" +
			"- \"Which generator for a poison-tipped arrow?\"\n" +
			"- \"Sharpness VI?\" → not possible without cheats\n";
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
		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		try {
			const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
			const url =
				process.env.REACT_APP_OPENROUTER_URL ||
				"https://openrouter.ai/api/v1/chat/completions";

			// On convertit l’historique local → format OpenAI (assistant/user/system)
			const history = messages.map((m) => ({
				role: m.role === "model" ? "assistant" : "user",
				content: m.content,
			}));

			// On envoie promptWrapper en "system" + historique + nouveau message
			const payload = {
				messages: [
					{role: "system", content: promptWrapper},
					...history,
					{role: "user", content: userMessage.content},
				],
			};

			const response = await fetch(url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
					// requis si tu appelles l’API depuis le navigateur
					"HTTP-Referer": window.location.origin,
					"X-Title": "CommandCraftor Chat",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errText = await response.text();
				throw new Error(`OpenRouter ${response.status}: ${errText}`);
			}

			const data = await response.json();
			const text =
				data?.choices?.[0]?.message?.content ?? "Erreur lors de la réponse";
			setMessages((prev) => [...prev, {role: "model", content: text}]);
		} catch (error) {
			console.error("Error occurred while sending message:", error);
			setMessages((prev) => [
				...prev,
				{role: "model", content: "Erreur lors de la requête"},
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
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button onClick={sendMessage}>{t("AI.SEND")}</button>
				</div>
			</div>
			<ButtonsJavaEdition
				size="20"
				title={open ? `${t("AI.CLOSE")}` : `${t("AI.OPEN")}`}
				onClick={() => setOpen(!open)}
			/>
		</div>
	);
};

export default ChatBot;
