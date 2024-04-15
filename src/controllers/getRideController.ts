import { Request, Response } from "express";
import { GetRide } from "../useCases/GetRide";
import { RideDAODatabase } from "../resources/RideDAO";

async function getRideController(req: Request, res: Response) {
	try {
		const { rideId } = req.params;
		const rideDAO = new RideDAODatabase();
		const getRide = new GetRide(rideDAO);
		const result = await getRide.execute(rideId);
		res.status(200).json(result);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export { getRideController };
