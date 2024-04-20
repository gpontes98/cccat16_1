import { Account } from "../../domain/Account";
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
				account.accountId,
				account.name,
				account.email,
				account.cpf,
				account.carPlate,
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
			(account: Account) => account.email === email
		);
		if (account)
			return Account.restore(
				account.accountId,
				account.name,
				account.email,
				account.cpf,
				account.isPassenger,
				account.isDriver,
				account.carPlate
			);
	}

	async getAccountById(accountId: string): Promise<Account | undefined> {
		const account = this.accounts.find(
			(account: Account) => account.accountId === accountId
		);
		if (account)
			return Account.restore(
				account.accountId,
				account.name,
				account.email,
				account.cpf,
				account.isPassenger,
				account.isDriver,
				account.carPlate
			);
	}

	async saveAccount(account: Account): Promise<void> {
		this.accounts.push(account);
	}
}
