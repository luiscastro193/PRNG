"use strict";
const maxValue = 4294967296;
const encoder = new TextEncoder();

function toRandom(hash) {
	return new DataView(hash).getUint32() / maxValue;
}

export default class PRNG {
	constructor(seed) {
		this.seed = seed.toString();
		this.counter = 0;
		this.updateHash();
	}
	
	updateHash() {
		this.hash = crypto.subtle.digest("SHA-256", encoder.encode(this.seed + this.counter++));
		
		if (!Number.isSafeInteger(this.counter)) {
			this.counter = 0;
			this.seed += 0;
		}
	}
	
	async random() {
		let myHash = this.hash;
		this.updateHash();
		return toRandom(await myHash);
	}
}