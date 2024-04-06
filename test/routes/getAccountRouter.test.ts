import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
};

const URL = "http://localhost:3000/getaccount/";

test("Deve retornar a conta correta passando um id válido", async function () {
    const output = await axios.get(URL + "2a38a02a-366f-41bc-a299-8c009bf31f60");
	expect(output.status).toBe(200);
	expect(output.data).toEqual({
		account_id: "2a38a02a-366f-41bc-a299-8c009bf31f60",
		name: "John Doe",
		email: "john.doe0.2769817215466577@gmail.com",
		cpf: "87748248800",
		car_plate: null,
		is_passenger: true,
		is_driver: false,
	});
});

test("Deve retornar 'conta não encontrada' quando não encontrar um usuário", async function () {
    const output = await axios.get(URL + "2a38a02a-366f-41bc-a299-8c009bf31f21");
	expect(output.status).toBe(500);
	expect(output.data.error).toBe("Usuário não encontrado");
});

test("Deve retornar 'UUID inválido' passando um accountId inválido", async function () {
    const output = await axios.get(URL + "123456");
	expect(output.status).toBe(500);
	expect(output.data.error).toBe("UUID inválido");
});
