import { Request, Response } from "express";
import { GetAccount } from "../useCases/GetAccount";
import { AccountDAODatabase } from "../resources/AccountDAO";

async function getAccountController(req: Request, res: Response) {
	try {
		const { accountId } = req.params;
		if (!accountId) res.status(400).json({});
		const accountDAO = new AccountDAODatabase();
		const getAccount = new GetAccount(accountDAO);
		const result = await getAccount.execute({ accountId });
		res.status(200).json(result);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}

export { getAccountController };
