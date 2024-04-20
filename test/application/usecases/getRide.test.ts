import { RideRepositoryMemory } from "../../../src/infraestructure/repository/RideRepository";
import { GetRide } from "../../../src/application/usecases/GetRide";

let getRide: GetRide;

beforeEach(async () => {
	const rideRepository = new RideRepositoryMemory();
	getRide = new GetRide(rideRepository);
});

test("Deve passar um UUID inválido como parametro de rideId", async function () {
	await expect(() => getRide.execute({ rideId: "123456" })).rejects.toThrow(
		new Error("UUID inválido")
	);
});

test("Deve buscar uma corrida inexistente", async function () {
	await expect(() =>
		getRide.execute({ rideId: "dcc3c14b-cc6c-4994-9c2e-52a8f2bdaec7" })
	).rejects.toThrow(new Error("Corrida não encontrada"));
});
