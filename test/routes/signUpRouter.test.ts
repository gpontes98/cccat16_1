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
	const output = await axios.post(URL, input);
	expect(output.status).toBe(201);
});

test("Deve retornar uma exception de 'cpf inválido'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "00000000000",
		isPassenger: true,
	};
	const output = await axios.post(URL, input);
	expect(output.data.error).toBe("CPF inválido");
	expect(output.status).toBe(500);
});

test("Deve retornar uma exception de 'e-mail inválido'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe0`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const output = await axios.post(URL, input);
	expect(output.data.error).toBe("Email inválido");
	expect(output.status).toBe(500);
});

test("Deve retornar uma exception de 'nome inválido'", async function () {
	const input = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const output = await axios.post(URL, input);
	expect(output.data.error).toBe("Nome inválido");
	expect(output.status).toBe(500);
});

test("Deve retornar uma exception 'usuário existente'", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe0.2769817215466577@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const output = await axios.post(URL, input);
	expect(output.data.error).toBe("Usuário já existe");
	expect(output.status).toBe(500);
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
	const output = await axios.post(URL, input);
	expect(output.status).toBe(201);
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
	const output = await axios.post(URL, input);
	expect(output.data.error).toBe("Placa do veículo inválida");
	expect(output.status).toBe(500);
});

