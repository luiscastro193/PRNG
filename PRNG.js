"use strict";
let wasm = "AGFzbQEAAAABDgNgAn5+AGAAAX9gAAF8AwQDAAECBgsCfgFCAAt+AUIACwcgAg1wY2czMl9zcmFuZG9tAAAMcGNnMzJfcmFuZG9tAAIKaAMdAEIAJAAgAUIBhkIBhCQBEAEaIwAgAHwkABABGgs4AgF+An8jACEAIABCrf7V5NSF/ajYAH4jAXwkACAAQhKIIACFQhuIpyEBIABCO4inIQIgASACeAsPABABuEQAAAAAAADwPaIL";
wasm = WebAssembly.compile(Uint8Array.fromBase64?.(wasm) || Uint8Array.from(atob(wasm), c => c.codePointAt(0)));

async function toBigInts(seed) {
	seed = new DataView(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed)));
	return [seed.getBigUint64(), seed.getBigUint64(8)];
}

export default async function PRNG(seed) {
	seed = toBigInts(seed);
	let instance = wasm.then(module => WebAssembly.instantiate(module));
	[seed, instance] = await Promise.all([seed, instance]);
	instance.exports.pcg32_srandom(...seed);
	return instance.exports.pcg32_random;
}
