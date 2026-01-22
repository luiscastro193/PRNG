"use strict";
import * as PRNG from './PRNG.js';

const form = document.querySelector("form");
const seedInput = document.querySelector("input");
const result = document.querySelector("p");
let random;
let randomNormal;

seedInput.oninput = () => {
	const generator = PRNG.generator(seedInput.value || null);
	random = generator.then(rng => PRNG.next(rng));
	randomNormal = generator.then(rng => PRNG.normal(0, 1, rng));
};

form.onsubmit = async event => {
	event.preventDefault();
	result.textContent = (await random)();
};

document.querySelector("button").onclick = async () => {
	result.textContent = (await randomNormal)();
}

seedInput.oninput();
