"use strict";
import PRNG from './PRNG.js';

const seedInput = document.querySelector("input");
const result = document.querySelector("p");
let random;

seedInput.oninput = () => {random = PRNG(seedInput.value)};

document.querySelector("form").onsubmit = async event => {
	event.preventDefault();
	result.textContent = (await random)();
};

const cephes = import('https://cdn.jsdelivr.net/npm/cephes/+esm').then(async module => {
	await module.default.compiled;
	return module.default;
});

document.querySelector("button").onclick = async () => {
	result.textContent = (await cephes).ndtri((await random)() || Number.MIN_VALUE);
}

if (seedInput.value)
	random = PRNG(seedInput.value);
