export class Uuid {
	private value;

	constructor(uuid: string) {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(uuid)) throw new Error("Invalid UUID");
		this.value = uuid;
	}

	getValue() {
		return this.value;
	}
}
