"use strict";
import module from './random.js';
const randomPromise = module();

async function toBigInts(seed) {
	if (seed == null) return crypto.getRandomValues(new BigUint64Array(4));
	return new BigUint64Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed)));
}

const cleaner = new FinalizationRegistry(async memory => (await randomPromise)._destroy(memory));

export async function generator(seed) {
	const [ints, random] = await Promise.all([toBigInts(seed), randomPromise]);
	const rng = {memory: random._seed(...ints)};
	cleaner.register(rng, rng.memory);
	return rng;
}

export async function next(rng) {
	const random = await randomPromise;
	return () => random._next(rng.memory);
}

export default async function PRNG(seed) {
	return next(await generator(seed));
}

const normalCleaner = new FinalizationRegistry(async memory => (await randomPromise)._destroy_normal(memory));

export async function normal(mean, deviation, rng) {
	const random = await randomPromise;
	const dist = {memory: random._normal(mean, deviation)};
	normalCleaner.register(dist, dist.memory);
	return () => random._next_normal(dist.memory, rng.memory);
}
