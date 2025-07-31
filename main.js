"use strict";
import PRNG from './PRNG.js';

const form = document.querySelector("form");
const seedInput = document.querySelector("input");
const result = document.querySelector("p");
let random;

seedInput.oninput = () => {random = PRNG(seedInput.value)};

form.onsubmit = async event => {
	event.preventDefault();
	result.textContent = (await random)();
};

const cephes = import('https://cdn.jsdelivr.net/npm/cephes/+esm').then(async module => {
	await module.default.compiled;
	return module.default;
});

const minValue = 1 / 0x100000000; // or Number.MIN_VALUE for Math.random()

document.querySelector("button").onclick = async () => {
	if (form.reportValidity())
		result.textContent = (await cephes).ndtri((await random)() || minValue);
}

if (seedInput.value)
	random = PRNG(seedInput.value);
