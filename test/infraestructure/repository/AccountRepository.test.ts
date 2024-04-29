import { AccountRepositoryDatabase } from "../../../src/infraestructure/repository/AccountRepository";
import { PgPromiseAdapter } from "../../../src/infraestructure/database/DatabaseConnection";
import { Account } from "../../../src/domain/entity/Account";

// Integration Test
test("Deve salvar um registro na tabela account e consultar por id", async function () {
	const account = Account.create(
		"John Doe",
		`john.doe${Math.random()}@gmail.com`,
		"87748248800",
		true
	);
	const connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	await accountRepository.saveAccount(account);
	const accountById = await accountRepository.getAccountById(
		account.getAccountId()
	);
	expect(accountById).toBeDefined();
	expect(accountById?.getAccountId()).toBe(account.getAccountId());
	expect(accountById?.getName()).toBe(account.getName());
	expect(accountById?.getEmail()).toBe(account.getEmail());
	expect(accountById?.getCpf()).toBe(account.getCpf());
	await accountRepository.connection.close();
});

test("Deve salvar um registro na tabela account e consultar por email", async function () {
	const account = Account.create(
		"John Doe",
		`john.doe${Math.random()}@gmail.com`,
		"87748248800",
		true
	);
	const connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	await accountRepository.saveAccount(account);
	const accountByEmail = await accountRepository.getAccountByEmail(
		account.getEmail()
	);
	expect(accountByEmail).toBeDefined();
	expect(accountByEmail?.getAccountId()).toBe(account.getAccountId());
	expect(accountByEmail?.getName()).toBe(account.getName());
	expect(accountByEmail?.getEmail()).toBe(account.getEmail());
	expect(accountByEmail?.getCpf()).toBe(account.getCpf());
	await accountRepository.connection.close();
});
