import React, {useEffect, useState} from "react";
import "../../styles/VersionSelector.css";
import Version from "../../interfaces/Version";
import {useTranslation} from "react-i18next";

interface VersionSelectorProps {
	setVersion: (version: string) => void;
}

const VersionSelector: React.FC<VersionSelectorProps> = ({setVersion}) => {
	const [versions, setVersions] = React.useState<Version[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const {t} = useTranslation();

	useEffect(() => {
		setIsLoading(true);
		fetch(`${process.env.REACT_APP_HOST_BACK}/version`)
			.then(response => response.json())
			.then((versions: Version[]) => {
				setIsLoading(false);
				setVersions(versions);
			});
	}, []);

	useEffect(() => {
		const savedVersion = localStorage.getItem("selectedVersion") || "2100";
		setVersion(savedVersion);
	}, [setVersion]);

	const changeVersion = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newVersion = event.target.value;
		setVersion(newVersion);
		localStorage.setItem("selectedVersion", newVersion);
	};

	return (
		<div className="version-selector">
			<select onChange={changeVersion} defaultValue={localStorage.getItem("selectedVersion") || "2100"}>
				{isLoading ? (
					<option value="loading">{t("GLOBAL.LOADING")}</option>
				) : (
					versions.map((version) => (
						<option key={version.value} value={version.value} className={version.majeur ? "version-majeure" : ""}>
							{version.version}
						</option>
					))
				)}
			</select>
		</div>
	);
};

export default VersionSelector;