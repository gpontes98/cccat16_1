import crypto from "crypto";
import pgp from "pg-promise";
import * as dotenv from "dotenv";

import { validateCpf } from "../validations/validateCpf";
import { validateName } from "../validations/validateName";
import { validateEmail } from "../validations/validateEmail";
import { validateCarPlate } from "../validations/validateCarPlate";

dotenv.config();

interface SignupProps {
	email: string;
	name: string;
	cpf: string;
	carPlate?: string;
	isPassenger?: boolean;
	isDriver?: boolean;
}

export async function signup({
	email,
	name,
	cpf,
	carPlate,
	isPassenger,
	isDriver,
}: SignupProps) {
	const connection = pgp()(
		`postgres://postgres:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
	);
	try {
		const id = crypto.randomUUID();
		const [account] = await connection.query(
			"select * from cccat16.account where email = $1",
			[email]
		);
		if (account) throw new Error("Usuário já existe");
		if (!validateName(name)) throw new Error("Nome inválido");
		if (!validateEmail(email)) throw new Error("Email inválido");
		if (!validateCpf(cpf)) throw new Error("CPF inválido");
		if (isDriver && carPlate && !validateCarPlate(carPlate))
			throw new Error("Placa do veículo inválida");
		await connection.query(
			"insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
			[id, name, email, cpf, carPlate, !!isPassenger, !!isDriver]
		);
		return id;
	} finally {
		await connection.$pool.end();
	}
}
