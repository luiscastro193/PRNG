#include <boost/random/xoshiro.hpp>
#include <boost/random/uniform_01.hpp>
#include <array>

boost::random::uniform_01<double> uniform;

extern "C" boost::random::xoshiro256pp* seed(std::uint64_t s0, std::uint64_t s1, std::uint64_t s2, std::uint64_t s3) {
	std::array<std::uint64_t, 4> state = {s0, s1, s2, s3};
	auto it = state.begin();
	return new boost::random::xoshiro256pp(it, state.end());
}

extern "C" double next(boost::random::xoshiro256pp* rng) {
	return uniform(*rng);
}

extern "C" void destroy(boost::random::xoshiro256pp* rng) {
	delete rng;
}
