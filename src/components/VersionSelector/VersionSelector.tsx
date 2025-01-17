import React, {useEffect} from "react";
import "../../styles/VersionSelector.css";

interface VersionSelectorProps {
	setVersion: (version: string) => void;
}

const VersionSelector: React.FC<VersionSelectorProps> = ({setVersion}) => {
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
				<option value="2102">1.21.2</option>
				<option value="2101">1.21.1</option>
				<option value="2100" className="bold-option">1.21</option>
				<option value="2006">1.20.6</option>
				<option value="2005">1.20.5</option>
				<option value="2004">1.20.4</option>
				<option value="2003">1.20.3</option>
				<option value="2002">1.20.2</option>
				<option value="2001">1.20.1</option>
				<option value="2000" className="bold-option">1.20</option>
				<option value="1904">1.19.4</option>
				<option value="1903">1.19.3</option>
				<option value="1902">1.19.2</option>
				<option value="1901">1.19.1</option>
				<option value="1900" className="bold-option">1.19</option>
				<option value="1802">1.18.2</option>
				<option value="1801">1.18.1</option>
				<option value="1800" className="bold-option">1.18</option>
				<option value="1701">1.17.1</option>
				<option value="1700" className="bold-option">1.17</option>
				<option value="1605">1.16.5</option>
				<option value="1604">1.16.4</option>
				<option value="1603">1.16.3</option>
				<option value="1602">1.16.2</option>
				<option value="1601">1.16.1</option>
				<option value="1600" className="bold-option">1.16</option>
				<option value="1502">1.15.2</option>
				<option value="1501">1.15.1</option>
				<option value="1500" className="bold-option">1.15</option>
				<option value="1404">1.14.4</option>
				<option value="1403">1.14.3</option>
				<option value="1402">1.14.2</option>
				<option value="1401">1.14.1</option>
				<option value="1400" className="bold-option">1.14</option>
				<option value="1302">1.13.2</option>
				<option value="1301">1.13.1</option>
				<option value="1300" className="bold-option">1.13</option>
				<option value="1202">1.12.2</option>
				<option value="1201">1.12.1</option>
				<option value="1200" className="bold-option">1.12</option>
				<option value="1102">1.11.2</option>
				<option value="1101">1.11.1</option>
				<option value="1100" className="bold-option">1.11</option>
				<option value="1002">1.10.2</option>
				<option value="1001">1.10.1</option>
				<option value="1000" className="bold-option">1.10</option>
				<option value="940">1.9.4</option>
				<option value="930">1.9.3</option>
				<option value="920">1.9.2</option>
				<option value="910">1.9.1</option>
				<option value="900" className="bold-option">1.9</option>
				<option value="890">1.8.9</option>
				<option value="880">1.8.8</option>
				<option value="870">1.8.7</option>
				<option value="860">1.8.6</option>
				<option value="850">1.8.5</option>
				<option value="840">1.8.4</option>
				<option value="830">1.8.3</option>
				<option value="820">1.8.2</option>
				<option value="810">1.8.1</option>
				<option value="800" className="bold-option">1.8</option>
			</select>
		</div>
	);
};

export default VersionSelector;