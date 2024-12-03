import run from "aocrunner"

const mulRegex = /mul\(\d+,\d+\)/g
const combinedRegex = /mul\(\d+,\d+\)|don't\(\)|do\(\)/g

const parseInput = (rawInput) => rawInput

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const mulMatches = input.match(mulRegex)
  const result = mulMatches.reduce((acc, match) => {
    const [a,b] = match.replace('mul', '').replace('(' ,'').replace(')', '').split(',')
    return acc + a*b
  }, 0)

  return result
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const mulMatches = input.match(combinedRegex)
  let isMulEnabled = true
  let result = 0
  for (const match of mulMatches) {
    if (match.includes('don\'t')) {
      isMulEnabled = false
      continue
    } else if(match.includes('do')) {
      isMulEnabled = true
      continue
    } else if (isMulEnabled) {
      const [a, b] = match.replace('mul', '').replace('(', '').replace(')', '').split(',')
      result += a * b
    }
  }

  return result
}

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
