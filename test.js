"use strict";
import PRNG from './PRNG.js';

const form = document.querySelector("form");
const seedInput = document.querySelector("input");
const result = document.querySelector("p");
const n = 1000000;

form.onsubmit = async event => {
	event.preventDefault();
	let start = performance.now();
	let random = await PRNG(seedInput.value);
	Array.from({length: n}, () => random());
	result.textContent = performance.now() - start;
};

const cephesPromise = import('https://cdn.jsdelivr.net/npm/cephes/+esm').then(async module => {
	await module.default.compiled;
	return module.default;
});

function toNormal(random, ndtri) {
	return () => {
		let uniform;
		while ((uniform = random()) === 0);
		return ndtri(uniform);
	};
}

document.querySelector("button").onclick = async () => {
	if (form.reportValidity()) {
		const cephes = await cephesPromise;
		let start = performance.now();
		let random = await PRNG(seedInput.value);
		let randomNormal = toNormal(await PRNG(seedInput.value), cephes.ndtri);
		Array.from({length: n}, () => randomNormal());
		result.textContent = performance.now() - start;
	}
};
