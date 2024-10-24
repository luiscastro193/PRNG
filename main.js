"use strict";
import PRNG from './PRNG.js';

const seedInput = document.querySelector("input");
const result = document.querySelector("p");
let generator;

seedInput.oninput = () => {generator = new PRNG(seedInput.value)};

document.querySelector("form").onsubmit = async event => {
	event.preventDefault();
	result.textContent = await generator.random();
};

if (seedInput.value)
	generator = new PRNG(seedInput.value);