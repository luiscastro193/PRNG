"use strict";
const maxValue = 4294967296;
const wasm = fetch("pcg_prng.wasm").then(response => WebAssembly.instantiateStreaming(response)).then(result => result.module);

async function initialize(seed) {
	seed = crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed)).then(hash => new DataView(hash).getBigUint64());
	let instance = wasm.then(module => WebAssembly.instantiate(module));
	[seed, instance] = await Promise.all([seed, instance]);
	instance.exports.pcg32_srandom(seed, seed);
	return instance.exports.pcg32_next;
}

export default class PRNG {
	constructor(seed) {
		this.next = initialize(seed);
	}
	
	async random() {
		return ((await this.next)() >>> 0) / maxValue;
	}
}