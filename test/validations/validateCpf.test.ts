import { validateCpf } from "../../src/validations/validateCpf";

test.each(["97456321558", "71428793860", "87748248800"])(
	"Deve testar um cpf válido: %s",
	function (cpf: string) {
		expect(validateCpf(cpf)).toBe(true);
	}
);

test.each(["11111111111", "123", "1234566789123456789"])(
	"Deve testar um cpf inválido: %s",
	function (cpf: string) {
		expect(validateCpf(cpf)).toBe(false);
	}
);
