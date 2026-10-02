#!/bin/bash
COMMON=(
	random.cpp -I.
	-O3 -flto -fno-exceptions -fno-rtti -DNDEBUG
	-mtail-call -msimd128 -msse4.2
	-sENVIRONMENT=web -sEXPORT_ES6=1 --no-entry
	-sSTRICT=1 --closure 1 -sEXPORT_KEEPALIVE=1
	-sMINIMAL_RUNTIME=1 -sMINIMAL_RUNTIME_STREAMING_WASM_INSTANTIATION=1
	-sMALLOC=emmalloc -sINITIAL_HEAP=65536
	-sALLOW_MEMORY_GROWTH=1 -sMEMORY_GROWTH_LINEAR_STEP=65536 -sGROWABLE_ARRAYBUFFERS=1
)

em++ "${COMMON[@]}" -mwide-arithmetic -o random.js
em++ "${COMMON[@]}" -o random-safe.js

rm random-safe.js
perl -0777 -pi -e '
	my $arg;
	s|"random.wasm"|`random\${safe?"":"-safe"}.wasm`|g;
	s|fetch\((new URL\([^)]+\))\)|$arg = $1; "req"|e;
	my $safe_eval = "let safe=WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,0,2,126,126,3,2,1,0,10,10,1,8,0,66,0,66,0,252,22,11]));";
	$_ = qq{$safe_eval\nlet req=fetch($arg);\n$_};
' random.js
