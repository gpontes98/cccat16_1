import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
};

const URL = "http://localhost:3000/getaccount/";

test("Deve retornar 'conta não encontrada' quando não encontrar um usuário", async function () {
    const output = await axios.get(URL + "2a38a02a-366f-41bc-a299-8c009bf31f21");
	expect(output.status).toBe(500);
	expect(output.data.error).toBe("Usuário não encontrado");
});
