import { Request, Response } from "express";
import { RideDAODatabase } from "../resources/RideDAO";
import { AccountDAODatabase } from "../resources/AccountDAO";
import { StartRide, StartRidePros } from "../useCases/StartRide";

async function startRideController(req: Request, res: Response) {
	try {
		const params: StartRidePros = {
			passengerId: req.body.passengerId,
			from: {
				latitude: req.body.from.latitude,
				longitude: req.body.from.longitude,
			},
			to: {
				latitude: req.body.to.latitude,
				longitude: req.body.to.longitude,
			},
		};
		const rideDAO = new RideDAODatabase();
		const accountDAO = new AccountDAODatabase();
		const startRide = new StartRide(rideDAO, accountDAO);
		const output = await startRide.execute(params);
		res.status(201).json(output);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export { startRideController };
