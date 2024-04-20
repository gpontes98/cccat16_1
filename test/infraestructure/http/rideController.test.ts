import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
};

const URL_ACCOUNT = "http://localhost:3000/account";
const URL_RIDE = "http://localhost:3000/ride";

test("Deve criar um passageiro e iniciar uma corrida", async function () {
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
	const inputStartRide = {
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
	const responseStartRide = await axios.post(URL_RIDE, inputStartRide);
	const { rideId } = responseStartRide.data;
	expect(rideId).toBeDefined();
	expect(responseStartRide.status).toBe(200);
	const responseGetRide = await axios.get(`${URL_RIDE}/${rideId}`);
	expect(responseGetRide.status).toBe(200);
	const outputGetRide = responseGetRide.data;
	expect(outputGetRide.rideId).toBe(rideId);
	expect(outputGetRide.passengerId).toBe(inputStartRide.passengerId);
});

test("Deve criar um motorista e tentar iniciar uma corrida", async function () {
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
	const inputStartRide = {
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
	const responseStartRide = await axios.post(URL_RIDE, inputStartRide);
	expect(responseStartRide.data.message).toBe("Deve ser passageiro");
	expect(responseStartRide.status).toBe(422);
});
