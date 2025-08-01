"use strict";
import PRNG from './PRNG.js';
import {toNormal} from './distributions.js';

const form = document.querySelector("form");
const seedInput = document.querySelector("input");
const result = document.querySelector("p");
let random;

seedInput.oninput = () => {random = PRNG(seedInput.value)};

form.onsubmit = async event => {
	event.preventDefault();
	result.textContent = (await random)();
};

document.querySelector("button").onclick = async () => {
	if (form.reportValidity())
		result.textContent = toNormal(await random)();
}

if (seedInput.value)
	random = PRNG(seedInput.value);
