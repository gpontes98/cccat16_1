export function validateCarPlate(carPlate: string): boolean {
	return carPlate.match(/[A-Z]{3}[0-9]{4}/) !== null;
}
