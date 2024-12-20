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
import GiveEnchantedItems from "./components/GiveEnchantedItem/GiveEnchantedItems";
import Forbidden from "./components/403";
import ProtectedRoute from "./components/utilities/ProtectedRoute";

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
					<Route path="/admin" element={
						<ProtectedRoute role='admin'>
							<Admin/>
						</ProtectedRoute>
					}/>
					<Route path="/forbidden" element={<Forbidden/>}/>
					<Route path="*" element={<NotFound/>}/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;