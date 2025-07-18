interface Effects {
	id: number;
	effect: string;
	duration: number;
	amplifier: number | null;
	particles: boolean;
	icon: boolean;
}

export default Effects;