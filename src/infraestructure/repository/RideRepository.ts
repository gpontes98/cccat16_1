import { Ride } from "../../domain/Ride";
import { DatabaseConnection } from "../database/DatabaseConnection";

export interface RideRepository {
	startRide(input: Ride): Promise<void>;
	getRide(rideId: string): Promise<Ride | undefined>;
	getStartedRidesByPassengerId(
		passengerId: string
	): Promise<Ride | undefined>;
}

export class RideRepositoryDatabase implements RideRepository {
	constructor(readonly connection: DatabaseConnection) {}

	async startRide(input: Ride): Promise<void> {
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
				ride.date
			);
		return undefined;
	}

	async getStartedRidesByPassengerId(
		passengerId: string
	): Promise<any | undefined> {
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
				ride.date
			);
		return undefined;
	}
}

export class RideRepositoryMemory implements RideRepository {
	rides: any[];

	constructor() {
		this.rides = [];
	}

	async getRide(rideId: string): Promise<any> {
		const ride = await this.rides.find(
			(ride: any) => ride.rideId === rideId
		);
		return ride;
	}

	async startRide(input: Ride): Promise<void> {
		this.rides.push(input);
	}

	async getStartedRidesByPassengerId(passengerId: string): Promise<any> {
		const ride = await this.rides.find(
			(ride: any) =>
				ride.passengerId === passengerId && ride.status === "requested"
		);
		return ride;
	}
}
