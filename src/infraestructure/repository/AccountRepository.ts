import { Account } from "../../domain/entity/Account";
import { DatabaseConnection } from "../database/DatabaseConnection";

// Driven/Resource Port
export interface AccountRepository {
	getAccountByEmail(email: string): Promise<Account | undefined>;
	getAccountById(accountId: string): Promise<Account | undefined>;
	saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
	constructor(readonly connection: DatabaseConnection) {}

	async getAccountByEmail(email: string): Promise<Account | undefined> {
		const [acc] = await this.connection.query(
			"select * from cccat16.account where email = $1",
			[email]
		);
		if (acc)
			return Account.restore(
				acc.account_id,
				acc.name,
				acc.email,
				acc.cpf,
				acc.car_plate,
				acc.is_passenger,
				acc.is_driver
			);
		return undefined;
	}

	async getAccountById(accountId: string): Promise<Account | undefined> {
		const [acc] = await this.connection.query(
			"select * from cccat16.account where account_id = $1",
			[accountId]
		);
		if (acc)
			return Account.restore(
				acc.account_id,
				acc.name,
				acc.email,
				acc.cpf,
				acc.is_passenger,
				acc.is_driver,
				acc.car_plate
			);
		return undefined;
	}

	async saveAccount(account: Account): Promise<void> {
		await this.connection.query(
			"insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
			[
				account.getAccountId(),
				account.getName(),
				account.getEmail(),
				account.getCpf(),
				account.getCarPlate(),
				!!account.isPassenger,
				!!account.isDriver,
			]
		);
	}
}

// Driven/Resource Adapter
export class AccountRepositoryMemory implements AccountRepository {
	accounts: Account[];

	constructor() {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<Account | undefined> {
		const account = this.accounts.find(
			(account: Account) => account.getEmail() === email
		);
		if (account)
			return Account.restore(
				account.getAccountId(),
				account.getName(),
				account.getEmail(),
				account.getCpf(),
				account.isPassenger,
				account.isDriver,
				account.getCarPlate()
			);
	}

	async getAccountById(accountId: string): Promise<Account | undefined> {
		const account = this.accounts.find(
			(account: Account) => account.getAccountId() === accountId
		);
		if (account)
			return Account.restore(
				account.getAccountId(),
				account.getName(),
				account.getEmail(),
				account.getCpf(),
				account.isPassenger,
				account.isDriver,
				account.getCarPlate()
			);
	}

	async saveAccount(account: Account): Promise<void> {
		this.accounts.push(account);
	}
}
