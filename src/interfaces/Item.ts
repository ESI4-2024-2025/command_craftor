import Enchantement from "./Enchantment";
import Material from "./Material";

interface Item {
	_id: string;
	nom: string;
	identifier: string;
	enchantement: Enchantement[];
	materiaux: Material[];
	version: number;
}

export default Item;