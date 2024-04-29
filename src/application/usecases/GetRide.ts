import { Uuid } from "../../domain/vo/Uuid";
import { RideRepository } from "../../infraestructure/repository/RideRepository";

export class GetRide {
	constructor(readonly rideRepository: RideRepository) {}

	async execute(params: { rideId: string }): Promise<Output> {
		const rideId = new Uuid(params.rideId);
		const ride = await this.rideRepository.getRide(rideId.getValue());
		if (!ride) throw new Error("Corrida não encontrada");
		return ride;
	}
}

type Output = {
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
	date: Date,
	driverId?: string | null
}