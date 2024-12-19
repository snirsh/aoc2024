import run from "aocrunner"

const parseInput = (rawInput) => {
  const [patterns, designs] = rawInput.split('\n\n')
  return {
    patterns: patterns.split(', '),
    designs: designs.trim().split('\n')
  }
}

const makeDesignSolver = (countAll = false) => {
  return (design, patterns, memo = new Map()) => {
    if (design === '') return countAll ? 1 : true
    if (memo.has(design)) return memo.get(design)
    
    let result = countAll ? 0 : false
    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        const subResult = makeDesignSolver(countAll)(design.slice(pattern.length), patterns, memo)
        if (countAll) {
          result += subResult
        } else if (subResult) {
          result = true
          break
        }
      }
    }
    
    memo.set(design, result)
    return result
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const canMakeDesign = makeDesignSolver(false)

  return input.designs.reduce((count, design) => {
    return count + (canMakeDesign(design, input.patterns) ? 1 : 0)
  }, 0)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const countWaysToMakeDesign = makeDesignSolver(true)

  return input.designs.reduce((sum, design) => {
    return sum + countWaysToMakeDesign(design, input.patterns)
  }, 0)
}

run({
  part1: {
    tests: [
      {
        input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
