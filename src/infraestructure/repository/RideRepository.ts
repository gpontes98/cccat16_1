import { Ride } from "../../domain/Ride";
import { DatabaseConnection } from "../database/DatabaseConnection";

export interface RideRepository {
	requestRide(input: Ride): Promise<void>;
	getRide(rideId: string): Promise<Ride | undefined>;
	getRequestedRidesByPassengerId(
		passengerId: string
	): Promise<Ride | undefined>;
	getAcceptedRidesByDriverId(passengerId: string): Promise<Ride | undefined>;
	updateStatusRide(
		rideId: string,
		status: string,
		driverId?: string
	): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
	constructor(readonly connection: DatabaseConnection) {}

	async requestRide(input: Ride): Promise<void> {
		await this.connection.query(
			"insert into cccat16.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date)  values ($1, $2, $3, $4, $5, $6, $7, $8)",
			[
				input.rideId,
				input.passengerId,
				input.status,
				input.from.latitude,
				input.from.longitude,
				input.to.latitude,
				input.to.longitude,
				input.date,
			]
		);
	}

	async getRide(rideId: string): Promise<Ride | undefined> {
		const [ride] = await this.connection.query(
			"select * from cccat16.ride where ride_id = $1",
			[rideId]
		);
		if (ride)
			return Ride.restore(
				ride.ride_id,
				ride.passenger_id,
				{
					latitude: ride.from_lat,
					longitude: ride.from_long,
				},
				{
					latitude: ride.to_lat,
					longitude: ride.to_long,
				},
				ride.status,
				ride.date,
				ride.driver_id
			);
		return undefined;
	}

	async getRequestedRidesByPassengerId(
		passengerId: string
	): Promise<Ride | undefined> {
		const [ride] = await this.connection.query(
			"select * from cccat16.ride where passenger_id = $1 and status = 'requested'",
			[passengerId]
		);
		if (ride)
			return Ride.restore(
				ride.ride_id,
				ride.passenger_id,
				{
					latitude: ride.from_lat,
					longitude: ride.from_long,
				},
				{
					latitude: ride.to_lat,
					longitude: ride.to_long,
				},
				ride.status,
				ride.date,
				ride.driver_id
			);
		return undefined;
	}
	async updateStatusRide(
		rideId: string,
		status: string,
		driverId?: string
	): Promise<void> {
		await this.connection.query(
			"UPDATE cccat16.ride SET status = $1, driver_id = $2 WHERE ride_id = $3",
			[status, driverId ?? null, rideId]
		);
	}

	async getAcceptedRidesByDriverId(
		driverId: string
	): Promise<Ride | undefined> {
		const [ride] = await this.connection.query(
			"SELECT * FROM cccat16.ride WHERE driver_id = $1",
			[driverId]
		);
		if (ride)
			return Ride.restore(
				ride.ride_id,
				ride.passenger_id,
				{
					latitude: ride.from_lat,
					longitude: ride.from_long,
				},
				{
					latitude: ride.to_lat,
					longitude: ride.to_long,
				},
				ride.status,
				ride.date,
				ride.driver_id
			);
		return undefined;
	}
}

export class RideRepositoryMemory implements RideRepository {
	rides: Ride[];

	constructor() {
		this.rides = [];
	}

	async getRide(rideId: string): Promise<any> {
		const ride = await this.rides.find(
			(ride: Ride) => ride.rideId === rideId
		);
		return ride;
	}

	async requestRide(input: Ride): Promise<void> {
		this.rides.push(input);
	}

	async getRequestedRidesByPassengerId(passengerId: string): Promise<any> {
		const ride = this.rides.find(
			(ride: Ride) =>
				ride.passengerId === passengerId && ride.status === "requested"
		);
		return ride;
	}

	async updateStatusRide(
		rideId: string,
		status: string,
		driverId: string
	): Promise<void> {
		const index = this.rides.findIndex((ride) => ride.rideId === rideId);
		if (index !== -1) {
			this.rides[index] = {
				...this.rides[index],
				status,
				driverId: driverId ?? this.rides[index].driverId,
			};
		}
	}

	async getAcceptedRidesByDriverId(
		driverId: string
	): Promise<Ride | undefined> {
		const ride = this.rides.find(
			(ride) => ride.driverId === driverId && ride.status === "accepted"
		);
		return ride;
	}
}
