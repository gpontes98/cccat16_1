import { RideRepository } from "../../infraestructure/repository/RideRepository";
import { RidePositionRepository } from "../../infraestructure/repository/RidePositionRepository";
import Position from "../../domain/entity/Position";

export class UpdatePosition {
	constructor(
		readonly rideRepository: RideRepository,
		readonly ridePositionRepository: RidePositionRepository
	) {}

	async execute(params: any) {
		const rideInfo = await this.rideRepository.getRide(params.rideId);
		if (!rideInfo) throw new Error("Corrida não encontrada");
		if (rideInfo.status !== "in_progress")
			throw new Error("A corrida precisa ter status in_progress");

		const position = Position.create(
			params.rideId,
			params.lat,
			params.long
		);
		await this.ridePositionRepository.updatePosition(position);
	}
}
