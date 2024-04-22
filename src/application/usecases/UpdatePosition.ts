import crypto from "crypto";
import { RideRepository } from "../../infraestructure/repository/RideRepository";
import { RidePositionRepository } from "../../infraestructure/repository/RidePositionRepository";

export class UpdatePosition {
	constructor(
		readonly rideRepository: RideRepository,
		readonly ridePositionRepository: RidePositionRepository
	) {}

	async execute(params: any) {
		const positionId = crypto.randomUUID();
		const rideInfo = await this.rideRepository.getRide(params.rideId);
		if (!rideInfo) throw new Error("Corrida não encontrada");
		if (rideInfo.status !== "in_progress")
			throw new Error("A corrida precisa ter status in_progress");
		const input = {
			positionId,
			rideId: params.rideId,
			lat: params.lat,
			long: params.long,
			date: new Date(),
		};
		await this.ridePositionRepository.updatePosition(input);
	}
}
