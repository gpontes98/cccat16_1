import { GetAccount } from "../../application/usecases/GetAccount";
import { Signup } from "../../application/usecases/Signup";
import HttpServer from "./HttpServer";

export class AccountController {
	constructor(
		readonly httpServer: HttpServer,
		readonly signUp: Signup,
		readonly getAccount: GetAccount
	) {
		httpServer.register(
			"post",
			"/account",
			async function (params: any, body: any) {
				const output = await signUp.execute(body);
				return output;
			}
		);

		httpServer.register(
			"get",
			"/account/:{accountId}",
			async function (params: any, body: any) {
				const input = {
					accountId: params.accountId,
				};
				const account = await getAccount.execute(input);
				return account;
			}
		);
	}
}
