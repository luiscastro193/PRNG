"use strict";
import PRNG from './PRNG.js';

const seedInput = document.querySelector("input");
const result = document.querySelector("p");
const n = 1000000;

document.querySelector("form").onsubmit = async event => {
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

const minValue = 1 / 0x100000000; // or Number.MIN_VALUE for Math.random()

document.querySelector("button").onclick = async () => {
	if (form.reportValidity()) {
		const cephes = await cephesPromise;
		let start = performance.now();
		let random = await PRNG(seedInput.value);
		let randomNormal = () => cephes.ndtri(random() || minValue);
		Array.from({length: n}, () => randomNormal());
		result.textContent = performance.now() - start;
	}
};
