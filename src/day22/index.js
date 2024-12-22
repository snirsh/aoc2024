import run from "aocrunner"

const calculateNextSecret = (secret, cache = new Map()) => {
  if (cache.has(secret)) {
    return cache.get(secret)
  }

  let result = secret
  result ^= (result * 64) % 16777216
  result ^= Math.floor(result / 32)
  result ^= (result * 2048) % 16777216

  cache.set(secret, result)
  return result % 16777216
}

const parseInput = (rawInput) =>
  rawInput.split("\n").filter(Boolean).map(Number)

const part1 = (rawInput) => {
  const initialSecrets = parseInput(rawInput)

  const finalSecrets = initialSecrets.map((initial) => {
    let current = initial
    for (let i = 0; i < 2000; i++) {
      current = calculateNextSecret(current)
    }
    return current
  })

  return finalSecrets.reduce((sum, num) => sum + num, 0)
}

const part2 = (rawInput) => {
  const initialSecrets = parseInput(rawInput)
  const patternTotals = {}

  for (const initial of initialSecrets) {
    let current = initial
    let lastDigit = current % 10
    const patterns = []

    for (let i = 0; i < 2000; i++) {
      current = calculateNextSecret(current)
      const digit = current % 10
      patterns.push([digit - lastDigit, digit])
      lastDigit = digit
    }

    const seen = new Set()
    for (let i = 0; i < patterns.length - 3; i++) {
      const pat = [
        patterns[i][0],
        patterns[i + 1][0],
        patterns[i + 2][0],
        patterns[i + 3][0],
      ].join(",")

      if (!seen.has(pat)) {
        seen.add(pat)
        const value = patterns[i + 3][1]
        patternTotals[pat] ??= 0
        patternTotals[pat] += value
      }
    }
  }

  return Math.max(...Object.values(patternTotals))
}

run({
  part1: {
    tests: [
      {
        input: `1
10
100
2024`,
        expected: 37327623,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
