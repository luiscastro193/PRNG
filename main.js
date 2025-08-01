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

function toNormal(random, ndtri) {
	return () => {
		let uniform;
		while ((uniform = random()) === 0);
		return ndtri(uniform);
	};
}

document.querySelector("button").onclick = async () => {
	if (form.reportValidity())
		result.textContent = toNormal(await random, (await cephes).ndtri)();
}

if (seedInput.value)
	random = PRNG(seedInput.value);
