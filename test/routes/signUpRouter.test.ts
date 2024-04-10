import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
};

const URL = "http://localhost:3000/signup";

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const responseSignup = await axios.post(URL, input);
	expect(responseSignup.status).toBe(201);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	const responseGetAccount = await axios.get(
		`http://localhost:3000/getaccount/${outputSignup.accountId}`
	);
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
	const response = await axios.post(URL, input);
	expect(response.status).toBe(500);
	const outputSignup = response.data;
	expect(outputSignup.error).toBe("Usuário já existe");
	expect(response.status).toBe(500);
});

