"use strict";
const maxValue = 4294967296;
const wasm = fetch("pcg_prng.wasm").then(response => WebAssembly.compileStreaming(response));

async function toBigInt(seed) {
	let hash = new TextEncoder().encode(seed);
	
	do {
		hash = await crypto.subtle.digest("SHA-256", hash);
		seed = new DataView(hash).getBigUint64();
	} while (seed == 0n);
	
	return seed;
}

export default async function PRNG(seed) {
	seed = toBigInt(seed);
	let instance = wasm.then(module => WebAssembly.instantiate(module));
	[seed, instance] = await Promise.all([seed, instance]);
	instance.exports.pcg32_srandom(seed, seed);
	return () => (instance.exports.pcg32_next() >>> 0) / maxValue;
}