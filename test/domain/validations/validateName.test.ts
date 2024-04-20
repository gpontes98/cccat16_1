import { validateName } from "../../../src/domain/validations/validateName";

test.each(["Gabriel Pontes", "Elon Musk", "Ze Neto"])(
	"Deve testar um nome válido: %s",
	function (nome: string) {
		expect(validateName(nome)).toBe(true);
	}
);

test.each(["gabriel@gmail.com", "joaninha 123", "462.720"])(
	"Deve testar um nome inválido: %s",
	function (nome: string) {
		expect(validateName(nome)).toBe(false);
	}
);
