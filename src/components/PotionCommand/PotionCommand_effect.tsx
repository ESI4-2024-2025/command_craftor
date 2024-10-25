import React, {useState} from "react";
import Potions from "../../interfaces/Potions";
import "../../styles/PotionCommand.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";

interface PotionCommandProps {
	version: number;
	data: Potions[];
}

interface EffectBlock {
	effect: string;
	duration: number;
	amplifier: number;
	particles: boolean;
	icon: boolean;
}

const PotionCommand_effect = ({version, data}: PotionCommandProps) => {
	const [effectBlocks, setEffectBlocks] = useState<EffectBlock[]>([]);

	const addEffectBlock = () => {
		setEffectBlocks([...effectBlocks, {effect: "", duration: 0, amplifier: 0, particles: false, icon: false}]);
	};

	const removeEffectBlock = (index: number) => {
		setEffectBlocks(effectBlocks.filter((_, idx) => idx !== index));
	};

	const handleSelectChange = (index: number, field: keyof EffectBlock, value: any) => {
		const updatedBlocks = effectBlocks.map((block, idx) =>
			idx === index ? {...block, [field]: value} : block
		);
		setEffectBlocks(updatedBlocks);
	};

	return (
		<div>
			{effectBlocks.map((block, idx) => (
				<div key={idx} className="effect-block">
					<div className="input">
						<label htmlFor={`effect-select-${idx}`} className="text-minecraft">effet</label>
						<select id={`effect-select-${idx}`} className="minecraft-input fixed-width" value={block.effect}
								onChange={(e) => handleSelectChange(idx, "effect", e.target.value)}>
							{data.map((item, idx) => (
								<option key={idx} value={item.identifier}>{item.identifier}</option>
							))}
						</select>
					</div>
					<div className="input2">
						<label htmlFor={`effect-select-${idx}`} className="text-minecraft">effet</label>
						<input className="minecraft-input text-minecraft" type="number"/>
					</div>
					<ButtonsJavaEdition taille="square" title="-" onClick={() => removeEffectBlock(idx)}/>
				</div>
			))}
			<ButtonsJavaEdition taille="20" title="+" onClick={() => addEffectBlock()}/>
		</div>
	);
};

export default PotionCommand_effect;