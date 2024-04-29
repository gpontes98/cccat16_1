import { Name } from "../../../src/domain/vo/Name";

test.each(["Gabriel Pontes", "Elon Musk", "Ze Neto"])(
	"Deve testar um nome válido: %s",
	function (nome: string) {
		expect(new Name(nome)).toBeDefined();
	}
);

test.each(["gabriel@gmail.com", "joaninha 123", "462.720"])(
	"Deve testar um nome inválido: %s",
	function (nome: string) {
		expect(() => new Name(nome)).toThrow(new Error("Invalid name"));
	}
);
