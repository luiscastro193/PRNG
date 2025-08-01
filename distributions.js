"use strict";
import PRNG from './PRNG.js';
import cephes from 'cephes';

function toNormal(random, ndtri) {
	return () => {
		let uniform;
		while ((uniform = random()) === 0);
		return ndtri(uniform);
	};
}

function gammaMarsagliaTsang(shape, random, ndtri) {
	if (shape <= 1) throw RangeError();
	const d = shape - 1 / 3;
	const c = 1 / Math.sqrt(9 * d);
	
	return () => {
		while (true) {
			const uniform = random();
			if (uniform === 0) continue;
			const x = ndtri(uniform);
			let v = 1 + c * x;
			if (v <= 0) continue;
			v = v ** 3;
			const u = random();
			
			if (u < 1 - .0331 * x ** 4 || Math.log(u) < .5 * x ** 2 + d * (1 - v + Math.log(v)))
				return d * v;
		}
	};
}

function toGamma(mean, deviation, random, ndtri) {
	const shape = (mean / deviation) ** 2;
	const scale = deviation ** 2 / mean;
	const generator = gammaMarsagliaTsang(shape, random, ndtri);
	return () => scale * generator();
}

function toBeta(mean, deviation, random, ndtri) {
	const v = mean * (1 - mean) / deviation ** 2 - 1;
	const alpha = mean * v;
	const beta = (1 - mean) * v;
	const alphaGenerator = gammaMarsagliaTsang(alpha, random, ndtri);
	const betaGenerator = gammaMarsagliaTsang(beta, random, ndtri);
	
	return () => {
		const x = alphaGenerator();
		const y = betaGenerator();
		return x / (x + y);
	};
}

const random = await PRNG("test");
const n = 1000000;
//const generator = random;
//const generator = toNormal(random, cephes.ndtri);
//const generator = toGamma(1, .5, random, cephes.ndtri);
const generator = toBeta(.5, .25, random, cephes.ndtri);

const start = performance.now();
const array = Array.from({length: n}, () => generator());
const end = performance.now();
console.log(`Time: ${end - start}`);
const mean = array.reduce((a, b) => a + b) / n;
console.log(`Mean: ${mean}`);
const deviation = Math.sqrt(array.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / (n - 1));
console.log(`Deviation: ${deviation}`);
