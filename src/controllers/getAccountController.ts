import { Request, Response } from "express";
import { getAccount } from "../useCases/getAccount";

async function getAccountController(req: Request, res: Response) {
	try {
		const { accountId } = req.params;

		if (!accountId) {
			res.status(400).json({});
		}

		const result = await getAccount({ accountId });

		res.status(200).json(result);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export { getAccountController };
