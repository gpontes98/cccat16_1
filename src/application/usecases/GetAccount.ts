import { AccountRepository } from "../../infraestructure/repository/AccountRepository";
import { validateUUID } from "../../domain/validations/validateUUID";

export class GetAccount {
	constructor(readonly accountRepository: AccountRepository) {}

	async execute(params: { accountId: string }): Promise<any> {
		if (!validateUUID(params.accountId)) throw new Error("UUID inválido");
		const account = await this.accountRepository.getAccountById(
			params.accountId
		);
		if (!account) throw new Error("Usuário não encontrado");
		return account;
	}
}
