import { Uuid } from "../../domain/vo/Uuid";
import { AccountRepository } from "../../infraestructure/repository/AccountRepository";

export class GetAccount {
	constructor(readonly accountRepository: AccountRepository) {}

	async execute(params: { accountId: string }): Promise<Output> {
		const accountId = new Uuid(params.accountId).getValue();
		const account = await this.accountRepository.getAccountById(accountId);
		if (!account) throw new Error("Usuário não encontrado");
		return {
			accountId: account.getAccountId(),
			name: account.getName(),
			email: account.getEmail(),
			cpf: account.getCpf(),
			isPassenger: account.isPassenger,
			isDriver: account.isDriver,
			carPlate: account.getCarPlate(),
		};
	}
}

type Output = {
	accountId: string;
	name: string;
	email: string;
	cpf: string;
	isPassenger?: boolean;
	isDriver?: boolean;
	carPlate?: string;
}