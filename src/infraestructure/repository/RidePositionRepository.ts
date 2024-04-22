import { DatabaseConnection } from "../database/DatabaseConnection";

export interface RidePositionRepository {
	updatePosition(input: {
		positionId: string;
		rideId: string;
		lat: number;
		long: number;
		date: Date;
	}): Promise<void>;
}

export class RidePositionRepositoryDatabase implements RidePositionRepository {
	constructor(readonly connection: DatabaseConnection) {}

	async updatePosition(input: {
		positionId: string;
		rideId: string;
		lat: number;
		long: number;
		date: Date;
	}): Promise<void> {
		await this.connection.query(
			"INSERT INTO cccat16.position (position_id, ride_id, lat, long, date) VALUES ($1, $2, $3, $4, $5)",
			[input.positionId, input.rideId, input.lat, input.long, input.date]
		);
	}
}

export class RidePositionRepositoryMemory implements RidePositionRepository {
	positions: any[];

	constructor() {
		this.positions = [];
	}

	async updatePosition(input: {
		positionId: string;
		rideId: string;
		lat: number;
		long: number;
		date: Date;
	}): Promise<void> {
		this.positions.push(input);
	}
}
