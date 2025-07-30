
export const generateGiveFoodCommand = (
	item: string,
	username: string,
	amount: number
): string => {
	return `/give ${username ? username : "@p"} ${item} ${amount}`;
}