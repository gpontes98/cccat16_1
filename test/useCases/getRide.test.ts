import { RideDAOMemory } from "../../src/resources/RideDAO";
import { GetRide } from "../../src/useCases/GetRide";

let getRide: GetRide;

beforeEach(async () => {
	const rideDAO = new RideDAOMemory();
	getRide = new GetRide(rideDAO);
});

test("Deve passar um UUID inválido como parametro de rideId", async function () {
	await expect(() => getRide.execute("123456")).rejects.toThrow(
		new Error("UUID inválido")
	);
});

test("Deve buscar uma corrida inexistente", async function () {
    await expect(() => getRide.execute("dcc3c14b-cc6c-4994-9c2e-52a8f2bdaec7")).rejects.toThrow(
        new Error("Corrida não encontrada")
    );
});

