import { validateUUID } from "../validations/validateUUID";
import { AccountDAO } from "../resources/AccountDAO";

interface GetaccountProps {
	accountId: string;
}

export class GetAccount {
	constructor(readonly accountDAO: AccountDAO) {}

	async execute({ accountId }: GetaccountProps): Promise<any> {
		if (!validateUUID(accountId)) throw new Error("UUID inválido");
		const account = await this.accountDAO.getAccountById(accountId);
		if (!account) throw new Error("Usuário não encontrado");
		return account;
	}
}
