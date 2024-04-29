import { Cpf } from "../../../src/domain/vo/Cpf";


test.each(["97456321558", "71428793860", "87748248800"])(
	"Deve testar um cpf válido: %s",
	function (cpf: string) {
		expect(new Cpf(cpf)).toBeDefined();
	}
);

test.each(["11111111111", "123", "1234566789123456789"])(
	"Deve testar um cpf inválido: %s",
	function (cpf: string) {
		expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"));
	}
);
