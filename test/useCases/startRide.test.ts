import { AccountDAOMemory } from "../../src/resources/AccountDAO";
import { RideDAOMemory } from "../../src/resources/RideDAO";
import { GetAccount } from "../../src/useCases/GetAccount";
import { Signup } from "../../src/useCases/Signup";
import { StartRide } from "../../src/useCases/StartRide";
import { GetRide } from "../../src/useCases/GetRide";

// Integration Test or Unit Test

let signup: Signup;
let getAccount: GetAccount;
let starRide: StartRide;
let getRide: GetRide;

beforeEach(async () => {
	const rideDAO = new RideDAOMemory();
	const accountDAO = new AccountDAOMemory();
	signup = new Signup(accountDAO);
	getAccount = new GetAccount(accountDAO);
	starRide = new StartRide(rideDAO, accountDAO);
	getRide = new GetRide(rideDAO);
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
	const inputStartRide = {
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
	const outputStartRide = await starRide.execute(inputStartRide);
	const { rideId } = outputStartRide;
	expect(rideId).toBeDefined();
	const outputGetRide = await getRide.execute(rideId);
	expect(outputGetRide.passengerId).toBe(inputStartRide.passengerId);
	expect(Number(outputGetRide.from.latitude)).toBe(
		inputStartRide.from.latitude
	);
	expect(Number(outputGetRide.from.longitude)).toBe(
		inputStartRide.from.longitude
	);
	expect(Number(outputGetRide.to.latitude)).toBe(inputStartRide.to.latitude);
	expect(Number(outputGetRide.to.longitude)).toBe(
		inputStartRide.to.longitude
	);
	expect(outputGetRide.status).toBe("requested");
	await expect(() => starRide.execute(inputStartRide)).rejects.toThrow(
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
	const inputStartRide = {
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
	await expect(() => starRide.execute(inputStartRide)).rejects.toThrow(
		new Error("Deve ser passageiro")
	);
});

test("Deve falhar ao tentar iniciar uma corrida de um passageiro inexistente", async () => {
	const inputStartRide = {
		passengerId: 'a361f271-81e1-4449-8fcd-df25a78cacde',
		from: {
			latitude: 123456,
			longitude: 654321,
		},
		to: {
			latitude: 123444,
			longitude: 654344,
		},
	};
	await expect(() => starRide.execute(inputStartRide)).rejects.toThrow(
		new Error("Passageiro não encontrado")
	);
});