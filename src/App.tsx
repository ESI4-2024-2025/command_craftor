import React, {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./styles/App.css";
import Commands from "./components/Commands";
import Home from "./Home";
import AccountCreationOrConnexion from "./components/UserSection/AccountCreationOrConnexion";
import Account from "./components/UserSection/Account";
import Changelog from "./components/Changelog/Changelog";
import LanguageSelector from "./components/Languageselector/LanguageSelector";
import NotFound from "./components/404";
import GiveEnchantedItems from "./components/GiveEnchantedItem/GiveEnchantedItems";

function App() {
	const [language, setLanguage] = useState("");

	return (
		<div className="app">
			<LanguageSelector setLanguage={setLanguage}/>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/commands" element={<Commands/>}/>
					<Route path="/commands/giveenchanteditems" element={<GiveEnchantedItems language={language}/>}/>
					<Route path="/account" element={<Account/>}/>
					<Route path="/account/creationorconnexion" element={<AccountCreationOrConnexion/>}/>
					<Route path="/changelog" element={<Changelog/>}/>
					<Route path="*" element={<NotFound/>}/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;