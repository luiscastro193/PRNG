"use strict";
import module from './random.js';
const randomPromise = module();
const cleaner = new FinalizationRegistry(async memory => (await randomPromise)._destroy(memory));

async function toBigInts(seed) {
	if (seed == null) return crypto.getRandomValues(new BigUint64Array(4));
	return new BigUint64Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed)));
}

export async function generator(seed) {
	const [ints, random] = await Promise.all([toBigInts(seed), randomPromise]);
	const rng = {memory: random._seed(...ints)};
	cleaner.register(rng, rng.memory);
	return rng;
}

export async function random(rng) {
	const random = await randomPromise;
	return () => random._next(rng.memory);
}

export default async function PRNG(seed) {
	return random(await generator(seed));
}
