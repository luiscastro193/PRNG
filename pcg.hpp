#pragma once
#include <cstdint>
#include <limits>

class pcg64_dxsm {
private:
	__uint128_t state_;
	__uint128_t inc_;

public:
	using result_type = uint64_t;
	
	static constexpr result_type min() noexcept { return std::numeric_limits<result_type>::min(); }
	static constexpr result_type max() noexcept { return std::numeric_limits<result_type>::max(); }
	
	pcg64_dxsm(uint64_t state_hi, uint64_t state_lo, uint64_t inc_hi, uint64_t inc_lo) noexcept:
		state_{ (__uint128_t(state_hi) << 64) | __uint128_t(state_lo) },
		inc_{ (__uint128_t(inc_hi) << 64) | __uint128_t(inc_lo) } {
		inc_ = (inc_ << 1) | 1;
		state_ += inc_;
		(*this)();
	}
	
	result_type operator()() noexcept {
		constexpr uint64_t mul = 15750249268501108917ULL;
		const __uint128_t state = state_;
		state_ = state * mul + inc_;
		uint64_t hi = uint64_t(state >> 64);
		const uint64_t lo = uint64_t(state) | 1;
		hi ^= hi >> 32;
		hi *= mul;
		hi ^= hi >> 48;
		hi *= lo;
		return hi;
	}
};
