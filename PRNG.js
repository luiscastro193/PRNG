"use strict";
const wasmSource = "AGFzbQEAAAABCgJgAn5+AGAAAX8DAwIAAQYLAn4BQgALfgFCAAsHHgINcGNnMzJfc3JhbmRvbQAACnBjZzMyX25leHQAAQpYAh0AQgAkACABQgGGQgGEJAEQARojACAAfCQAEAEaCzgCAX4CfyMAIQAgAEKt/tXk1IX9qNgAfiMBfCQAIABCEoggAIVCG4inIQEgAEI7iKchAiABIAJ4Cw==";
const wasm = WebAssembly.compile(Uint8Array.from(atob(wasmSource), c => c.codePointAt(0)));
const maxValue = 4294967296;

async function toBigInts(seed) {
	seed = new DataView(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed)));
	return [seed.getBigUint64(), seed.getBigUint64(8)];
}

export default async function PRNG(seed) {
	seed = toBigInts(seed);
	let instance = wasm.then(module => WebAssembly.instantiate(module));
	[seed, instance] = await Promise.all([seed, instance]);
	instance.exports.pcg32_srandom(...seed);
	return () => (instance.exports.pcg32_next() >>> 0) / maxValue;
}
