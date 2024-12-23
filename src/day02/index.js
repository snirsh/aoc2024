import run from "aocrunner"

const parseInput = (rawInput) => rawInput

const isRowSafe = (row) => {
  let safe = true
  let desc = false
  let asc = false
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] < row[i + 1]) {
      if (desc) {
        safe = false
        break
      } else {
        asc = true
      }
    } else if (row[i] > row[i + 1]) {
      if (asc) {
        safe = false
        break
      } else {
        desc = true
      }
    }
    const currentDiff = Math.abs(row[i + 1] - row[i])
    if (currentDiff < 1 || currentDiff > 3) {
      safe = false
      break
    }
  }
  return safe
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const rows = input
    .split("\n")
    .map((row) => row.split(/\s+/).map((val) => parseInt(val)))
  let safeRows = 0
  for (const row of rows) {
    if (isRowSafe(row)) {
      safeRows++
    }
  }
  return safeRows
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const rows = input
    .split("\n")
    .map((row) => row.split(/\s+/).map((val) => parseInt(val)))
  let safeRows = 0
  for (const row of rows) {
    if (isRowSafe(row)) {
      safeRows++
      continue
    }
    const permutations = []
    for (let i = 0; i < row.length; i++) {
      const copy = [...row]
      copy.splice(i, 1)
      permutations.push([copy, row[i]])
    }
    let validPermutations = 0
    for (const [perm, missingNumber] of permutations) {
      if (isRowSafe(perm)) {
        validPermutations++
        safeRows++
        break
      }
    }
  }
  return safeRows
}

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      },
      {
        input: `51, 50, 47, 44, 42, 40, 38, 38`,
        expected: 1,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
