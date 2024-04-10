export interface SaveAccountInputDTO {
	accountId: string;
	name: string;
	email: string;
	cpf: string;
	carPlate?: string;
	isPassenger?: boolean;
	isDriver?: boolean;
}
