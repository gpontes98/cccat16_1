import { getAccount } from "../../src/useCases/getAccount";
import { signup } from "../../src/useCases/signup";

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSignup = await signup(input);
	expect(outputSignup).toBeDefined();
	const outputGetAccount = await getAccount({ accountId: outputSignup });
	expect(outputGetAccount.account_id).toBe(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("Deve cadastrar um motorista com placa válida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "EUC7107",
	};
	const outputSignup = await signup(input);
	expect(outputSignup).toBeDefined();
	const outputGetAccount = await getAccount({ accountId: outputSignup });
	expect(outputGetAccount.account_id).toBe(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
	expect(outputGetAccount.is_driver).toBe(input.isDriver);
	expect(outputGetAccount.car_plate).toBe(input.carPlate);
});

test("Deve retornar uma exception de 'cpf inválido'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "00000000000",
		isPassenger: true,
	};
	await expect(() => signup(input)).rejects.toThrow(
		new Error("CPF inválido")
	);
});

test("Deve retornar uma exception de 'e-mail inválido'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe0`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await expect(() => signup(input)).rejects.toThrow(
		new Error("Email inválido")
	);
});

test("Deve retornar uma exception de 'nome inválido'", async function () {
	const input = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await expect(() => signup(input)).rejects.toThrow(
		new Error("Nome inválido")
	);
});

test("Deve retornar uma exception 'usuário existente'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe0.2769817215466577@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await expect(() => signup(input)).rejects.toThrow(
		new Error("Usuário já existe")
	);
});

test("Deve retornar uma exception 'Placa inválida'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "1237107",
	};
	await expect(() => signup(input)).rejects.toThrow(
		new Error("Placa do veículo inválida")
	);
});
