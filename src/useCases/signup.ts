import crypto from "crypto";

import { AccountDAO } from "../resources/AccountDAO";
import { validateCpf } from "../validations/validateCpf";
import { validateName } from "../validations/validateName";
import { validateEmail } from "../validations/validateEmail";
import { validateCarPlate } from "../validations/validateCarPlate";

interface SignupProps {
	email: string;
	name: string;
	cpf: string;
	carPlate?: string;
	isPassenger?: boolean;
	isDriver?: boolean;
}

export class Signup {
	constructor(readonly accountDAO: AccountDAO) {}

	async execute({
		email,
		name,
		cpf,
		carPlate,
		isPassenger,
		isDriver,
	}: SignupProps) {
		const accountId = crypto.randomUUID();
		const existingAccount = await this.accountDAO.getAccountByEmail(email);
		if (existingAccount) throw new Error("Usuário já existe");
		if (!validateName(name)) throw new Error("Nome inválido");
		if (!validateEmail(email)) throw new Error("Email inválido");
		if (!validateCpf(cpf)) throw new Error("CPF inválido");
		if (isDriver && carPlate && !validateCarPlate(carPlate))
			throw new Error("Placa do veículo inválida");
		await this.accountDAO.saveAccount({
			accountId,
			cpf,
			email,
			name,
			carPlate,
			isDriver,
			isPassenger,
		});
		return {
			accountId,
		};
	}
}
