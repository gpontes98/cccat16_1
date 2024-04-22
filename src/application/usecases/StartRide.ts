import { RideRepository } from "../../infraestructure/repository/RideRepository";

export class StartRide {
	constructor(readonly rideRepository: RideRepository) {}

	async execute(params: any) {
		const rideInfo = await this.rideRepository.getRide(params.rideId);
		if (!rideInfo) throw new Error("Corrida não encontrada");
		if (rideInfo.status !== "accepted")
			throw new Error("A corrida não pode ser iniciada no status atual");
		await this.rideRepository.updateStatusRide(
			params.rideId,
			"in_progress"
		);
	}
}
