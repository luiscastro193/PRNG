#pragma once
#include <cstdint>
#include <limits>
#include <wasm_simd128.h>

class xoshiro256pp_wasm_simd {
public:
	using result_type = uint64_t;
	
	static constexpr result_type min() noexcept { return std::numeric_limits<result_type>::min(); }
	static constexpr result_type max() noexcept { return std::numeric_limits<result_type>::max(); }
	
	xoshiro256pp_wasm_simd(int64_t a0, int64_t a1, int64_t a2, int64_t a3, int64_t b0, int64_t b1, int64_t b2, int64_t b3) noexcept
		: s0_(wasm_i64x2_make(a0, b0)), s1_(wasm_i64x2_make(a1, b1)), s2_(wasm_i64x2_make(a2, b2)), s3_(wasm_i64x2_make(a3, b3)) {}
	
	result_type operator()() noexcept {
		if (has_stash_) {
			has_stash_ = false;
			return stash_;
		}
		
		const v128_t r = next_v_();
		stash_ = wasm_u64x2_extract_lane(r, 1);
		has_stash_ = true;
		return wasm_u64x2_extract_lane(r, 0);
	}
	
private:
	v128_t s0_, s1_, s2_, s3_;
	result_type stash_;
	bool has_stash_ = false;
	
	static inline v128_t rotl_u64x2_(v128_t x, uint32_t k) noexcept {
		return wasm_v128_or(wasm_i64x2_shl(x, k), wasm_u64x2_shr(x, 64 - k));
	}
	
	inline v128_t next_v_() noexcept {
		const v128_t result = wasm_i64x2_add(rotl_u64x2_(wasm_i64x2_add(s0_, s3_), 23), s0_);
		const v128_t t = wasm_i64x2_shl(s1_, 17);
		
		s2_ = wasm_v128_xor(s2_, s0_);
		s3_ = wasm_v128_xor(s3_, s1_);
		s1_ = wasm_v128_xor(s1_, s2_);
		s0_ = wasm_v128_xor(s0_, s3_);
		s2_ = wasm_v128_xor(s2_, t);
		s3_ = rotl_u64x2_(s3_, 45);
		
		return result;
	}
};
