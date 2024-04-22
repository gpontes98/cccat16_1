import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
};

const URL_ACCOUNT = "http://localhost:3000/account";
const URL_RIDE = "http://localhost:3000/ride";

test("Deve criar um passageiro e solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	const responseSignup = await axios.post(URL_ACCOUNT, inputSignup);
	expect(responseSignup.status).toBe(200);
	const { accountId } = responseSignup.data;
	expect(accountId).toBeDefined();
	const inputRequestRide = {
		passengerId: accountId,
		from: {
			lat: 123456,
			long: 654321,
		},
		to: {
			lat: 123444,
			long: 654344,
		},
	};
	const responseRequestRide = await axios.post(URL_RIDE, inputRequestRide);
	const { rideId } = responseRequestRide.data;
	expect(rideId).toBeDefined();
	expect(responseRequestRide.status).toBe(200);
	const responseGetRide = await axios.get(`${URL_RIDE}/${rideId}`);
	expect(responseGetRide.status).toBe(200);
	const outputGetRide = responseGetRide.data;
	expect(outputGetRide.rideId).toBe(rideId);
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
});

test("Deve criar um passageiro e um motorista, então deve solicitar uma corrida, aceitar e iniciar a corrida", async function () {
	// Cadastro um passageiro
	const responsePassengerSignup = await axios.post(URL_ACCOUNT, {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	});
	// Cadastro um motorista
	const responseDriverSignup = await axios.post(URL_ACCOUNT, {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "EUC7107",
	});
	// Solicito corrida
	const responseRequestRide = await axios.post(URL_RIDE, {
		passengerId: responsePassengerSignup.data.accountId,
		from: {
			lat: 123456,
			long: 654321,
		},
		to: {
			lat: 123444,
			long: 654344,
		},
	});
	// Aceito a corrida
	const responseAcceptRide = await axios.put(URL_RIDE + "/accept", {
		rideId: responseRequestRide.data.rideId,
		driverId: responseDriverSignup.data.accountId,
	});
	const responseGetAcceptedRide = await axios.get(
		`${URL_RIDE}/${responseRequestRide.data.rideId}`
	);
	expect(responseGetAcceptedRide.data.status).toBe("accepted");
	expect(responseAcceptRide.status).toBe(200);
	// Inicio a corrida
	const responseStartRide = await axios.patch(
		URL_RIDE + "/start/" + responseRequestRide.data.rideId
	);
	expect(responseStartRide.status).toBe(200);
	const responseGetStartedRide = await axios.get(
		`${URL_RIDE}/${responseRequestRide.data.rideId}`
	);
	expect(responseGetStartedRide.data.status).toBe("in_progress");
});

test("Deve criar um motorista e retornar erro ao tentar iniciar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		isDriver: true,
		carPlate: "EUC7107",
	};
	const responseSignup = await axios.post(URL_ACCOUNT, inputSignup);
	expect(responseSignup.status).toBe(200);
	const { accountId } = responseSignup.data;
	expect(accountId).toBeDefined();
	const responseGetAccount = await axios.get(`${URL_ACCOUNT}/${accountId}`);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
	const inputRequestRide = {
		passengerId: accountId,
		from: {
			lat: 123456,
			long: 654321,
		},
		to: {
			lat: 123444,
			long: 654344,
		},
	};
	const responseRequestRide = await axios.post(URL_RIDE, inputRequestRide);
	expect(responseRequestRide.data.message).toBe("Deve ser passageiro");
	expect(responseRequestRide.status).toBe(422);
});
