import pgp from "pg-promise";
import * as dotenv from "dotenv";
import { StartRideInputDTO } from "../DTOs/StartRide";
dotenv.config();

export interface RideDAO {
	startRide(input: StartRideInputDTO): Promise<void>;
	getRide(rideId: string): Promise<any>;
	getStartedRidesByPassengerId(passengerId: string): Promise<any>;
}

const CONNECTION_STRING = `postgres://postgres:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export class RideDAODatabase implements RideDAO {
	async startRide({
		rideId,
		passengerId,
		driverId,
		status,
		fare,
		distance,
		from,
		to,
		date,
	}: StartRideInputDTO): Promise<void> {
		const connection = pgp()(CONNECTION_STRING);
		await connection.query(
			"insert into cccat16.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date)  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
			[
				rideId,
				passengerId,
				driverId,
				status,
				fare,
				distance,
				from.latitude,
				from.longitude,
				to.latitude,
				to.longitude,
				date,
			]
		);
		await connection.$pool.end();
	}

	async getRide(rideId: string): Promise<any> {
		const connection = pgp()(CONNECTION_STRING);
		const [ride] = await connection.query(
			"select * from cccat16.ride where ride_id = $1",
			[rideId]
		);
		await connection.$pool.end();
		return ride;
	}

	async getStartedRidesByPassengerId(passengerId: string): Promise<any> {
		const connection = pgp()(CONNECTION_STRING);
		const [ride] = await connection.query(
			"select * from cccat16.ride where passenger_id = $1 and status = 'requested'",
			[passengerId]
		);
		await connection.$pool.end();
		return ride;
	}
}

export class RideDAOMemory implements RideDAO {
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

	async startRide(input: StartRideInputDTO): Promise<void> {
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
