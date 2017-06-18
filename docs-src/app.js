const PCG32 = require('../pcg32')

// get refs to the DOM
const logEl = document.getElementById('log')
const seedEl = document.getElementById('seed')
const streamEl = document.getElementById('stream')
const applyButton = document.getElementById('apply')
const log = (msg) => {
  logEl.textContent += msg
}

let seed = 42;
let stream = 54;

// read the seed and stream from location hash
if (location.hash) {
  const params = location.hash.substring(1)
    .split(',')
    .map((a) => parseInt(a))
  seed = params[0]
  stream = params[1]
}

seedEl.value = seed
streamEl.value = stream

const rounds = 5
const pcg32 = new PCG32(seed, stream)

for (let round = 1; round <= rounds; round++) {
    log(`Round ${round}\n`)
    // Make some 32-bit numbers
    log('  32bit:')
    for (let i = 0; i < 6; i++) {
      log(` 0x${pcg32.random().toString(16)}`)
    }
    log('\n')

    // Toss some coins
    log('  Coins: ')
    for (let i = 0; i < 65; i++) {
      log(`${pcg32.random(2) ? 'H' : 'T'}`)
    }
    log('\n')

    // Roll some dice
    log('  Rolls:');
    for (let i = 0; i < 33; i++) {
      log(` ${pcg32.random(6) + 1}`)
    }
    log('\n')

    // Deal some cards
    const SUITS = 4
    const NUMBERS = 13
    const CARDS = 52
    const cards = Array.from({length: CARDS}).map((_, index) => index)

    for (let i = CARDS; i > 1; i--) {
      const chosen = pcg32.random(i)
      const card = cards[chosen]
      cards[chosen] = cards[i - 1]
      cards[i - 1] = card;
    }

    log('  Cards:');

    const number = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
    const suit = ['h', 'c', 'd', 's']
    for (let i = 0; i < CARDS; i++) {
      log(` ${number[Math.floor(cards[i] / SUITS)]}${suit[cards[i] % SUITS]}`)
      if ((i + 1) % 22 === 0) {
        log('\n\t');
      }
    }
    log('\n\n')
}

applyButton.onclick = function() {
  location.hash = `#${parseInt(seedEl.value) || 0},${parseInt(streamEl.value) || 0}`
  location.reload()
}
