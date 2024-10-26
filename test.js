"use strict";
import PRNG from './PRNG.js';

const seedInput = document.querySelector("input");
const result = document.querySelector("p");

document.querySelector("form").onsubmit = async event => {
	event.preventDefault();
	let start = performance.now();
	let random = await PRNG(seedInput.value);
	Array.from({length: 1000000}, () => random());
	result.textContent = performance.now() - start;
};