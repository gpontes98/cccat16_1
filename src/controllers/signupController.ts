import { Request, Response } from "express";

import { signup } from "../useCases/signup";

async function signupController(req: Request, res: Response) {
	try {
		const { email, name, cpf, carPlate, isPassenger, isDriver } = req.body;
		const accountId = await signup({
			email,
			name,
			cpf,
			carPlate,
			isPassenger,
			isDriver,
		});
		res.status(201).json({ accountId });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export { signupController };
