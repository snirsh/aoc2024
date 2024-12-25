import run from "aocrunner"

const parseInput = (rawInput) => {
  const segments = rawInput.split('\n\n')
  const patterns = segments.map(seg => seg.split('\n').map(line => line.split('')))
  const locks = []
  const keys = []
  patterns.map(pattern => {
    const isLock = pattern[0][0] === '#'
    const cols = pattern[0].length
    const heights = []
    for (let i = 0; i < cols; i++) {
      const column = pattern.map(row => row[i])
      const height = isLock ? cols - column.reverse().findIndex(cell => cell === '#') + 1 : cols - column.findIndex(cell => cell === '#') + 1
      heights.push(height)
    }
    if (isLock) {
      locks.push(heights)
    } else {
      keys.push(heights)
    }
  })

  return { locks, keys }
}

const part1 = (rawInput) => {
  const { locks, keys } = parseInput(rawInput)
  let validPairs = 0

  for (const lock of locks) {
    for (const key of keys) {
      let isValid = true
      for (let i = 0; i < lock.length; i++) {
        if (lock[i] + key[i] >= 6) {
          isValid = false
          break
        }
      }
      if (isValid) validPairs++
    }
  }

  return validPairs
}

const part2 = () => {
  return "Merry Christmas! 🎄"
}

run({
  part1: {
    tests: [
      {
        input: `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`,
        expected: 3,
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
