import React, {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./styles/App.css";
import Commands from "./components/Commands";
import Home from "./Home";
import AccountCreationOrConnexion from "./components/UserSection/AccountCreationOrConnexion";
import Account from "./components/UserSection/Account";
import Admin from "./components/Admin/Admin";
import Changelog from "./components/Changelog/Changelog";
import LanguageSelector from "./components/Languageselector/LanguageSelector";
import NotFound from "./components/404";
import InfoModification from "./components/UserSection/InfoModification";
import PotionCommand from "./components/PotionCommand/PotionCommand";
import Forbidden from "./components/403";
import ProtectedRoute from "./components/utilities/ProtectedRoute";
import NewTicket from "./components/SupportSection/NewTicket";
import TicketsMonitoring from "./components/Admin/TicketsMonitoring";
import ChatBot from "./components/chatBot/chatBot";
import GiveEnchantedTools from "./components/GiveEnchantedTool/GiveEnchantedTools";
import GiveFood from "./components/GiveFood/GiveFood";
import GiveEnchantedArmors from "./components/GiveEnchantedArmors/GiveEnchantedArmors";
import GiveEnchantedBook from "./components/GiveEnchantedBook/GiveEnchantedBook";

function App() {
	const [language, setLanguage] = useState("");

	return (
		<div className="app">
			<LanguageSelector setLanguage={setLanguage}/>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/commands" element={<Commands/>}/>
					<Route path="/commands/GiveEnchantedTools" element={<GiveEnchantedTools language={language}/>}/>
					<Route path="/commands/GiveEnchantedArmors" element={<GiveEnchantedArmors language={language}/>}/>
					<Route path="/commands/GiveEnchantedBook" element={<GiveEnchantedBook language={language}/>}/>
					<Route path="/commands/givepotion" element={<PotionCommand language={language}/>}/>
					<Route path="/commands/GiveFood" element={<GiveFood language={language}/>}/>
					<Route path="/account" element={<Account/>}/>
					<Route path="/account/creationorconnexion" element={<AccountCreationOrConnexion/>}/>
					<Route path="/account/infomodifications" element={<InfoModification/>}/>
					<Route path="/new-ticket" element={<NewTicket/>}/>
					<Route path="/changelog" element={<Changelog/>}/>
					<Route path="/admin" element={
						<ProtectedRoute role="admin">
							<Admin/>
						</ProtectedRoute>
					}/>
					<Route path="/admin/tickets" element={
						<ProtectedRoute role="admin">
							<TicketsMonitoring/>
						</ProtectedRoute>
					}/>
					<Route path="/forbidden" element={<Forbidden/>}/>
					<Route path="*" element={<NotFound/>}/>
				</Routes>
				<ChatBot/>
			</BrowserRouter>
		</div>
	);
}

export default App;