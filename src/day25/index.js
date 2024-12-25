import run from "aocrunner"

const parseInput = (rawInput) => {
  return rawInput.split("\n\n")
    .map(seg => seg.split("\n"))
    .reduce((acc, pattern) => {
      const isLock = pattern[0][0] === '#'
      const columnHeights = Array.from({ length: pattern[0].length }, (_, i) => {
        const column = pattern.map(row => row[i])
        return pattern[0].length - (isLock ? column.reverse() : column).findIndex(cell => cell === '#') + 1
      })

      isLock ? acc.locks.push(columnHeights) : acc.keys.push(columnHeights)
      return acc
    }, { locks: [], keys: [] })
}

const part1 = (rawInput) => {
  const { locks, keys } = parseInput(rawInput)
  return locks.reduce((total, lock) => 
    total + keys.filter(key => 
      lock.every((height, i) => height + key[i] < 6)
    ).length
  , 0)
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
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
