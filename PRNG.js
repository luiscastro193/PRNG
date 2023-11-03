"use strict";
const maxValue = 4294967296;

function toRandom(seed) {
	return new DataView(seed).getUint32() / maxValue;
}

export default class PRNG {
	constructor(seed) {
		this.seedPromise = crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
	}
	
	async random() {
		let seed = this.seedPromise;
		this.seedPromise = this.seedPromise.then(seed => crypto.subtle.digest("SHA-256", seed));
		return toRandom(await seed);
	}
}
