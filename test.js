"use strict";
import PRNG from './PRNG.js';
import {toNormal} from './distributions.js';

const form = document.querySelector("form");
const seedInput = document.querySelector("input");
const result = document.querySelector("p");
const n = 1000000;

form.onsubmit = async event => {
	event.preventDefault();
	const start = performance.now();
	const random = await PRNG(seedInput.value);
	Array.from({length: n}, () => random());
	result.textContent = performance.now() - start;
};

document.querySelector("button").onclick = async () => {
	if (form.reportValidity()) {
		const start = performance.now();
		const randomNormal = toNormal(await PRNG(seedInput.value));
		Array.from({length: n}, () => randomNormal());
		result.textContent = performance.now() - start;
	}
};
