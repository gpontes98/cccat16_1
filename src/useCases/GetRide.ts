import { RideDAO } from "../resources/RideDAO";
import { validateUUID } from "../validations/validateUUID";

export class GetRide {
	constructor(readonly rideDAO: RideDAO) {}

	async execute(rideId: string) {
		if (!validateUUID(rideId)) throw new Error("UUID inválido");
		const ride = await this.rideDAO.getRide(rideId);
		if (!ride) throw new Error("Corrida não encontrada");
		return ride;
	}
}
