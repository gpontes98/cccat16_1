import pgp from "pg-promise";
import * as dotenv from "dotenv";
import { validateUUID } from "../validations/validateUUID";

interface GetaccountProps {
	accountId: string;
}

dotenv.config();

export async function getAccount({ accountId }: GetaccountProps) {
	const connection = pgp()(
		`postgres://postgres:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
	);
	try {
		if (!validateUUID(accountId)) throw new Error("UUID inválido");
		const [account] = await connection.query(
			"select * from cccat16.account where account_id = $1",
			[accountId]
		);
		if (!account) throw new Error("Usuário não encontrado");
		return account;
	} finally {
		await connection.$pool.end();
	}
}
