import crypto from "crypto";
import { RideRepositoryDatabase } from "../../../src/infraestructure/repository/RideRepository";
import { PgPromiseAdapter } from "../../../src/infraestructure/database/DatabaseConnection";
import { Ride } from "../../../src/domain/Ride";

// Integration Test
test("Deve salvar um registro na tabela ride e consultar por id", async function () {
	const ride: Ride = {
		rideId: crypto.randomUUID(),
		passengerId: crypto.randomUUID(),
		status: "requested",
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
	const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	await rideRepository.startRide(ride);
	const rideById = await rideRepository.getRide(ride.rideId);
	expect(rideById).toBeDefined();
	expect(rideById?.rideId).toBe(ride.rideId);
	expect(rideById?.passengerId).toBe(ride.passengerId);
	expect(rideById?.status).toBe(ride.status);
	expect(Number(rideById?.from.latitude)).toBe(ride.from.latitude);
	expect(Number(rideById?.from.longitude)).toBe(ride.from.longitude);
	expect(Number(rideById?.to.latitude)).toBe(ride.to.latitude);
	expect(Number(rideById?.to.longitude)).toBe(ride.to.longitude);
	expect(new Date(rideById?.date || "")).toEqual(ride.date);
	await rideRepository.connection.close();
});

test("Deve salvar um registro na tabela ride e pegar corrida iniciada", async function () {
	const ride: Ride = {
		rideId: crypto.randomUUID(),
		passengerId: crypto.randomUUID(),
		status: "requested",
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
	const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	await rideRepository.startRide(ride);
	const rideById = await rideRepository.getStartedRidesByPassengerId(
		ride.passengerId
	);
	expect(rideById.rideId).toBe(ride.rideId);
	expect(rideById.passengerId).toBe(ride.passengerId);
	expect(rideById.status).toBe(ride.status);
	expect(Number(rideById.from.latitude)).toBe(ride.from.latitude);
	expect(Number(rideById.from.longitude)).toBe(ride.from.longitude);
	expect(Number(rideById.to.latitude)).toBe(ride.to.latitude);
	expect(Number(rideById.to.longitude)).toBe(ride.to.longitude);
	expect(new Date(rideById.date)).toEqual(ride.date);
	await rideRepository.connection.close();
});
