import crypto from "crypto";
import { RideDAODatabase } from "../../src/resources/RideDAO";

// Integration Test
test("Deve salvar um registro na tabela ride e consultar por id", async function () {
	const ride = {
		rideId: crypto.randomUUID(),
		passengerId: crypto.randomUUID(),
		driverId: null,
		status: "requested",
		fare: 1,
		distance: 10,
		from: {
			latitude: 123456,
			longitude: 123455,
		},
		to: {
			latitude: 654321,
			longitude: 654322,
		},
		date: new Date(),
	};

	const rideDAO = new RideDAODatabase();
	await rideDAO.startRide(ride);
	const rideById = await rideDAO.getRide(ride.rideId);
	expect(rideById.ride_id).toBe(ride.rideId);
	expect(rideById.passenger_id).toBe(ride.passengerId);
	expect(rideById.driver_id).toBe(ride.driverId);
	expect(rideById.status).toBe(ride.status);
	expect(Number(rideById.fare)).toBe(ride.fare);
	expect(Number(rideById.distance)).toBe(ride.distance);
	expect(Number(rideById.from_lat)).toBe(ride.from.latitude);
	expect(Number(rideById.from_long)).toBe(ride.from.longitude);
	expect(Number(rideById.to_lat)).toBe(ride.to.latitude);
	expect(Number(rideById.to_long)).toBe(ride.to.longitude);
	expect(new Date(rideById.date)).toEqual(ride.date);
});

test("Deve salvar um registro na tabela ride e pegar corrida iniciada", async function () {
	const ride = {
		rideId: crypto.randomUUID(),
		passengerId: crypto.randomUUID(),
		driverId: null,
		status: "requested",
		fare: 1,
		distance: 10,
		from: {
			latitude: 123456,
			longitude: 123455,
		},
		to: {
			latitude: 654321,
			longitude: 654322,
		},
		date: new Date(),
	};

	const rideDAO = new RideDAODatabase();
	await rideDAO.startRide(ride);
	const rideById = await rideDAO.getStartedRidesByPassengerId(
		ride.passengerId
	);
	expect(rideById.ride_id).toBe(ride.rideId);
	expect(rideById.passenger_id).toBe(ride.passengerId);
	expect(rideById.driver_id).toBe(ride.driverId);
	expect(rideById.status).toBe(ride.status);
	expect(Number(rideById.fare)).toBe(ride.fare);
	expect(Number(rideById.distance)).toBe(ride.distance);
	expect(Number(rideById.from_lat)).toBe(ride.from.latitude);
	expect(Number(rideById.from_long)).toBe(ride.from.longitude);
	expect(Number(rideById.to_lat)).toBe(ride.to.latitude);
	expect(Number(rideById.to_long)).toBe(ride.to.longitude);
	expect(new Date(rideById.date)).toEqual(ride.date);
});
