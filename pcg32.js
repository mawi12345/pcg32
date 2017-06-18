/*
 * PCG Random Number Generation for JavaScript.
 *
 * Copyright 2017 Martin Wind
 * Based on the C implementation of Melissa O'Neill <oneill@pcg-random.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For additional information about the PCG random number generation scheme,
 * including its license and other licensing options, visit
 *
 *     http://www.pcg-random.org
 */
const Long = require('long')
const U = Long.fromString('6364136223846793005', true, 10)

// get the lower 32 bits as positive Number
const unsigned_32bit_int = (long) => (long.low < 0) ? 0x100000000 + long.low : long.low

const unsigned_32bit_long = (long) => Long.fromBits(unsigned_32bit_int(long), 0, true)

const pcg32_random_r = (rng) => {
  // uint64_t oldstate = rng->state;
  const oldstate = rng.rstate

  // rng->state = oldstate * 6364136223846793005ULL + rng->inc;
  rng.rstate = oldstate.multiply(U).add(rng.inc)

  // uint32_t xorshifted = ((oldstate >> 18u) ^ oldstate) >> 27u;
  const xorshifted = unsigned_32bit_long(
    oldstate.shiftRightUnsigned(18).xor(oldstate).shiftRightUnsigned(27)
  )

  // uint32_t rot = oldstate >> 59u;
  const rot = unsigned_32bit_long(oldstate.shiftRightUnsigned(59))

  // return (xorshifted >> rot) | (xorshifted << ((-rot) & 31));
  return unsigned_32bit_int(
    xorshifted.shiftRightUnsigned(rot).or(xorshifted.shiftLeft(rot.negate().and(31)))
  )
}

const pcg32_srandom_r = (initstate, initseq) => {
  const seq = Long.isLong(initseq) ? initseq : Long.fromNumber(initseq, true)
  const rstate = Long.isLong(initstate) ? initstate : Long.fromNumber(initstate, true)

  const rng = {
    rstate: Long.ZERO,
    inc: seq.shiftLeft(1).or(1),
  }

  pcg32_random_r(rng)
  rng.rstate = rng.rstate.add(rstate)
  pcg32_random_r(rng);

  return rng;
}

const pcg32_boundedrand_r = (rng, bound) => {
  // To avoid bias, we need to make the range of the RNG a multiple of
  // bound, which we do by dropping output less than a threshold.
  const threshold = 0x100000000 % bound;

  // Uniformity guarantees that this loop will terminate.  In practice, it
  // should usually terminate quickly; on average (assuming all bounds are
  // equally likely), 82.25% of the time, we can expect it to require just
  // one iteration.  In the worst case, someone passes a bound of 2^31 + 1
  // (i.e., 2147483649), which invalidates almost 50% of the range.  In
  // practice, bounds are typically small and only a tiny amount of the range
  // is eliminated.
  for (;;) {
    const r = pcg32_random_r(rng);
    if (r >= threshold) {
      return r % bound
    }
  }
}

class PCG32 {

  constructor(initstate, initseq) {
    const rng = pcg32_srandom_r(initstate, initseq)
    this.rstate = rng.rstate
    this.inc = rng.inc
  }

  random(bound) {
    if (typeof bound === 'number') {
      return pcg32_boundedrand_r(this, bound)
    }
    return pcg32_random_r(this)
  }
}

module.exports = PCG32
