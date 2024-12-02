import run from "aocrunner"

const parseInput = (rawInput) => rawInput

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const lists = input.split('\n').reduce((acc, row) => {
    const [a, b] = row.split(/\s+/)
    acc[0].push(parseInt(a))
    acc[1].push(parseInt(b))
    return acc
  }, [[],[]])
  const leftListSorted = lists[0].sort((a, b) => b-a)
  const rightListSorted = lists[1].sort((a, b) => b-a)
  const results = leftListSorted.map((val, i) => Math.abs(val - rightListSorted[i]))


  return results.reduce((acc, val) => acc + val, 0)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const lists = input.split('\n').reduce((acc, row) => {
    const [a, b] = row.split(/\s+/)
    acc[0].push(parseInt(a))
    acc[1].push(parseInt(b))
    return acc
  }, [[],[]])
  const leftListSorted = lists[0].sort((a, b) => a-b)
  const rightListSorted = lists[1].sort((a, b) => a-b)
  let result = 0
  for (const num of leftListSorted) {
    const appearencesInRight = rightListSorted.filter(val => val === num).length
    result += num * appearencesInRight
  }


  return result
}

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
