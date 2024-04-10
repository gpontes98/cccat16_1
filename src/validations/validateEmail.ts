export function validateEmail(email: string): boolean {
	return email.match(/^(.+)@(.+)$/) !== null;
}
