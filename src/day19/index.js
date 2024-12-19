import run from "aocrunner"

const parseInput = (rawInput) => {
  const [patterns, designs] = rawInput.split('\n\n')
  return {
    patterns: patterns.split(', '),
    designs: designs.trim().split('\n')
  }
}

const createPatternMatcher = (shouldCountAll = false) => {
  const matchPattern = (design, availablePatterns, cache = new Map()) => {
    if (design === '') {
      return shouldCountAll ? 1 : true
    }
    
    if (!cache.has(design)) {
      let matchResult = shouldCountAll ? 0 : false
      
      for (const pattern of availablePatterns) {
        if (design.startsWith(pattern)) {
          const remainingDesign = design.slice(pattern.length)
          const subPatternResult = matchPattern(remainingDesign, availablePatterns, cache)
          
          if (shouldCountAll) {
            matchResult += subPatternResult
          } else if (subPatternResult) {
            matchResult = true
            break
          }
        }
      }
      
      cache.set(design, matchResult)
    }
    return cache.get(design)
  }
  
  return matchPattern
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)

  return input.designs.reduce((count, design) => {
    return count + (+createPatternMatcher(false)(design, input.patterns))
  }, 0)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)

  return input.designs.reduce((sum, design) => {
    return sum + createPatternMatcher(true)(design, input.patterns)
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
