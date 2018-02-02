# specification

1. plugins should be functions
2. plugins should take in exactly **two** inputs
3. inputs and outputs should match.
	- input as a string should output a string
	- input as an object (as the property input) should output an object, containing the property `output`, in addition to the optional properties `map` and `extra`
4. it should return a promise
