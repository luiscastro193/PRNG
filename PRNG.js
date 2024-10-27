"use strict";
async function fetchWasm(resource) {
	if (typeof process != 'undefined' && process?.versions?.undici)
		return new Response(await (await import('node:fs')).openAsBlob(resource, {type: 'application/wasm'}));
	else
		return fetch(resource);
}

const maxValue = 4294967296;
const wasm = WebAssembly.compileStreaming(fetchWasm(new URL("pcg_prng.wasm", import.meta.url)));

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
