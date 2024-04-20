// Framework and driver
import pgp from "pg-promise";
import * as dotenv from "dotenv";
dotenv.config();

export interface DatabaseConnection {
	query(statement: string, params: any): Promise<any>;
	close(): Promise<void>;
}

const CONNECTION_STRING = `postgres://postgres:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export class PgPromiseAdapter implements DatabaseConnection {
	connection: any;

	constructor() {
		this.connection = pgp()(CONNECTION_STRING);
	}

	async query(statement: string, params: any): Promise<any> {
		return await this.connection.query(statement, params);
	}

	async close(): Promise<void> {
		return await this.connection.$pool.end();
	}
}
