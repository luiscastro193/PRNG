"use strict";
import PRNG from './PRNG.js';
import {toNormal} from './distributions.js';

const form = document.querySelector("form");
const seedInput = document.querySelector("input");
const result = document.querySelector("p");
let random;
let randomNormal;

seedInput.oninput = () => {
	random = PRNG(seedInput.value);
	randomNormal = random.then(toNormal);
};

form.onsubmit = async event => {
	event.preventDefault();
	result.textContent = (await random)();
};

document.querySelector("button").onclick = async () => {
	if (form.reportValidity())
		result.textContent = (await randomNormal)();
}

if (seedInput.value) seedInput.oninput();
