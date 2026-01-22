#!/bin/bash
em++ random.cpp -Ivendor \
	-Oz -flto -fno-exceptions -fno-rtti -DNDEBUG \
	-sENVIRONMENT=web -sEXPORT_ES6=1 -sSINGLE_FILE=1 --no-entry \
	-sSTRICT=1 -sJS_MATH=1 \
	--closure 1 -sMINIMAL_RUNTIME=1 -sEXPORT_KEEPALIVE=1 \
	-sMALLOC=emmalloc -sINITIAL_HEAP=65536 \
	-sALLOW_MEMORY_GROWTH=1 -sMEMORY_GROWTH_LINEAR_STEP=65536 \
	-o random.js
