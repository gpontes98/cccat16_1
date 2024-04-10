import { validateCarPlate } from "../../src/validations/validateCarPlate";

test.each(["EUC7107", "ABC1234", "CDE3215"])(
	"Deve testar uma placa válida: %s",
	function (carPlate: string) {
		expect(validateCarPlate(carPlate)).toBe(true);
	}
);

test.each(["7107", "abc1234", "1DE321"])(
	"Deve testar uma placa inválida: %s",
	function (carPlate: string) {
		expect(validateCarPlate(carPlate)).toBe(false);
	}
);
