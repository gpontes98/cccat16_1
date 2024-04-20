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
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Deve retornar 'conta não encontrada' quando não encontrar um usuário", async function () {
	await expect(() =>
		getAccount.execute({
			accountId: "2a38a02a-366f-41bc-a299-8c009bf31f21",
		})
	).rejects.toThrow(new Error("Usuário não encontrado"));
});

test("Deve retornar 'UUID inválido' passando um accountId inválido", async function () {
	await expect(() =>
		getAccount.execute({ accountId: "f31f21" })
	).rejects.toThrow(new Error("UUID inválido"));
});
