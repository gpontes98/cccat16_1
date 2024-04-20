import { AccountRepository } from "../../infraestructure/repository/AccountRepository";
import { Account } from "../../domain/Account";

export class Signup {
	constructor(readonly accountRepository: AccountRepository) {}

	async execute(params: any) {
		const existingAccount = await this.accountRepository.getAccountByEmail(
			params.email
		);
		if (existingAccount) throw new Error("Usuário já existe");
		const account = Account.create(
			params.name,
			params.email,
			params.cpf,
			params.isPassenger,
			params.isDriver,
			params.carPlate
		);
		await this.accountRepository.saveAccount(account);
		return {
			accountId: account.accountId,
		};
	}
}
