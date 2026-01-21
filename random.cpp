#include <boost/random/xoshiro.hpp>
#include <boost/random/uniform_01.hpp>
#include <array>

static boost::random::xoshiro256pp rng;
boost::random::uniform_01<double> uniform;


extern "C" void seed(std::uint64_t s0, std::uint64_t s1, std::uint64_t s2, std::uint64_t s3) {
	std::array<std::uint64_t, 4> state = {s0, s1, s2, s3};
	rng.seed(state.begin(), state.end());
}

extern "C" double next() {
	return uniform(rng);
}
