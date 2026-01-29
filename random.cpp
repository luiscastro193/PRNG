#include <emscripten/emscripten.h>
#define CAPI extern "C" EMSCRIPTEN_KEEPALIVE
#define WASM_SIMD_COMPAT_SLOW

#include <pcg.hpp>
#include <array>
#include <random>
#include <limits>
#include <cmath>

using generator = pcg64_dxsm;

CAPI generator* seed(uint64_t s0, uint64_t s1, uint64_t s2, uint64_t s3) {
	return new generator(s0, s1, s2, s3);
}

CAPI double next(generator* rng) {
	return std::generate_canonical<double, std::numeric_limits<double>::digits>(*rng);
}

CAPI void destroy(generator* rng) {
	delete rng;
}

using normal_dist = std::normal_distribution<double>;

CAPI normal_dist* normal(double mean, double deviation) {
	return new normal_dist(mean, deviation);
}

CAPI double next_normal(normal_dist* dist, generator* rng) {
	return (*dist)(*rng);
}

CAPI void destroy_normal(normal_dist* dist) {
	delete dist;
}

using gamma_dist = std::gamma_distribution<double>;

CAPI gamma_dist* gamma(double mean, double deviation) {
	const double variance = deviation * deviation;
	const double shape = (mean * mean) / variance;
	const double scale  = variance / mean;
	return new gamma_dist(shape, scale);
}

CAPI double next_gamma(gamma_dist* dist, generator* rng) {
	return (*dist)(*rng);
}

CAPI void destroy_gamma(gamma_dist* dist) {
	delete dist;
}

struct beta_dist {
	gamma_dist gx;
	gamma_dist gy;
	beta_dist(double a, double b): gx(a), gy(b) {}
};

CAPI beta_dist* beta(double mean, double deviation) {
	const double t = mean * (1.0 - mean) / (deviation * deviation) - 1.0;
	const double a = mean * t;
	const double b = (1.0 - mean) * t;
	return new beta_dist(a, b);
}

CAPI double next_beta(beta_dist* dist, generator* rng) {
	const double x = dist->gx(*rng);
	const double y = dist->gy(*rng);
	return x / (x + y);
}

CAPI void destroy_beta(beta_dist* dist) {
	delete dist;
}

using lognormal_dist = std::lognormal_distribution<double>;

CAPI lognormal_dist* lognormal(double mean, double deviation) {
	const double sigma_sq = std::log(1.0 + (deviation * deviation) / (mean * mean));
	const double mu = std::log(mean) - .5 * sigma_sq;
	return new lognormal_dist(mu, std::sqrt(sigma_sq));
}

CAPI double next_lognormal(lognormal_dist* dist, generator* rng) {
	return (*dist)(*rng);
}

CAPI void destroy_lognormal(lognormal_dist* dist) {
	delete dist;
}
