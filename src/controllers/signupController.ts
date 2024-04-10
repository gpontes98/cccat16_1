import { Request, Response } from "express";
import { Signup } from "../useCases/Signup";
import { AccountDAODatabase } from "../resources/AccountDAO";

async function signupController(req: Request, res: Response) {
	try {
		const { email, name, cpf, carPlate, isPassenger, isDriver } = req.body;
		const accountDAO = new AccountDAODatabase();
		const signup = new Signup(accountDAO);
		const result = await signup.execute({
			email,
			name,
			cpf,
			carPlate,
			isPassenger,
			isDriver,
		});
		res.status(201).json(result);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export { signupController };
