# upend

build script i've been using for a while now privately for various projects.

I've been using something like the directory implementation for a very long time now, the rest of the stuff tends to vary very widely between implementations (yes i rewrite it every time i want to use it)

anyways, see example.js for a relatively nonsensical but reader friendly example usage.

gladly taking pull requests, feature requests, suggestions, etc.

btw the devDependencies are actually for the example, the core just requires the dependencies. (chalk)

the whole reason i made this is because rollup, webpack, gulp, required tons of dependencies, and even required native applications and without a proper environment set up with python, a compiler and all that, or when you're working with leveldb or electron things get very complicated, very fast. shoudln't fight the compilers.