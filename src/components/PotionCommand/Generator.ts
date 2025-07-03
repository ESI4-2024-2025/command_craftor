import Effect from "../../interfaces/Effect";

export const generatePotionCommand = (potionType: string, username: string, effects: Effect[], version: number) => {

	if (version && version >= 900 && version < 2100) {
		const effectsToString = effects.map(effect => {
			let effectString = `id:${effect.id}`;

			if (effect.duration) {
				effectString += `,duration:${effect.duration}`;
			} else {
				effectString += `,duration:0`;
			}

			/** -1 because we don't want to display it if the user doesn't specify it, but the value can be 0*/
			/** TODO: handle a null value, better than -1 */
			if (effect.amplifier > -1 && effect.amplifier) {
				effectString += `,amplifier:${effect.amplifier}`;
			}
			if (!effect.particles) {
				effectString += `,show_particles:0b`;
			}
			if (!effect.icon) {
				effectString += `,show_icon:0b`;
			}

			return `{${effectString}}`;
		}).join(",");

		return `/give ${username ? username : "@p"} minecraft:${potionType} 1 0 {custom_effects:[${effectsToString}]}`;
	} else if (version && version >= 1200 && version < 2001) {
		const effectsToString = effects.map(effect => {
			let effectString = `id:${effect.effect}`;

			if (effect.duration) {
				effectString += `,duration:${effect.duration}`;
			} else {
				effectString += `,duration:0`;
			}

			/** -1 because we don't want to display it if the user doesn't specify it, but the value can be 0*/
			/** TODO: handle a null value, better than -1 */
			if (effect.amplifier > -1 && effect.amplifier) {
				effectString += `,amplifier:${effect.amplifier}`;
			}
			if (!effect.particles) {
				effectString += `,show_particles:0b`;
			}
			if (!effect.icon) {
				effectString += `,show_icon:0b`;
			}

			return `{${effectString}}`;
		}).join(",");

		return `/give ${username ? username : "@p"} minecraft:${potionType}{custom_effects:[${effectsToString}]}`;
	} else if (version && version >= 2002 && version < 2006) {
		const effectsToString = effects.map(effect => {
			let effectString = `id:${effect.effect}`;

			if (effect.duration) {
				effectString += `,duration:${effect.duration}`;
			} else {
				effectString += `,duration:0`;
			}

			/** -1 because we don't want to display it if the user doesn't specify it, but the value can be 0*/
			/** TODO: handle a null value, better than -1 */
			if (effect.amplifier > -1 && effect.amplifier) {
				effectString += `,amplifier:${effect.amplifier}`;
			}
			if (!effect.particles) {
				effectString += `,show_particles:0b`;
			}
			if (!effect.icon) {
				effectString += `,show_icon:0b`;
			}

			return `{${effectString}}`;
		}).join(",");

		return `/give ${username ? username : "@p"} minecraft:${potionType}{custom_potion_effects:[${effectsToString}]}`;

	} else if (version && version >= 2006 && version <= 2102) {
		const effectsToString = effects.map(effect => {
			let effectString = `id:${effect.effect}`;

			if (effect.duration) {
				effectString += `,duration:${effect.duration}`;
			} else {
				effectString += `,duration:0`;
			}

			/** -1 because we don't want to display it if the user doesn't specify it, but the value can be 0*/
			/** TODO: handle a null value, better than -1 */
			if (effect.amplifier > -1 && effect.amplifier) {
				effectString += `,amplifier:${effect.amplifier}`;
			}
			if (!effect.particles) {
				effectString += `,show_particles:0b`;
			}
			if (!effect.icon) {
				effectString += `,show_icon:0b`;
			}

			return `{${effectString}}`;
		}).join(",");

		return `/give ${username ? username : "@p"} minecraft:${potionType}[potion_contents={custom_potion_effects:[${effectsToString}]}]`;
	}

	return "error";
};