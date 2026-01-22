#include <boost/random/xoshiro.hpp>
#include <array>
#include <random>
#include <limits>

using generator = boost::random::xoshiro256pp;

extern "C" generator* seed(std::uint64_t s0, std::uint64_t s1, std::uint64_t s2, std::uint64_t s3) {
	std::array<std::uint64_t, 4> state = {s0, s1, s2, s3};
	auto it = state.begin();
	return new generator(it, state.end());
}

extern "C" double next(generator* rng) {
	return std::generate_canonical<double, std::numeric_limits<double>::digits>(*rng);
}

extern "C" void destroy(generator* rng) {
	delete rng;
}

using normal_dist = std::normal_distribution<double>;

extern "C" normal_dist* normal(double mean, double deviation) {
	return new normal_dist(mean, deviation);
}

extern "C" double next_normal(normal_dist* normal, generator* rng) {
	return (*normal)(*rng);
}

extern "C" void destroy_normal(normal_dist* normal) {
	delete normal;
}
