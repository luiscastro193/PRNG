"use strict";
const maxValue = 4294967296;

function toRandom(seed) {
	return new DataView(seed).getUint32() / maxValue;
}

export default class PRNG {
	constructor(seed) {
		this.seedPromise = crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
	}
	
	async updateSeed() {
		return this.seedPromise = this.seedPromise.then(seed => crypto.subtle.digest("SHA-256", seed));
	}
	
	async random() {
		let seed = await this.updateSeed();
		return toRandom(seed);
	}
}
