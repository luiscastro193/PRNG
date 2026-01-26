"use strict";
import module from './random.js';
const randomPromise = module();
const cleaner = new FinalizationRegistry(async ({method, memory}) => (await randomPromise)['_destroy' + method](memory));

async function toBigInts(seed) {
	if (seed == null) return crypto.getRandomValues(new BigInt64Array(8));
	return new BigInt64Array(await crypto.subtle.digest("SHA-512", new TextEncoder().encode(seed)));
}

export async function generator(seed) {
	const [ints, random] = await Promise.all([toBigInts(seed), randomPromise]);
	const rng = {memory: random._seed(...ints)};
	cleaner.register(rng, {method: '', memory: rng.memory});
	return rng;
}

export async function next(rng) {
	const random = await randomPromise;
	return () => random._next(rng.memory);
}

export default async function PRNG(seed) {
	return next(await generator(seed));
}

export async function distribution(dist, mean, deviation, rng) {
	dist = '_' + dist;
	const random = await randomPromise;
	const myDist = {memory: random[dist](mean, deviation)};
	cleaner.register(myDist, {method: dist, memory: myDist.memory});
	const myNext = random['_next' + dist];
	return () => myNext(myDist.memory, rng.memory);
}
