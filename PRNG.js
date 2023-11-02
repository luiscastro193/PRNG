"use strict";
const maxValue = 4294967296;
let seedPromise;

export function setSeed(initialSeed) {
	seedPromise = crypto.subtle.digest("SHA-256", new TextEncoder().encode(initialSeed));
}

async function updateSeed() {
	return seedPromise = seedPromise.then(seed => crypto.subtle.digest("SHA-256", seed));
}

function toRandom(seed) {
	return new DataView(seed).getUint32() / maxValue;
}

export async function random() {
	let seed = await updateSeed();
	return toRandom(seed);
}
