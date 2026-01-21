"use strict";
import module from './random.js';
const randomPromise = module();

async function toBigInts(mySeed) {
	if (mySeed == null) return crypto.getRandomValues(new BigUint64Array(4));
	return new BigUint64Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(mySeed)));
}

export async function seed(mySeed) {
	const [ints, random] = await Promise.all([toBigInts(mySeed), randomPromise]);
	random._seed(...ints);
}

export async function random() {
	return (await randomPromise)._next;
}

export default async function PRNG(mySeed) {
	await seed(mySeed);
	return random();
}
