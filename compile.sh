#!/bin/bash
em++ random.cpp -Ivendor \
	-Oz -flto -fno-exceptions -fno-rtti -DNDEBUG \
	-sENVIRONMENT=web -sEXPORT_ES6=1 -sSINGLE_FILE=1 \
	-sSTRICT=1 -sJS_MATH=1 \
	--closure 1 -sMINIMAL_RUNTIME=1 -sEXPORT_KEEPALIVE=1 \
	-sMALLOC=emmalloc -sINITIAL_HEAP=65536 \
	-sALLOW_MEMORY_GROWTH=1 -sMEMORY_GROWTH_LINEAR_STEP=65536 \
	-sEXPORTED_FUNCTIONS=_seed,_next,_destroy,_normal,_next_normal,_destroy_normal \
	-o random.js
