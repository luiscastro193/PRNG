(module

	;; ==== PCG PRNG ===========================================

	(global $pcg32_state (mut i64) (i64.const 0)) ;; state for the PRNG
	(global $pcg32_increment (mut i64) (i64.const 0)) ;; increment for the seed

	(func $pcg32_srandom (export "pcg32_srandom")
	(param $initstate i64) (param $initseq i64)
		(global.set $pcg32_state (i64.const 0)) ;; state = 0
		(global.set $pcg32_increment (i64.or
			(i64.shl (local.get $initseq) (i64.const 1))
			(i64.const 1)
		)) ;; inc = (initseq << 1) | 1
		(drop (call $pcg32_next)) ;; discard next()
		(global.set $pcg32_state (i64.add
			(global.get $pcg32_state)
			(local.get $initstate)
		)) ;; state += initstate
		(drop (call $pcg32_next)) ;; discard next()
	)

	(func $pcg32_next (result i32)
		(local $oldstate i64)
		(local $xorshifted i32)
		(local $rot i32)
		(local.set $oldstate (global.get $pcg32_state)) ;; oldstate = state
		(global.set $pcg32_state (i64.add
			(i64.mul (local.get $oldstate) (i64.const 0x5851F42D4C957F2D))
			(global.get $pcg32_increment)
		)) ;; state = oldstate * 0x5851F42D4C957F2D + inc
		(local.set $xorshifted (i32.wrap_i64 (i64.shr_u
			(i64.xor
				(i64.shr_u (local.get $oldstate) (i64.const 18))
				(local.get $oldstate)
			)
			(i64.const 27)
		))) ;; xorshifted = ((oldstate >> 18) ^ oldstate) >> 27
		(local.set $rot (i32.wrap_i64
			(i64.shr_u (local.get $oldstate) (i64.const 59))
		)) ;; rot = oldstate >> 59
		;; (xorshifted >> rot) | (xorshifted << ((-rot) & 31))
		(i32.rotr (local.get $xorshifted) (local.get $rot))
	)

	(func $pcg32_random (export "pcg32_random") (result f64)
		;; return next() * 0x1p-32
		(f64.mul (f64.convert_i32_u (call $pcg32_next)) (f64.const 0x1p-32))
	)

)
