#!/bin/bash
em++ random.cpp -Ivendor \
	-Oz -flto -fno-exceptions -fno-rtti -DNDEBUG \
	-sENVIRONMENT=web -sEXPORT_ES6=1 -sSINGLE_FILE=1 \
	-sSTRICT=1 -sJS_MATH=1 -sEVAL_CTORS=2 \
	--closure 1 -sMINIMAL_RUNTIME=1 -sEXPORT_KEEPALIVE=1 \
	-sINITIAL_HEAP=0 -sMALLOC=none \
	-sEXPORTED_FUNCTIONS=_seed,_next \
	-o random.js
