import { RideRepository } from "../../infraestructure/repository/RideRepository";
import { validateUUID } from "../../domain/validations/validateUUID";

export class GetRide {
	constructor(readonly rideRepository: RideRepository) {}

	async execute(params: { rideId: string }) {
		if (!validateUUID(params.rideId)) throw new Error("UUID inválido");
		const ride = await this.rideRepository.getRide(params.rideId);
		if (!ride) throw new Error("Corrida não encontrada");
		return ride;
	}
}
