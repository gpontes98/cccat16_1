import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
};

const URL_ACCOUNT = "http://localhost:3000/account";

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const responseSignup = await axios.post(URL_ACCOUNT, input);
	expect(responseSignup.status).toBe(200);
	const { accountId } = responseSignup.data;
	expect(accountId).toBeDefined();
	const responseGetAccount = await axios.get(`${URL_ACCOUNT}/${accountId}`);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Deve retornar uma exception 'usuário existente'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe0.2769817215466577@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const response = await axios.post(URL_ACCOUNT, input);
	const outputSignup = response.data;
	expect(outputSignup.message).toBe("Usuário já existe");
	expect(response.status).toBe(422);
});

test("Deve retornar 'conta não encontrada' quando não encontrar um usuário", async function () {
	const output = await axios.get(
		`${URL_ACCOUNT}/2a38a02a-366f-41bc-a299-8c009bf31f21`
	);
	expect(output.data.message).toBe("Usuário não encontrado");
});
