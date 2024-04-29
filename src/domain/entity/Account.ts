import crypto from "crypto";
import { CarPlate } from "../vo/CarPlate";
import { Cpf } from "../vo/Cpf";
import { Email } from "../vo/Email";
import { Name } from "../vo/Name";
import { Uuid } from "../vo/Uuid";

export class Account {
	private constructor(
		private accountId: Uuid,
		private name: Name,
		private email: Email,
		private cpf: Cpf,
		readonly isPassenger?: boolean,
		readonly isDriver?: boolean,
		private carPlate?: CarPlate
	) {}

	static create(
		name: string,
		email: string,
		cpf: string,
		isPassenger?: boolean,
		isDriver?: boolean,
		carPlate?: string
	) {
		const accountId = crypto.randomUUID();
		return new Account(
			new Uuid(accountId),
			new Name(name),
			new Email(email),
			new Cpf(cpf),
			isPassenger,
			isDriver,
			new CarPlate(carPlate)
		);
	}

	static restore(
		accountId: string,
		name: string,
		email: string,
		cpf: string,
		isPassenger?: boolean,
		isDriver?: boolean,
		carPlate?: string
	) {
		return new Account(
			new Uuid(accountId),
			new Name(name),
			new Email(email),
			new Cpf(cpf),
			isPassenger,
			isDriver,
			new CarPlate(carPlate)
		);
	}

	getAccountId() {
		return this.accountId.getValue();
	}

	getName() {
		return this.name.getValue();
	}

	getEmail() {
		return this.email.getValue();
	}

	getCpf() {
		return this.cpf.getValue();
	}

	getCarPlate() {
		return this.carPlate?.getValue();
	}
}
