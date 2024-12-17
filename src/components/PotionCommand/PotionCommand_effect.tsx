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
	onValuesChange: (newValues: Effect[]) => void;
}

const PotionCommand_effect = ({version, data, loading, onValuesChange}: PotionCommandProps) => {
	const [effectBlocks, setEffectBlocks] = useState<Effect[]>([
		{effect: "", duration: 600, amplifier: -1, particles: true, icon: true}
	]);
	const {t} = useTranslation();

	/**
	 * useEffect hook to update the effect blocks with the first effect from the data array.
	 */
	useEffect(() => {
		setEffectBlocks((prevBlocks) =>
			prevBlocks.map((block) =>
				block.effect === "" && data.length > 0
					? { ...block, effect: data[0].identifier }
					: block
			)
		);
	}, [data]);

	/**
	 * useEffect hook to update the parent component with the effect blocks.
	 * Calls the onValuesChange function with the effectBlocks state as argument.
	 */
	useEffect(() => {
		onValuesChange(effectBlocks);
	}, [effectBlocks]);

	/**
	 * Get the available effects for the select input field.
	 *
	 * @param currentIndex
	 */
	const getAvailableEffects = (currentIndex: number) => {
		const selectedEffects = effectBlocks.map(block => block.effect);
		return data.filter(item => !selectedEffects.includes(item.identifier) || item.identifier === effectBlocks[currentIndex].effect);
	};

	/**
     * Add a new effect block to the effectBlocks state.
     */
	const addEffectBlock = () => {
		const selectedEffects = effectBlocks.map(block => block.effect);
		const availableEffect = data.find(item => !selectedEffects.includes(item.identifier));

		if (availableEffect) {
			setEffectBlocks([...effectBlocks, {effect: availableEffect.identifier, duration: 600, amplifier: -1, particles: true, icon: true}]);
		}
	};
	/**
     * Remove an effect block from the effectBlocks state.
     *
     * @param {number} index - The index of the effect block to remove.
     */
	const removeEffectBlock = (index: number) => {
		const updatedBlocks = effectBlocks.filter((_, idx) => idx !== index);
		setEffectBlocks(updatedBlocks);
		onValuesChange(updatedBlocks);
	};

	/**
     * Handle the change of the select input fields.
     * Updates the effectBlocks state with the new value.
     *
     * @param {number} index - The index of the effect block to update.
     * @param {keyof Effect} field - The field to update.
     * @param {any} value - The new value.
     */
	const handleSelectChange = (index: number, field: keyof Effect, value: any) => {
		const updatedBlocks = effectBlocks.map((block, idx) =>
			idx === index ? {...block, [field]: value} : block
		);
		setEffectBlocks(updatedBlocks);
		onValuesChange(updatedBlocks);
	};

	return (
		<div>
			<div className="effect-button-blocks">
				{effectBlocks.map((block, idx) => (
					<div className="effect-button-block" key={idx}>
						<div className="effect-block">
							<div className="input1">
								<select
									id={`effect-select-${idx}`}
									className="minecraft-input fixed-width"
									value={block.effect}
									onChange={(e) => handleSelectChange(idx, "effect", e.target.value)}
									disabled={loading}
								>
									{loading ? (
										<option value="loading">{t("GLOBAL.LOADING")}</option>
									) : (
										getAvailableEffects(idx).map((item: Potions, idx: number) => (
											<option key={idx} value={item.identifier}>
												{t(`MINECRAFT.POTIONS.EFFECTS.${item.identifier.toUpperCase()}`)}
											</option>
										))
									)}
								</select>
							</div>
							<div className="input2">
								<input
									className="minecraft-input text-minecraft"
									type="text"
									min="0"
									value={block.duration}
									onChange={(e) => handleSelectChange(idx, "duration", e.target.value.replace(/[^0-9]/g, ""))}
								/>
							</div>
							<div className="input3">
								<input
									className="minecraft-input text-minecraft"
									type="text"
									min="0"
									value={block.amplifier === -1 ? "" : block.amplifier}
									onChange={(e) => handleSelectChange(idx, "amplifier", e.target.value === "" ? -1 : e.target.value.replace(/[^0-9]/g, ""))}
								/>
							</div>
							<div className="input4">
								<input
									type="checkbox"
									className="checkbox-style"
									checked={block.particles}
									onChange={(e) => handleSelectChange(idx, "particles", e.target.checked)}
								/>
							</div>
							<div className="input5">
								<input
									type="checkbox"
									className="checkbox-style"
									checked={block.icon}
									onChange={(e) => handleSelectChange(idx, "icon", e.target.checked)}
								/>
							</div>
						</div>
						{effectBlocks.length > 1 && (
							<div className="button-effect-block">
								<ButtonsJavaEdition taille="3" title="-" onClick={() => removeEffectBlock(idx)}/>
							</div>
						)}
					</div>
				))}
			</div>
			<ButtonsJavaEdition taille="20" title="+" onClick={addEffectBlock}/>
		</div>
	);
};

export default PotionCommand_effect;