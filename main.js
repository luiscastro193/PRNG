"use strict";
import {setSeed, random} from './PRNG.js';

const seedInput = document.querySelector("input");
const result = document.querySelector("p");

seedInput.oninput = () => setSeed(seedInput.value);

document.querySelector("form").onsubmit = async event => {
	event.preventDefault();
	result.textContent = await random();
};

if (seedInput.value)
	setSeed(seedInput.value);
