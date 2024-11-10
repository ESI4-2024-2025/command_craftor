import React, {useEffect, useState} from "react";
import Potions from "../../interfaces/Potions";
import "../../styles/PotionCommand.css";
import ButtonsJavaEdition from "../utilities/ButtonsJavaEdition";
import {useTranslation} from "react-i18next";
import Effect from "../../interfaces/Effect";

interface PotionCommandProps {
	version: number;
	data: Potions[];
	loading: boolean;
	onValuesChange: (newValues: Effect[]) => void; // Ajoutez cette ligne
}

const PotionCommand_effect = ({version, data, loading, onValuesChange}: PotionCommandProps) => {
	const [effectBlocks, setEffectBlocks] = useState<Effect[]>([
		{effect: "", duration: 0, amplifier: 0, particles: true, icon: true}
	]);
	const {t} = useTranslation();

	useEffect(() => {
		onValuesChange(effectBlocks); // Appelez la fonction de rappel à chaque changement de valeurs
	}, [effectBlocks]);

	const addEffectBlock = () => {
		setEffectBlocks([...effectBlocks, {effect: "", duration: 0, amplifier: 0, particles: true, icon: true}]);
	};

	const removeEffectBlock = (index: number) => {
		setEffectBlocks(effectBlocks.filter((_, idx) => idx !== index));
	};

	const handleSelectChange = (index: number, field: keyof Effect, value: any) => {
		const updatedBlocks = effectBlocks.map((block, idx) =>
			idx === index ? {...block, [field]: value} : block
		);
		setEffectBlocks(updatedBlocks);
	};

	return (
		<div>
			{effectBlocks.map((block, idx) => (
				<div className="effect-button-block">
					<div key={idx} className="effect-block">
						<div className="input1">
							<select id={`effect-select-${idx}`} className="minecraft-input fixed-width"
									value={block.effect}
									onChange={(e) => handleSelectChange(idx, "effect", e.target.value)}
									disabled={loading}>
								{loading ? (
									<option value="loading">{t("GLOBAL.LOADING")}</option>
								) : (
									<>
										{
											data.map((item: Potions, idx: number) => (
												<option key={idx}
														value={item.identifier}>{t(`MINECRAFT.POTIONS.EFFECTS.${item.identifier.toUpperCase()}`)}</option>
											))
										}
									</>
								)}
							</select>
						</div>
						<div className="input2">
							<input className="minecraft-input text-minecraft" type="text" min="0" value={block.duration}
								   onChange={(e) => handleSelectChange(idx, "duration", e.target.value.replace(/[^0-9]/g, ""))}/>
						</div>
						<div className="input3">
							<input className="minecraft-input text-minecraft" type="text" min="0"
								   value={block.amplifier}
								   onChange={(e) => handleSelectChange(idx, "amplifier", e.target.value.replace(/[^0-9]/g, ""))}/>
						</div>
						<div className="input4">
							<input type="checkbox" className="checkbox-style" checked={block.particles}
								   onChange={(e) => handleSelectChange(idx, "particles", e.target.checked)}/>
						</div>
						<div className="input5">
							<input type="checkbox" className="checkbox-style" checked={block.icon}
								   onChange={(e) => handleSelectChange(idx, "icon", e.target.checked)}/>
						</div>
					</div>
					{effectBlocks.length > 1 && (
						<div className="button-effect-block">
							<ButtonsJavaEdition taille="3" title="-" onClick={() => removeEffectBlock(idx)}/>
						</div>
					)}
				</div>
			))}

			<ButtonsJavaEdition taille="20" title="+" onClick={() => addEffectBlock()}/>
		</div>
	);
};

export default PotionCommand_effect;