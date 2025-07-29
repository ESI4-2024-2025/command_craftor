import Enchantment from "../../interfaces/Enchantment";

interface SelectedItem {
	enchantement: Enchantment[];
}

export const generateEnchantmentCommand = (
	item: string,
	selectedItem: SelectedItem | null,
	enchantmentValues: number[],
	username: string,
): string => {
	const selectedVersion: number | null = localStorage.getItem("selectedVersion") ? Number(localStorage.getItem("selectedVersion")) : null;

	/**
	 * Generate the command for giving an enchanted item based on the selected version.
	 */
	if (selectedVersion && selectedVersion >= 800 && selectedVersion < 1300) {
		let enchantments: string = "";

		if (enchantmentValues.length > 0 && selectedItem && selectedItem.enchantement) {
			let index = 0;
			enchantmentValues.forEach((value) => {
				if (value > 0 && selectedItem.enchantement[index]) {
					enchantments = enchantments + `{id:${selectedItem.enchantement[index].minecraft_id},lvl:${value.toString()}s}`;
				} else {
					enchantments = enchantments + "";
				}
				index++;
			});

			if (enchantments) {
				enchantments = enchantments.replace(/}\{/g, "},{");
				enchantments = `{Enchantments:[${enchantments}]}`;
			}
		}

		return `/give ${username ? username : "@p"} ${item}${enchantments}`;
	} else if (selectedVersion && selectedVersion >= 1300 && selectedVersion <= 2005) {
		let enchantments: string = "";

		if (enchantmentValues.length > 0 && selectedItem && selectedItem.enchantement) {
			let index = 0;
			enchantmentValues.forEach((value) => {
				if (value > 0 && selectedItem.enchantement[index]) {
					enchantments = enchantments + `{id:${selectedItem.enchantement[index].identifier},lvl:${value.toString()}s}`;
				} else {
					enchantments = enchantments + "";
				}
				index++;
			});

			if (enchantments) {
				enchantments = enchantments.replace(/}\{/g, "},{");
				enchantments = `{Enchantments:[${enchantments}]}`;
			}
		}

		return `/give ${username ? username : "@p"} ${item}${enchantments}`;
	} else if (selectedVersion && selectedVersion >= 2006) {
		let enchantements: string = "";

		if (enchantmentValues.length > 0 && selectedItem && selectedItem.enchantement) {
			let index = 0;
			enchantmentValues.forEach((value) => {
				if (value > 0 && selectedItem.enchantement[index]) {
					enchantements = enchantements + `'${selectedItem.enchantement[index].identifier}':${value.toString()},`;
				} else {
					enchantements = enchantements + "";
				}
				index++;
			});

			if (enchantements) {
				enchantements = enchantements.replace(/.$/, "");
				enchantements = `[enchantments={levels:{${enchantements}}}]`;
			}
		}

		return `/give ${username ? username : "@p"} ${item}${enchantements}`;
	}

	return `error`;
};