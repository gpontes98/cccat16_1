import crypto from "crypto";
import { validateCarPlate } from "./validations/validateCarPlate";
import { validateCpf } from "./validations/validateCpf";
import { validateEmail } from "./validations/validateEmail";
import { validateName } from "./validations/validateName";

export class Account {
	private constructor(
		readonly accountId: string,
		readonly name: string,
		readonly email: string,
		readonly cpf: string,
		readonly isPassenger?: boolean,
		readonly isDriver?: boolean,
		readonly carPlate?: string,
	) {
		if (!validateName(name)) throw new Error("Nome inválido");
		if (!validateEmail(email)) throw new Error("Email inválido");
		if (!validateCpf(cpf)) throw new Error("CPF inválido");
		if (isDriver && carPlate && !validateCarPlate(carPlate))
			throw new Error("Placa do veículo inválida");
	}

	static create(
		name: string,
		email: string,
		cpf: string,
		isPassenger?: boolean,
		isDriver?: boolean,
		carPlate?: string,
	) {
		const accountId = crypto.randomUUID();
		return new Account(
			accountId,
			name,
			email,
			cpf,
			isPassenger,
			isDriver,
			carPlate,
		);
	}

	static restore(
		accountId: string,
		name: string,
		email: string,
		cpf: string,
		isPassenger?: boolean,
		isDriver?: boolean,
		carPlate?: string,
	) {
		return new Account(
			accountId,
			name,
			email,
			cpf,
			isPassenger,
			isDriver,
			carPlate,
		);
	}
}
