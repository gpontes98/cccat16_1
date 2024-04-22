import { AcceptRide } from "../../../src/application/usecases/AcceptRide";
import { GetAccount } from "../../../src/application/usecases/GetAccount";
import { GetRide } from "../../../src/application/usecases/GetRide";
import { RequestRide } from "../../../src/application/usecases/RequestRide";
import { Signup } from "../../../src/application/usecases/Signup";
import { AccountRepositoryMemory } from "../../../src/infraestructure/repository/AccountRepository";
import { RideRepositoryMemory } from "../../../src/infraestructure/repository/RideRepository";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;

beforeEach(async () => {
	const rideRepository = new RideRepositoryMemory();
	const accountRepository = new AccountRepositoryMemory();
	signup = new Signup(accountRepository);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideRepository, accountRepository);
	acceptRide = new AcceptRide(rideRepository, accountRepository);
	getRide = new GetRide(rideRepository);
});

test("O motorista deve aceitar uma corrida", async () => {
	// Cadastro um passageiro
	const inputPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputPassenger = await signup.execute(inputPassenger);
	// Cadastro um motorista
	const inputDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "EUC7107",
	};
	const outputDriver = await signup.execute(inputDriver);
	// Solicito uma corrida
	const inputRequestRide = {
		passengerId: outputPassenger.accountId,
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
	// Aceito uma corrida
	await acceptRide.execute({
		rideId,
		driverId: outputDriver.accountId,
	});
	const outputGetRide = await getRide.execute({ rideId });
	expect(outputGetRide.status).toBe("accepted");
	expect(outputGetRide.driverId).toBe(outputDriver.accountId);
});

test("Deve validar o account_id tem is_driver true", async () => {
	// Cadastro um passageiro
	const inputPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputPassenger = await signup.execute(inputPassenger);
	// Solicito uma corrida
	const inputRequestRide = {
		passengerId: outputPassenger.accountId,
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
	// Aceito uma corrida usando o id do passageiro
	await expect(() =>
		acceptRide.execute({
			rideId,
			driverId: outputPassenger.accountId,
		})
	).rejects.toThrow(new Error("Passageiro não pode aceitar corrida"));
});

test("Deve retornar erro ao aceitar uma corrida duas vezes", async () => {
	// Cadastro um passageiro
	const inputPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputPassenger = await signup.execute(inputPassenger);
	// Cadastro um motorista
	const inputDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "EUC7107",
	};
	const outputDriver = await signup.execute(inputDriver);
	// Solicito uma corrida
	const inputRequestRide = {
		passengerId: outputPassenger.accountId,
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
	// Aceito uma corrida
	await acceptRide.execute({
		rideId,
		driverId: outputDriver.accountId,
	});
	// Aceito novamente
	await expect(() =>
		acceptRide.execute({
			rideId,
			driverId: outputDriver.accountId,
		})
	).rejects.toThrow(new Error("A corrida já foi iniciada"));
});

test("o motorista não pode ter uma corrida com status accepted ou inprogress", async () => {
	// Cadastro um passageiro
	const inputPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputPassenger = await signup.execute(inputPassenger);
	// Cadastro um motorista
	const inputDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "EUC7107",
	};
	const outputDriver = await signup.execute(inputDriver);
	// Solicito uma corrida
	const inputRequestRide = {
		passengerId: outputPassenger.accountId,
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
	// Aceito uma corrida
	await acceptRide.execute({
		rideId,
		driverId: outputDriver.accountId,
	});

	// Cadastro o segundo passageiro passageiro
	const inputSecondPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const outputSecondPassenger = await signup.execute(inputSecondPassenger);
	// Solicito uma segunda corrida
	const inputRequestSecondRide = {
		passengerId: outputSecondPassenger.accountId,
		from: {
			latitude: 123456,
			longitude: 654321,
		},
		to: {
			latitude: 123444,
			longitude: 654344,
		},
	};
	const outputRequestSecondRide = await requestRide.execute(
		inputRequestSecondRide
	);

	// Aceito novamente
	await expect(() =>
		acceptRide.execute({
			rideId: outputRequestSecondRide.rideId,
			driverId: outputDriver.accountId,
		})
	).rejects.toThrow(new Error("Motorista não pode aceitar duas corridas"));
});
