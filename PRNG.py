from wasmtime import Engine, Module, Store, Instance
from hashlib import sha256

engine = Engine()
module = Module.from_file(engine, 'pcg_prng.wasm')

def to_ints(seed):
	seed = sha256(str(seed).encode()).digest()
	return int.from_bytes(seed[:8], signed = False), int.from_bytes(seed[8:16], signed = False)

def prng(seed):
	store = Store(engine)
	exports = Instance(store, module, []).exports(store)
	exports['pcg32_srandom'](store, *to_ints(seed))
	random = exports['pcg32_random']
	return lambda: random(store)

random = prng("test")
print(random())
print(random())
