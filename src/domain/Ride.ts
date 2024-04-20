import crypto from "crypto";

export class Ride {
	private constructor(
		readonly rideId: string,
		readonly passengerId: string,
		readonly from: {
			latitude: number;
			longitude: number;
		},
		readonly to: {
			latitude: number;
			longitude: number;
		},
		readonly status: string,
		readonly date: Date
	) {}

	static create(
		passengerId: string,
		from: {
			latitude: number;
			longitude: number;
		},
		to: {
			latitude: number;
			longitude: number;
		}
	) {
		const rideId = crypto.randomUUID();
		const status = "requested";
		const date = new Date();
		return new Ride(rideId, passengerId, from, to, status, date);
	}

	static restore(
		rideId: string,
		passengerId: string,
		from: {
			latitude: number;
			longitude: number;
		},
		to: {
			latitude: number;
			longitude: number;
		},
		status: string,
		date: Date
	) {
		return new Ride(rideId, passengerId, from, to, status, date);
	}
}
