import React, {useState} from "react";
import Potions from "../../interfaces/Potions";
import "../../styles/PotionCommand.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import {useTranslation} from "react-i18next";

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
	const [effectBlocks, setEffectBlocks] = useState<EffectBlock[]>([
		{effect: "", duration: 0, amplifier: 0, particles: false, icon: false}
	]);
	const {t} = useTranslation();

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
			<div className="potion-header-row text-minecraft">
				<div className="potion-header1">{t("POTION_COMMAND.EFFECT")}</div>
				<div className="potion-header2">{t("POTION_COMMAND.DURATION")}</div>
				<div className="potion-header3">{t("POTION_COMMAND.AMPLIFIER")}</div>
				<div className="potion-header4">{t("POTION_COMMAND.PARTICLES")}</div>
				<div className="potion-header5">{t("POTION_COMMAND.ICON")}</div>
			</div>
			{effectBlocks.map((block, idx) => (
				<div key={idx} className="effect-block">
					<div className="input">
						<label htmlFor={`effect-select-${idx}`} className="text-minecraft">effet</label>
						<select id={`effect-select-${idx}`} className="minecraft-input fixed-width" value={block.effect}
								onChange={(e) => handleSelectChange(idx, "effect", e.target.value)}>
							{data.map((item, idx) => (
								<option key={idx} value={item.identifier}>{t(`MINECRAFT.POTIONS.EFFECTS.${item.identifier.toUpperCase()}`)}</option>
							))}
						</select>
					</div>
					<div className="input2">
						<input className="minecraft-input text-minecraft" type="text" min="0" value={block.duration}
							   onChange={(e) => handleSelectChange(idx, "duration", e.target.value.replace(/[^0-9]/g, ""))}/>
					</div>
					<div className="input3">
						<input className="minecraft-input text-minecraft" type="text" min="0" value={block.amplifier}
							   onChange={(e) => handleSelectChange(idx, "amplifier", e.target.value.replace(/[^0-9]/g, ""))}/>
					</div>
					<div className="input4">
						<input type="checkbox" className="checkbox-style" checked={block.particles}
							   onChange={(e) => handleSelectChange(idx, "particles", e.target.checked)}/>
					<div className="input5">
						<input type="checkbox" className="checkbox-style" checked={block.icon}
							   onChange={(e) => handleSelectChange(idx, "icon", e.target.checked)}/>
					</div>
					{effectBlocks.length > 1 && (
						<ButtonsJavaEdition taille="square" title="-" onClick={() => removeEffectBlock(idx)}/>
					)}
				</div>
			))}
			<ButtonsJavaEdition taille="20" title="+" onClick={() => addEffectBlock()}/>
		</div>
	);
};

export default PotionCommand_effect;