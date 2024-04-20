import { AccountRepository } from "../../infraestructure/repository/AccountRepository";
import { RideRepository } from "../../infraestructure/repository/RideRepository";
import { Ride } from "../../domain/Ride";

export class StartRide {
	constructor(
		readonly rideRepository: RideRepository,
		readonly accountRepository: AccountRepository
	) {}

	async execute(params: any) {
		const passengerInfo = await this.accountRepository.getAccountById(
			params.passengerId
		);
		if (!passengerInfo) throw new Error("Passageiro não encontrado");
		if (passengerInfo.isPassenger === false)
			throw new Error("Deve ser passageiro");
		const isStartedRide =
			await this.rideRepository.getStartedRidesByPassengerId(
				params.passengerId
			);
		if (isStartedRide) throw new Error("Corrida já iniciada");
		const ride = Ride.create(params.passengerId, params.from, params.to);
		await this.rideRepository.startRide(ride);
		return { rideId: ride.rideId };
	}
}
