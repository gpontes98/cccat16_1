import { GetAccount } from "../../../src/application/usecases/GetAccount";
import { Signup } from "../../../src/application/usecases/Signup";
import { RequestRide } from "../../../src/application/usecases/RequestRide";
import { GetRide } from "../../../src/application/usecases/GetRide";
import { AccountRepositoryMemory } from "../../../src/infraestructure/repository/AccountRepository";
import { RideRepositoryMemory } from "../../../src/infraestructure/repository/RideRepository";

// Integration Test or Unit Test

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(async () => {
	const rideRepository = new RideRepositoryMemory();
	const accountRepository = new AccountRepositoryMemory();
	signup = new Signup(accountRepository);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideRepository, accountRepository);
	getRide = new GetRide(rideRepository);
});

test("Deve criar um passageiro, iniciar uma corrida, verificar se a corrida está com status 'requested', tentar iniciar uma nova corrida para o mesmo passageiro e falhar", async () => {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			latitude: 123456,
			longitude: 654321,
		},
		to: {
			latitude: 123444,
			longitude: 654344,
		},
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const { rideId } = outputRequestRide;
	expect(rideId).toBeDefined();
	const outputGetRide = await getRide.execute({ rideId });
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(Number(outputGetRide.from.latitude)).toBe(
		inputRequestRide.from.latitude
	);
	expect(Number(outputGetRide.from.longitude)).toBe(
		inputRequestRide.from.longitude
	);
	expect(Number(outputGetRide.to.latitude)).toBe(inputRequestRide.to.latitude);
	expect(Number(outputGetRide.to.longitude)).toBe(
		inputRequestRide.to.longitude
	);
	expect(outputGetRide.status).toBe("requested");
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
		new Error("Corrida já iniciada")
	);
});

test("Deve criar um motorista, iniciar uma corrida e falhar", async () => {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "EUC7107",
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			latitude: 123456,
			longitude: 654321,
		},
		to: {
			latitude: 123444,
			longitude: 654344,
		},
	};
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
		new Error("Deve ser passageiro")
	);
});

test("Deve falhar ao tentar iniciar uma corrida de um passageiro inexistente", async () => {
	const inputRequestRide = {
		passengerId: "a361f271-81e1-4449-8fcd-df25a78cacde",
		from: {
			latitude: 123456,
			longitude: 654321,
		},
		to: {
			latitude: 123444,
			longitude: 654344,
		},
	};
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
		new Error("Passageiro não encontrado")
	);
});
