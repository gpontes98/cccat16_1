import { Email } from "../../../src/domain/vo/Email";

test.each(["gabriel@gmail.com", "jose@hotmail.com", "fernando@yahoo.com.br"])(
	"Deve testar um email válido: %s",
	function (email: string) {
		expect(new Email(email)).toBeDefined();
	}
);

test.each(["gabrielgmail.com", "123", "@gmail.com"])(
	"Deve testar um email inválido: %s",
	function (email: string) {
		expect(() => new Email(email)).toThrow(new Error("Invalid email"));
	}
);
