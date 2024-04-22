import { AcceptRide } from "../../../src/application/usecases/AcceptRide";
import { GetAccount } from "../../../src/application/usecases/GetAccount";
import { GetRide } from "../../../src/application/usecases/GetRide";
import { RequestRide } from "../../../src/application/usecases/RequestRide";
import { Signup } from "../../../src/application/usecases/Signup";
import { StartRide } from "../../../src/application/usecases/StartRide";
import { AccountRepositoryMemory } from "../../../src/infraestructure/repository/AccountRepository";
import { RideRepositoryMemory } from "../../../src/infraestructure/repository/RideRepository";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;
let startRide: StartRide;

beforeEach(async () => {
	const rideRepository = new RideRepositoryMemory();
	const accountRepository = new AccountRepositoryMemory();
	signup = new Signup(accountRepository);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideRepository, accountRepository);
	acceptRide = new AcceptRide(rideRepository, accountRepository);
	getRide = new GetRide(rideRepository);
	startRide = new StartRide(rideRepository);
});

test("Criar uma corrida e mudar o status para in_progress", async () => {
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
	// Aceito a corrida
	await acceptRide.execute({
		rideId,
		driverId: outputDriver.accountId,
	});
	// Inicio a corrida
	await startRide.execute({
		rideId,
	});
	const outputGetRide = await getRide.execute({ rideId });
	expect(outputGetRide.status).toBe("in_progress");
	// Startar novamente a corrida
	await expect(() =>
		startRide.execute({
			rideId,
		})
	).rejects.toThrow(
		new Error("A corrida não pode ser iniciada no status atual")
	);
});
