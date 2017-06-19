
# pcg32.js

[![open issues](https://img.shields.io/github/issues/mawi12345/pcg32.svg?style=flat)](https://github.com/mawi12345/pcg32/issues) [![npm version](https://img.shields.io/npm/v/pcg32.svg?style=flat)](https://www.npmjs.com/package/pcg32)

A simple fast space-efficient statistically good algorithm for random number generation in JavaScript.

## Installation

```bash
npm install pcg32
```

or

```bash
yarn add pcg32
```

## Usage

```javascript
var PCG32 = require('pcg32')

var seed = 42;
var stream = 54;

var pcg32 = new PCG32(seed, stream);

// Print a radnom number between 0 and 4294967295
console.log(pcg32.random());

// Print a radnom number between 0 and 5
console.log(pcg32.random(6));

// Print 0 or 1
console.log(pcg32.random(2));
```
