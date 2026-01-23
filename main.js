"use strict";
import * as PRNG from './PRNG.js';

const form = document.querySelector("form");
const seedInput = document.querySelector("input");
const result = document.querySelector("p");
const buttons = document.querySelectorAll("button");
let random;
let randomNormal;

seedInput.oninput = () => {
	result.textContent = '';
	const generator = PRNG.generator(seedInput.value || null);
	random = generator.then(rng => PRNG.next(rng));
	randomNormal = generator.then(rng => PRNG.distribution('normal', 0, 1, rng));
};

form.onsubmit = async event => {
	event.preventDefault();
	result.textContent = (await random)();
};

buttons[0].onclick = async () => {
	result.textContent = (await randomNormal)();
}

seedInput.oninput();
buttons[1].onclick = seedInput.oninput;
