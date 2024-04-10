import { getAccount } from "../../src/useCases/getAccount";
import { signup } from "../../src/useCases/signup";

test("Deve retornar a conta correta passando um id válido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSignup = await signup(input);
	expect(outputSignup).toBeDefined();
	const output = await getAccount({
		accountId: outputSignup,
	});
	expect(output).toEqual({
		account_id: outputSignup,
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		car_plate: null,
		is_passenger: input.isPassenger,
		is_driver: false,
	});
});

test("Deve retornar 'conta não encontrada' quando não encontrar um usuário", async function () {
	await expect(() =>
		getAccount({ accountId: "2a38a02a-366f-41bc-a299-8c009bf31f21" })
	).rejects.toThrow(new Error("Usuário não encontrado"));
});

test("Deve retornar 'UUID inválido' passando um accountId inválido", async function () {
	await expect(() => getAccount({ accountId: "f31f21" })).rejects.toThrow(
		new Error("UUID inválido")
	);
});
