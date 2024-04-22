import { AccountRepository } from "../../infraestructure/repository/AccountRepository";
import { RideRepository } from "../../infraestructure/repository/RideRepository";

export class AcceptRide {
	constructor(
		readonly rideRepository: RideRepository,
		readonly accountRepository: AccountRepository
	) {}

	async execute(params: any) {
		const driverInfo = await this.accountRepository.getAccountById(
			params.driverId
		);
		if (!driverInfo) throw new Error("Motorista não encontrado");
		if (!driverInfo.isDriver)
			throw new Error("Passageiro não pode aceitar corrida");
		const rideInfo = await this.rideRepository.getRide(params.rideId);
		if (rideInfo?.status !== "requested")
			throw new Error("A corrida já foi iniciada");
		const isDriverInRide =
			await this.rideRepository.getAcceptedRidesByDriverId(
				params.driverId
			);
		if (isDriverInRide)
			throw new Error("Motorista não pode aceitar duas corridas");
		await this.rideRepository.updateStatusRide(
			params.rideId,
			"accepted",
			params.driverId
		);
	}
}
