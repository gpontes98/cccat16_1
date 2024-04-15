import crypto from "crypto";

import { StartRideInputDTO } from "../DTOs/StartRide";
import { RideDAO } from "../resources/RideDAO";
import { AccountDAO } from "../resources/AccountDAO";

export interface StartRidePros {
	passengerId: string;
	from: {
		latitude: number;
		longitude: number;
	};
	to: {
		latitude: number;
		longitude: number;
	};
}

export class StartRide {
	constructor(readonly rideDAO: RideDAO, readonly accountDAO: AccountDAO) {}

	async execute({ passengerId, from, to }: StartRidePros) {
		const passengerInfo = await this.accountDAO.getAccountById(passengerId);
		if(!passengerInfo) throw new Error("Passageiro não encontrado");
		
		if (
			passengerInfo.is_passenger === false ||
			passengerInfo.isPassenger === false
		)
			throw new Error("Deve ser passageiro");
		const isStartedRide = await this.rideDAO.getStartedRidesByPassengerId(
			passengerId
		);
		if (isStartedRide) throw new Error("Corrida já iniciada");
		const rideId = crypto.randomUUID();
		const startRideArgs: StartRideInputDTO = {
			rideId,
			passengerId: passengerId,
			driverId: null,
			status: "requested",
			fare: 1,
			distance: 10,
			from,
			to,
			date: new Date(),
		};
		await this.rideDAO.startRide(startRideArgs);
		return { rideId };
	}
}
