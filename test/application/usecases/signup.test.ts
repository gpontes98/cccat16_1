
import { AccountRepositoryMemory } from "../../../src/infraestructure/repository/AccountRepository";
import { GetAccount } from "../../../src/application/usecases/GetAccount";
import { Signup } from "../../../src/application/usecases/Signup";

// Integration Test or Unit Test
let signup: Signup;
let getAccount: GetAccount;

beforeEach(async () => {
	const accountRepository = new AccountRepositoryMemory();
	signup = new Signup(accountRepository);
	getAccount = new GetAccount(accountRepository);
});

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute({
		accountId: outputSignup.accountId,
	});
	expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
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
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute({
		accountId: outputSignup.accountId,
	});
	expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
	expect(outputGetAccount.isDriver).toBe(input.isDriver);
	expect(outputGetAccount.carPlate).toBe(input.carPlate);
});

test("Deve retornar uma exception de 'cpf inválido'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "00000000000",
		isPassenger: true,
	};
	await expect(() => signup.execute(input)).rejects.toThrow(
		new Error("Invalid cpf")
	);
});

test("Deve retornar uma exception de 'e-mail inválido'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe0`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await expect(() => signup.execute(input)).rejects.toThrow(
		new Error("Invalid email")
	);
});

test("Deve retornar uma exception de 'nome inválido'", async function () {
	const input = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await expect(() => signup.execute(input)).rejects.toThrow(
		new Error("Invalid name")
	);
});

test("Deve retornar uma exception 'usuário existente'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe0.2769817215466577@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await signup.execute(input);
	await expect(() => signup.execute(input)).rejects.toThrow(
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
	await expect(() => signup.execute(input)).rejects.toThrow(
		new Error("Invalid car plate")
	);
});
