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

if (seedInput.value)
	random = PRNG(seedInput.value);