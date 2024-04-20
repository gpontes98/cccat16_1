import { validateEmail } from "../../../src/domain/validations/validateEmail";

test.each(["gabriel@gmail.com", "jose@hotmail.com", "fernando@yahoo.com.br"])(
	"Deve testar um email válido: %s",
	function (email: string) {
		expect(validateEmail(email)).toBe(true);
	}
);

test.each(["gabrielgmail.com", "123", "@gmail.com"])(
	"Deve testar um email inválido: %s",
	function (email: string) {
		expect(validateEmail(email)).toBe(false);
	}
);
