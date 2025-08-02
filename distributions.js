// Marsaglia polar method
export function toNormal(random) {
	let spare;
	let hasSpare = false;
	
	return () => {
		if (hasSpare) {
			hasSpare = false;
			return spare;
		}
		
		let u, v, s;

		do {
			u = 2 * random() - 1;
			v = 2 * random() - 1;
			s = u ** 2 + v ** 2;
		} while (s >= 1 || s === 0);

		s = Math.sqrt(-2 * Math.log(s) / s);
		spare = v * s;
		hasSpare = true;
		return u * s;
	};
}

function gammaMarsagliaTsang(shape, random) {
	if (shape <= 1) throw RangeError();
	const d = shape - 1 / 3;
	const c = 1 / Math.sqrt(9 * d);
	const randomNormal = toNormal(random);
	
	return () => {
		while (true) {
			const x = randomNormal();
			let v = 1 + c * x;
			if (v <= 0) continue;
			v = v ** 3;
			const u = random();
			
			if (u < 1 - .0331 * x ** 4 || Math.log(u) < .5 * x ** 2 + d * (1 - v + Math.log(v)))
				return d * v;
		}
	};
}

export function toGamma(mean, deviation, random) {
	const shape = (mean / deviation) ** 2;
	const scale = deviation ** 2 / mean;
	const generator = gammaMarsagliaTsang(shape, random);
	return () => scale * generator();
}

export function toBeta(mean, deviation, random) {
	const v = mean * (1 - mean) / deviation ** 2 - 1;
	const alpha = mean * v;
	const beta = (1 - mean) * v;
	const alphaGenerator = gammaMarsagliaTsang(alpha, random);
	const betaGenerator = gammaMarsagliaTsang(beta, random);
	
	return () => {
		const x = alphaGenerator();
		const y = betaGenerator();
		return x / (x + y);
	};
}

export function toLogNormal(mean, deviation, random) {
	const logVar = Math.log(1 + (deviation / mean) ** 2);
	const sigma = Math.sqrt(logVar);
	const mu = Math.log(mean) - logVar / 2;
	const randomNormal = toNormal(random);
	return () => Math.exp(mu + sigma * randomNormal());
}
